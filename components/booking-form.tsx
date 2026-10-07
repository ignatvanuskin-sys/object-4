"use client";

import { useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";
type FieldName = "name" | "phone";

/**
 * No `focus:outline-none` here: removing the outline needs a replacement that
 * a keyboard user can actually see. The global `:focus-visible` ring is that
 * replacement, and the border colour shift stays for pointer feedback.
 */
const fieldBase =
  "w-full border-b bg-transparent py-4 text-[1rem] text-paper placeholder:text-paper/65 transition-colors duration-300";

/** The invalid state has to be visible, not just announced. */
const fieldCls = (bad = false) =>
  `${fieldBase} ${
    bad ? "border-ember bg-ember/5" : "border-white/20 hover:border-white/40 focus:border-signal"
  }`;

/** Never set two colour utilities at once — the stylesheet order would decide. */
const labelCls = (bad = false) =>
  `label block ${bad ? "text-ember" : "text-paper/55"}`;

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
  const [invalid, setInvalid] = useState<FieldName | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

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
      setInvalid("name");
      setError("Укажите имя — как к вам обращаться.");
      nameRef.current?.focus();
      return;
    }
    const digits = payload.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setStatus("error");
      setInvalid("phone");
      setError("Проверьте номер телефона: нужно не меньше 10 цифр.");
      phoneRef.current?.focus();
      return;
    }
    if (payload.trap) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setError(null);
    setInvalid(null);

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
      <div className="border border-white/14 p-8">
        <p className="label text-ember">Заявка отправлена</p>
        <p className="display mt-4 text-[1.5rem] text-paper">Заявка у администратора.</p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-paper/65">
          Он свяжется по указанному номеру, подтвердит время и назовёт итоговую сумму. Если нужно
          быстрее — позвоните или напишите в WhatsApp.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={site.phoneHref}
            className="label flex min-h-[50px] flex-1 items-center justify-center bg-paper px-6 text-paper transition-colors duration-300 hover:bg-signal"
          >
            {site.phoneLabel}
          </a>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="label flex min-h-[50px] flex-1 items-center justify-center border border-white/20 px-6 text-paper transition-colors duration-300 hover:border-paper"
          >
            WhatsApp
          </a>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="label wipe inline-flex min-h-11 items-center mt-6 text-paper/55"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-white/14 p-6 sm:p-8">
      <p className="label text-paper/55">Заявка на квест</p>

      <div className="mt-6 grid gap-6">
        <div>
          <label className={labelCls(invalid === "name")} htmlFor="bf-name">
            Имя
          </label>
          <input
            ref={nameRef}
            id="bf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Например: Айдана…"
            className={fieldCls(invalid === "name")}
            aria-invalid={invalid === "name"}
            aria-describedby={invalid === "name" ? "bf-error" : undefined}
          />
        </div>

        <div>
          <label className={labelCls(invalid === "phone")} htmlFor="bf-phone">
            Телефон
          </label>
          <input
            ref={phoneRef}
            id="bf-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+7 ___ ___ __ __…"
            className={fieldCls(invalid === "phone")}
            aria-invalid={invalid === "phone"}
            aria-describedby={invalid === "phone" ? "bf-error" : undefined}
          />
        </div>

        <div>
          <label className={labelCls()} htmlFor="bf-comment">
            Комментарий
          </label>
          <textarea
            id="bf-comment"
            name="comment"
            rows={3}
            placeholder="Дата, время, локация, количество человек…"
            className={`${fieldCls()} resize-none`}
          />
        </div>

        {/* Honeypot — hidden from users and assistive tech. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="bf-company">Название компании</label>
          <input id="bf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {error ? (
        <p id="bf-error" role="alert" className="mt-5 text-[0.875rem] leading-relaxed text-ember">
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

      <p className="mt-4 text-[0.75rem] leading-relaxed text-paper/55">
        Отправляя форму, вы соглашаетесь на обработку указанных данных для связи по заявке.
        Регистрация и личный кабинет не нужны.
      </p>
    </form>
  );
}
