import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, HeartIcon } from "./Icons";

// src/components/SupportModal.tsx — TUNED from Bayo's support sheet.
// What changed from Bayo:
// - REMOVED: fetch to /api/support/options and /api/support/init, USD rail,
//   localStorage buyer remember, tracking event. No payment is taken here.
// - KEPT: the sheet layout, amount presets, email/name fields, honeypot
//   website field, Escape / click-outside to close, body scroll lock.
// - Amounts are YOUR support tiers (from your own specification), not a
//   backend fetch. Until you supply a payment link, the pay button shows
//   "Checkout not connected yet" and charges nobody. That is deliberate.

type SupportModalProps = {
  onClose: () => void;
  presetAmounts?: number[];
};

const DEFAULT_PRESETS = [2000, 5000, 10000, 20000];

export default function SupportModal({
  onClose,
  presetAmounts = DEFAULT_PRESETS,
}: SupportModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot: bots fill this, humans never see it
    const value = Number(amount.replace(/[^\d]/g, ""));
    if (!value || value < 500) {
      setStatus("Choose an amount of at least ₦500.");
      amountRef.current?.focus();
      return;
    }
    if (!email.trim()) {
      setStatus("Add an email address so a receipt can reach you.");
      return;
    }
    // TODO: wire a real payment link here when you supply one.
    // Do not present this button as live until then.
    setStatus(
      "Checkout is not connected yet — no payment was taken. Add your payment link to enable this.",
    );
  }

  return createPortal(
    <div
      className="co-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Support"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="co-modal sup-sheet" onSubmit={handleSubmit}>
        <span className="co-grab" aria-hidden="true" />
        <div className="co-head">
          <div className="co-item">
            <h3>Support the work</h3>
            <p>Keeps the free classes, code and guides coming.</p>
          </div>
          <button
            type="button"
            className="co-close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon className="co-close-icon" />
          </button>
        </div>
        <div className="co-body" ref={dialogRef}>
          {status && <div className="form-status">{status}</div>}
          <div className="field">
            <label htmlFor="sup-amount">Amount</label>
            <div className="sup-amount">
              <span aria-hidden="true">₦</span>
              <input
                id="sup-amount"
                ref={amountRef}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                value={amount ? Number(amount).toLocaleString("en-US") : ""}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 9))
                }
              />
            </div>
            <div className="sup-quick" aria-label="Quick amounts">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={Number(amount) === preset ? "is-on" : undefined}
                  onClick={() => setAmount(String(preset))}
                >
                  ₦{preset.toLocaleString("en-NG")}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="sup-email">Email</label>
            <input
              id="sup-email"
              type="email"
              required
              value={email}
              placeholder="you@example.com"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="sup-name">
              Name <span className="co-optional">(optional)</span>
            </label>
            <input
              id="sup-name"
              type="text"
              value={name}
              placeholder="Your name"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field-website" aria-hidden="true">
            <label htmlFor="sup-website">Website</label>
            <input
              id="sup-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>
        <div className="co-foot">
          <button className="co-pay-btn" type="submit">
            <HeartIcon className="co-pay-icon" />
            {amount
              ? `Support with ₦${Number(amount).toLocaleString("en-NG")}`
              : "Support"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
