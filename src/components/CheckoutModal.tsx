import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./Icons";
import type { ShopKind } from "../utils/shop";
import { startPayment } from "../lib/payments";

// src/components/CheckoutModal.tsx — TUNED from Bayo's checkout modal.
// What changed from Bayo:
// - REMOVED: fetch to /api/pay/init, currency rails, price-mismatch flow,
//   tracking event, external checkout redirect. No payment is taken here.
// - KEPT: the modal layout, item title + kind line, price display,
//   email/name fields, honeypot website field, Escape / click-outside,
//   body scroll lock, and the "soon / free / link / pay" modes as UI only.
// - Use this for a class, an e-book or a source-code item. Pass your own
//   title, price label and description — nothing is invented in this file.

export type CheckoutItem = {
  productId: string;
  title: string;
  kind: ShopKind;
  priceLabel: string;
  description?: string;
  fileFormat?: string;
};

type CheckoutModalProps = {
  item: CheckoutItem;
  onClose: () => void;
};

function kindLine(item: CheckoutItem): string {
  if (item.kind === "class") return "Live class — details on enrolment";
  if (item.kind === "ebook")
    return `E-book — instant ${item.fileFormat || "PDF"} download`;
  return "Source code — instant ZIP download";
}

export default function CheckoutModal({ item, onClose }: CheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot
    if (!email.trim()) {
      setStatus("Add an email address so the item can reach you.");
      emailRef.current?.focus();
      return;
    }
    if (item.kind !== 'source' && item.kind !== 'ebook') return;
    setSubmitting(true);
    setStatus('');
    try {
      await startPayment({ kind: item.kind, product_id: item.productId, email: email.trim(), name: name.trim(), website });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not start checkout. Please try again.');
      setSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="co-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Checkout for ${item.title}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="co-modal" onSubmit={handleSubmit}>
        <span className="co-grab" aria-hidden="true" />
        <div className="co-head">
          <div className="co-item">
            <h3>{item.title}</h3>
            <p>{kindLine(item)}</p>
            {item.description && <p>{item.description}</p>}
          </div>
          <span className="co-price">{item.priceLabel}</span>
          <button
            type="button"
            className="co-close"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <CloseIcon className="co-close-icon" />
          </button>
        </div>
        <div className="co-body">
          {status && <div className="form-status">{status}</div>}
          <div className="field">
            <label htmlFor="co-email">Email</label>
            <input
              id="co-email"
              ref={emailRef}
              type="email"
              required
              value={email}
              placeholder="you@example.com"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="co-name">
              Name <span className="co-optional">(optional)</span>
            </label>
            <input
              id="co-name"
              type="text"
              value={name}
              placeholder="Your name"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field-website" aria-hidden="true">
            <label htmlFor="co-website">Website</label>
            <input
              id="co-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>
        <div className="co-foot">
          <button className="co-pay-btn" type="submit" disabled={submitting}>
            {submitting ? 'Opening secure checkout…' : `Pay ${item.priceLabel}`}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
