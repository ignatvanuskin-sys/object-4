"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-b border-ink/25 bg-transparent py-4 text-[1rem] text-ink placeholder:text-ink/35 transition-colors duration-300 hover:border-ink/50 focus:border-signal focus:outline-none";

const labelCls = "label block text-ink/45";

/**
 * Deliberately three fields. The payload is normalised, validated client-side and
 * posted to /api/booking, which is the single place where a CRM / Telegram bot /
 * e-mail can be plugged in later (see app/api/booking/route.ts).
 * If that endpoint is unreachable, the fallback hands the same data to WhatsApp
 * so a lead is never lost.
 */
export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      comment: String(data.get("comment") ?? "").trim(),
      trap: String(data.get("company") ?? ""),
    };

    if (payload.name.length < 2) {
      setStatus("error");
      setError("Укажите имя — как к вам обращаться.");
      return;
    }
    const digits = payload.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setStatus("error");
      setError("Проверьте номер телефона: нужно не меньше 10 цифр.");
      return;
    }
    if (payload.trap) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          comment: payload.comment,
        }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (!res.ok || !json.ok) throw new Error("request failed");
      setStatus("sent");
      form.reset();
    } catch {
      const text = `Заявка с сайта.%0AИмя: ${encodeURIComponent(
        payload.name,
      )}%0AТелефон: ${encodeURIComponent(payload.phone)}%0AКомментарий: ${encodeURIComponent(
        payload.comment || "—",
      )}`;
      setStatus("error");
      setError(
        `Заявка не ушла с сервера. Отправьте её напрямую в WhatsApp — данные уже подставлены: ${site.whatsapp}?text=${text}`,
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-ink/20 p-8">
        <p className="label text-signal">Заявка отправлена</p>
        <p className="display mt-4 text-[1.5rem] text-ink">Заявка у администратора.</p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-graphite">
          Он свяжется по указанному номеру, подтвердит время и назовёт итоговую сумму. Если нужно
          быстрее — позвоните или напишите в WhatsApp.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={site.phoneHref}
            className="label flex min-h-[50px] flex-1 items-center justify-center bg-ink px-6 text-paper transition-colors duration-300 hover:bg-signal"
          >
            {site.phoneLabel}
          </a>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="label flex min-h-[50px] flex-1 items-center justify-center border border-ink/25 px-6 text-ink transition-colors duration-300 hover:border-ink"
          >
            WhatsApp
          </a>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="label wipe mt-6 text-ink/50"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-ink/20 p-6 sm:p-8">
      <p className="label text-ink/45">Заявка на квест</p>

      <div className="mt-6 grid gap-6">
        <div>
          <label className={labelCls} htmlFor="bf-name">
            Имя
          </label>
          <input
            id="bf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Как к вам обращаться"
            className={field}
            aria-describedby={error ? "bf-error" : undefined}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="bf-phone">
            Телефон
          </label>
          <input
            id="bf-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+7 ___ ___ __ __"
            className={field}
            aria-describedby={error ? "bf-error" : undefined}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="bf-comment">
            Комментарий
          </label>
          <textarea
            id="bf-comment"
            name="comment"
            rows={3}
            placeholder="Дата, время, локация и количество человек"
            className={`${field} resize-none`}
          />
        </div>

        {/* Honeypot — hidden from users and assistive tech. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="bf-company">Название компании</label>
          <input id="bf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {error ? (
        <p id="bf-error" role="alert" className="mt-5 text-[0.875rem] leading-relaxed text-signal">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="label mt-7 flex min-h-[54px] w-full items-center justify-center bg-signal px-6 text-white transition-colors duration-300 hover:bg-signal-deep disabled:opacity-60"
      >
        {status === "sending" ? "Отправляем…" : "Получить консультацию"}
      </button>

      <p className="mt-4 text-[0.75rem] leading-relaxed text-ink/45">
        Отправляя форму, вы соглашаетесь на обработку указанных данных для связи по заявке.
        Регистрация и личный кабинет не нужны.
      </p>
    </form>
  );
}
