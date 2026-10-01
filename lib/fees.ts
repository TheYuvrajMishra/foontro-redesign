/* Money mechanics for the pricing section.
   ⚠️ TODO(yuvraj): every value below is a PLACEHOLDER. Foontro publishes no
   public commission % or payout schedule, and inventing one for your own
   company's landing page would be worse than a blank. Fill these in and the
   section renders real numbers automatically. Until then the UI shows the
   mechanic honestly and marks each figure "to confirm". */

export interface FeeRow {
  label: string;
  value: string;
  note: string;
  confirmed: boolean;
}

export const FEE_ROWS: FeeRow[] = [
  {
    label: "Platform fee",
    value: "— %",
    note: "Charged on each order, shown before you pay. Never after.",
    confirmed: false,
  },
  {
    label: "Payout timing",
    value: "— days",
    note: "From client approval to money in the freelancer's account.",
    confirmed: false,
  },
  {
    label: "Payout rails",
    value: "UPI · Bank transfer",
    note: "India-first rails. No minimum withdrawal games.",
    confirmed: false,
  },
  {
    label: "Escrow hold",
    value: "₹0 locked wrong",
    note: "Client money is locked before work starts and released only on approval.",
    confirmed: true,
  },
];

export const MONEY_SENTENCE =
  "The money waits in the vault until the work is approved — everything else is details.";
