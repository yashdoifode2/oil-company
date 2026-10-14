"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  /** Optional: business hours text shown as a subtitle */
  hours?: string;
};

/**
 * Floating contact widget — a round button that expands to Call / Email / WhatsApp.
 * Values come from the CMS Company Profile so the owner can change them in the
 * Django admin without touching code.
 */
export function FloatingContact({ phone, email, whatsapp, hours }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const hasPhone = Boolean(phone && phone.trim());
  const hasEmail = Boolean(email && email.trim());
  const hasWhatsapp = Boolean(whatsapp && whatsapp.trim());

  if (!hasPhone && !hasEmail && !hasWhatsapp) return null;

  const whatsappDigits = whatsapp ? whatsapp.replace(/[^\d]/g, "") : "";
  const phoneDigits = phone ? phone.replace(/[^\d+]/g, "") : "";

  const actions = [
    hasPhone && {
      key: "call",
      label: "Call us",
      sublabel: phone!,
      href: `tel:${phoneDigits}`,
      bg: "#0b3d91",
      icon: <PhoneIcon />,
    },
    hasWhatsapp && {
      key: "whatsapp",
      label: "WhatsApp",
      sublabel: "Chat on WhatsApp",
      href: `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
        "Hello, I'd like to enquire about your oils."
      )}`,
      bg: "#25D366",
      icon: <WhatsappIcon />,
      external: true,
    },
    hasEmail && {
      key: "email",
      label: "Email us",
      sublabel: email!,
      href: `mailto:${email}`,
      bg: "#f59e0b",
      icon: <MailIcon />,
    },
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    sublabel: string;
    href: string;
    bg: string;
    icon: React.ReactNode;
    external?: boolean;
  }>;

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden"
    >
      {/* Expanded action list */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-200 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {hours && (
          <div className="bg-white shadow-lg rounded-lg px-4 py-2 text-xs text-gray-600 max-w-[220px] text-right border">
            <span className="font-semibold block mb-0.5">Business hours</span>
            {hours}
          </div>
        )}

        {actions.map((a, i) => (
          <a
            key={a.key}
            href={a.href}
            target={a.external ? "_blank" : undefined}
            rel={a.external ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full shadow-lg text-white font-medium text-sm transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: a.bg,
              transitionDelay: `${open ? i * 40 : 0}ms`,
            }}
            aria-label={a.label}
          >
            <span className="hidden sm:flex flex-col items-end leading-tight mr-1">
              <span>{a.label}</span>
              <span className="text-[10px] font-normal opacity-80 max-w-[180px] truncate">
                {a.sublabel}
              </span>
            </span>
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
              {a.icon}
            </span>
          </a>
        ))}
      </div>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl flex items-center justify-center text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, #0a2c66 100%)",
        }}
      >
        <span
          className={`block transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"}`}
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </span>
      </button>
    </div>
  );
}

/* -------------------- Icons (inline SVG, no dependency) -------------------- */

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.07 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.09a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.5 0 .17 5.32.17 11.88c0 2.09.55 4.13 1.6 5.94L0 24l6.36-1.67a11.94 11.94 0 0 0 5.7 1.46h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.17-1.23-6.15-3.43-8.42zM12.07 21.8h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.21-3.77.99 1-3.67-.23-.38a9.88 9.88 0 0 1-1.52-5.27c0-5.46 4.45-9.9 9.93-9.9 2.65 0 5.14 1.04 7.01 2.91a9.85 9.85 0 0 1 2.9 7.01c-.01 5.46-4.45 9.9-9.89 9.9zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.05 2.86 1.2 3.06c.15.2 2.07 3.16 5.02 4.43.7.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2.01-1.41.24-.7.24-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
    </svg>
  );
}