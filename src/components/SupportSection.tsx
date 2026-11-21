import { useState } from "react";
import SupportModal from "./SupportModal";
import { HeartIcon } from "./Icons";
import {
  formatCurrencyAmount,
  SUPPORT_CURRENCIES,
  type SupportCurrency,
} from "../utils/shop";
import { useSupportCurrency } from "../hooks/useSupportCurrency";

// src/components/SupportSection.tsx — WHOLE FILE, rewritten 2026-10-29.
// This is the file that was missing the amount: the old version only
// held an `open` boolean and rendered <SupportModal onClose={...} />,
// so the modal could never know which price chip was clicked and
// always opened at 0. This version holds the selection itself.
//
// How it works, in plain words:
// - The strip presets follow the detected currency: Nigeria ->
//   ₦2,000 / ₦5,000 / ₦10,000 / ₦20,000, outside Nigeria ->
//   $5 / $10 / $25 / $50, plus an "Other" chip.
// - Detection is NOT region alone (see detectSupportCurrency in
//   shop.ts): device timezone, languages and UTC offset are scored, and IP
//   country, when a backend later supplies it, counts least —
//   because a VPN spoofs IP. A Nigerian at home on a foreign VPN
//   still gets Naira; someone physically outside Nigeria still
//   gets dollars.
// - Clicking a preset chip stores { amount, currency } and opens
//   the modal with those two values passed in as initialAmount +
//   initialCurrency, so the amount is already filled in, that
//   preset is highlighted, and the button already says
//   "Support with $25" / "Support with ₦20,000".
//   The visitor only fills in email and name from there.
// - Clicking "Other" stores { currency } with no amount, so the
//   modal opens empty and the visitor picks their own amount.
// - Nothing else changed: same section classes your App.css already
//   styles (.support, .support-row, .support-text, .support-actions,
//   .support-chip, .support-chip.is-other), same heading and intro.

type SupportSelection = {
  amount?: number;
  currency: SupportCurrency;
};

export default function SupportSection() {
  const [selection, setSelection] = useState<SupportSelection | null>(null);

  const stripCurrency = useSupportCurrency();
  const stripPresets = SUPPORT_CURRENCIES[stripCurrency].presets;

  return (
    <section className="support" id="support">
      <div className="support-row">
        <div className="support-text">
          <h2>
            <HeartIcon className="support-heart" />
            Support the work
          </h2>
          <p>If my work has helped you, support what I'm building next.</p>
        </div>
        <div className="support-actions" aria-label="Support with">
          {stripPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              className="support-chip"
              onClick={() =>
                setSelection({ amount: preset, currency: stripCurrency })
              }
            >
              {formatCurrencyAmount(preset, stripCurrency)}
            </button>
          ))}
          <button
            type="button"
            className="support-chip is-other"
            onClick={() => setSelection({ currency: stripCurrency })}
          >
            Other
          </button>
        </div>
      </div>

      {selection && (
        <SupportModal
          initialCurrency={stripCurrency}
          initialAmount={selection.amount}
          onClose={() => setSelection(null)}
        />
      )}
    </section>
  );
}
