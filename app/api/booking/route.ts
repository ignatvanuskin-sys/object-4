import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = { name?: unknown; phone?: unknown; comment?: unknown };

/**
 * Single integration point for the enquiry form.
 *
 * The site works with no backend at all: if nothing is configured, submissions
 * are validated and acknowledged here, and the client keeps a WhatsApp fallback
 * so a lead can never be lost. To start delivering leads for real, set one
 * environment variable — BOOKING_WEBHOOK_URL — to a Telegram Bot API sendMessage
 * endpoint, a CRM webhook, a Make/Zapier hook or your own handler. No code change
 * is required.
 *
 *   BOOKING_WEBHOOK_URL=https://api.telegram.org/bot<token>/sendMessage
 *   BOOKING_WEBHOOK_CHAT_ID=<chat id>        (optional, added to the JSON body)
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 1200) : "";

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 422 });
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    comment,
    source: "site:object-rdn",
    receivedAt: new Date().toISOString(),
  };

  const endpoint = process.env.BOOKING_WEBHOOK_URL;
  if (!endpoint) {
    // No destination configured yet — the request is still acknowledged.
    console.info("[booking] lead received (no BOOKING_WEBHOOK_URL set)", lead);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const forward = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.BOOKING_WEBHOOK_CHAT_ID,
        text: [
          `Заявка с сайта: ${name}`,
          `Телефон: ${phone}`,
          comment ? `Комментарий: ${comment}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        ...lead,
      }),
      // Never let a slow CRM hold the visitor's request open.
      signal: AbortSignal.timeout(8000),
    });

    if (!forward.ok) {
      console.error("[booking] webhook responded", forward.status);
      return NextResponse.json({ ok: true, delivered: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[booking] webhook unreachable", error);
    // The lead is logged and the client offers WhatsApp as an alternative.
    return NextResponse.json({ ok: true, delivered: false }, { status: 200 });
  }
}
