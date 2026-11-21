import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { startPayment } from "../lib/payments";
import {
  CloseIcon,
  LockIcon,
} from "./Icons";
import {
  formatCurrencyAmount,
  SUPPORT_CURRENCIES,
  type SupportCurrency,
} from "../utils/shop";
import { useSupportCurrency } from "../hooks/useSupportCurrency";

type SupportModalProps = {
  onClose: () => void;
  initialCurrency?: SupportCurrency;
  initialAmount?: number;
  presetAmounts?: number[];
};

export default function SupportModal({
  onClose,
  initialCurrency,
  initialAmount,
  presetAmounts,
}: SupportModalProps) {
  const currency = useSupportCurrency();
  const [amount, setAmount] = useState<string>(
    typeof initialAmount === "number" && initialAmount > 0
      ? String(initialAmount)
      : "",
  );
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerHeight : 0,
  );
  const amountRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const config = SUPPORT_CURRENCIES[currency];
  const presets =
    currency === "NGN" && presetAmounts ? presetAmounts : config.presets;
  const numericAmount = Number(amount.replace(/[^\d]/g, ""));
  const formattedAmount = amount
    ? formatCurrencyAmount(numericAmount, currency)
    : "";
  // Bayo's pay button stays DISABLED (opacity .7, no hover lift)
  // until there is a valid amount — see his button HTML:
  // <button class="co-pay-btn" disabled>Support</button>, captured
  // WITH his email already filled in and the amount empty. So the
  // gate is the amount only; email is checked on submit, below.
  // (First version of this gate also demanded a valid email first —
  // stricter than Bayo, and wrong: at $50 with the email still
  // empty his button is solid, Ugo's stayed grey. Fixed.)
  const canSubmit = numericAmount >= config.min && numericAmount <= config.max;

  // If a support-strip chip opened this modal with an amount, carry
  // that exact amount + currency in, so the visitor only fills in
  // email/name instead of picking the price again. This syncs on
  // prop changes too (not just first mount), in case the modal is
  // already mounted when a different chip is clicked.
  useEffect(() => {
    if (typeof initialAmount === "number" && initialAmount > 0) {
      setAmount(String(initialAmount));
    }
  }, [initialAmount]);

  useEffect(() => {
    if (initialCurrency && initialCurrency !== currency) setAmount('');
  }, [initialCurrency, currency]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onResize = () => setViewportHeight(window.innerHeight);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot: bots fill this, humans never see it
    if (!numericAmount || numericAmount < config.min) {
      setStatus(
        `Choose an amount of at least ${formatCurrencyAmount(
          config.min,
          currency,
        )}.`,
      );
      amountRef.current?.focus();
      return;
    }
    if (numericAmount > config.max) {
      setStatus(
        `The most you can send in one go is ${formatCurrencyAmount(
          config.max,
          currency,
        )}.`,
      );
      amountRef.current?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("Add a valid email address so a receipt can reach you.");
      return;
    }
    if (!name.trim()) {
      setStatus("Add your name to continue.");
      return;
    }
    setSubmitting(true);
    setStatus("");
    try {
      await startPayment({ kind: 'support', amount: numericAmount, currency,
        email: email.trim(), name: name.trim(), website });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start checkout. Please try again.';
      setStatus(message);
      setSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="co-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Support Mr Ugo"
      style={{ "--co-h": `${viewportHeight}px`, "--kb": "0px" } as CSSProperties}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <span className="co-fill" aria-hidden="true" />
      {ready ? <form className="co-modal sup-sheet" onSubmit={handleSubmit}>
        <span className="co-grab" aria-hidden="true" />
        <div className="co-head">
          <div className="co-item">
            <h3>Support Mr Ugo</h3>
            <p>Support what I'm building next</p>
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
          <p className="sup-payment-methods">{config.label} · {config.sublabel}</p>
          <div className="field">
            <label htmlFor="sup-amount">Amount</label>
            <div className="sup-amount">
              <span aria-hidden="true">{config.symbol}</span>
              <input
                id="sup-amount"
                ref={amountRef}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                value={amount ? numericAmount.toLocaleString("en-US") : ""}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 9))
                }
              />
            </div>
            <div className="sup-quick" aria-label="Quick amounts">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={numericAmount === preset ? "is-on" : undefined}
                  onClick={() => setAmount(String(preset))}
                >
                  {formatCurrencyAmount(preset, currency)}
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
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="sup-name">
              Name
            </label>
            <input
              id="sup-name"
              type="text"
              required
              placeholder="Your name"
              autoComplete="name"
              value={name}
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
          <button className="co-pay-btn" type="submit" disabled={!canSubmit || submitting}>
            <LockIcon className="co-pay-icon" />
            {submitting ? 'Opening secure checkout…' : formattedAmount
              ? `Support with ${formattedAmount}`
              : "Support"}
          </button>
          <p className="sup-payment-methods">Secure checkout by Paystack</p>
        </div>
      </form> : <div className="support-loading" role="status">One moment...</div>}
    </div>,
    document.body,
  );
}
