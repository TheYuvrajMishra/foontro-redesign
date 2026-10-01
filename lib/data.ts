/* Seeded demo data for the playable hero console, the board, and the ledger.
   Everything here is fictional sample data for the interactive demo —
   real marketplace stats are marked REAL below. */

export type Tier = "none" | "bronze" | "silver" | "gold";

export interface Freelancer {
  id: string;
  name: string;
  role: string;
  category: string;
  rate: string;
  rateNote: string;
  rating: number;
  gigs: number;
  streakDays: number;
  tier: Tier;
  blurb: string;
}

export const TIER_META: Record<
  Tier,
  { label: string; ring: string; glow: string; boost: string }
> = {
  none: { label: "ROOKIE", ring: "#6e6a5e", glow: "none", boost: "×1.0" },
  bronze: { label: "BRONZE", ring: "#c98a4b", glow: "0 0 24px rgba(201,138,75,.35)", boost: "×1.25" },
  silver: { label: "SILVER", ring: "#c9cdd3", glow: "0 0 24px rgba(201,205,211,.35)", boost: "×1.6" },
  gold: { label: "GOLD", ring: "#e8b33d", glow: "0 0 32px rgba(232,179,61,.45)", boost: "×2.5" },
};

export const FREELANCERS: Freelancer[] = [
  {
    id: "ananya",
    name: "Ananya Sharma",
    role: "Brand Designer",
    category: "Design",
    rate: "₹4,999",
    rateNote: "/ project",
    rating: 4.9,
    gigs: 212,
    streakDays: 23,
    tier: "gold",
    blurb: "Logos & identity systems. 212 brands shipped, zero missed deadlines.",
  },
  {
    id: "rohan",
    name: "Rohan Verma",
    role: "Next.js Developer",
    category: "Development",
    rate: "₹1,499",
    rateNote: "/ hour",
    rating: 5.0,
    gigs: 148,
    streakDays: 41,
    tier: "gold",
    blurb: "Full-stack builds, shipping weekly. TypeScript, Tailwind, Postgres.",
  },
  {
    id: "priya",
    name: "Priya Nair",
    role: "Video Editor",
    category: "Video",
    rate: "₹9,999",
    rateNote: "/ project",
    rating: 4.8,
    gigs: 96,
    streakDays: 12,
    tier: "silver",
    blurb: "Reels, ads & product films. Cuts that hold attention past 3 seconds.",
  },
  {
    id: "arjun",
    name: "Arjun Mehta",
    role: "Copywriter",
    category: "Writing",
    rate: "₹2,499",
    rateNote: "/ project",
    rating: 4.9,
    gigs: 187,
    streakDays: 8,
    tier: "bronze",
    blurb: "Landing pages & launch copy. Words that make the buy button nervous.",
  },
  {
    id: "ishita",
    name: "Ishita Rao",
    role: "UI Designer",
    category: "Design",
    rate: "₹7,499",
    rateNote: "/ project",
    rating: 5.0,
    gigs: 134,
    streakDays: 19,
    tier: "silver",
    blurb: "Interfaces with opinions. Design systems that survive contact with devs.",
  },
  {
    id: "kabir",
    name: "Kabir Singh",
    role: "Voice-over Artist",
    category: "Audio",
    rate: "₹3,999",
    rateNote: "/ project",
    rating: 4.7,
    gigs: 78,
    streakDays: 5,
    tier: "none",
    blurb: "Hindi + English VO. Broadcast-ready in 48 hours.",
  },
];

export const CATEGORIES = [
  "All",
  "Design",
  "Development",
  "Video",
  "Writing",
  "Audio",
] as const;

export interface GigPreset {
  label: string;
  title: string;
  budget: string;
  amount: number;
}

export const GIG_PRESETS: GigPreset[] = [
  { label: "Logo + brand kit", title: "Logo + brand kit for a D2C startup", budget: "₹4,999", amount: 4999 },
  { label: "Next.js landing page", title: "Landing page in Next.js + Tailwind", budget: "₹24,999", amount: 24999 },
  { label: "60-sec product video", title: "60-second product launch video", budget: "₹14,999", amount: 14999 },
  { label: "SEO blog pack", title: "Pack of 5 SEO blogs, SaaS niche", budget: "₹7,499", amount: 7499 },
];

/* Deterministic "matching": rotate the board by the gig text so the demo
   never hydrates differently on server vs client. */
export function matchFreelancers(seed: string, count = 3): Freelancer[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out: Freelancer[] = [];
  for (let i = 0; i < count; i++) out.push(FREELANCERS[(h + i * 2) % FREELANCERS.length]);
  return out;
}

export interface LedgerRow {
  order: string;
  gig: string;
  amount: string;
  freelancer: string;
  time: string;
}

/* Fictional receipts that demonstrate the escrow -> approve -> pay loop. */
export const LEDGER_SEED: LedgerRow[] = [
  { order: "#F-2049", gig: "Logo + brand kit", amount: "₹4,999", freelancer: "Ananya S.", time: "2m ago" },
  { order: "#F-2048", gig: "Next.js landing page", amount: "₹24,999", freelancer: "Rohan V.", time: "11m ago" },
  { order: "#F-2047", gig: "60-sec product video", amount: "₹14,999", freelancer: "Priya N.", time: "26m ago" },
  { order: "#F-2046", gig: "5 SEO blogs", amount: "₹7,499", freelancer: "Arjun M.", time: "48m ago" },
  { order: "#F-2045", gig: "App UI screens", amount: "₹11,999", freelancer: "Ishita R.", time: "1h ago" },
  { order: "#F-2044", gig: "Hindi voice-over", amount: "₹3,999", freelancer: "Kabir S.", time: "2h ago" },
];

/* REAL, verified facts about Foontro (from foontro.com, Sep 2026). */
export const REAL_FACTS = {
  creators: "5,000+",
  creatorsNote: "verified creators & teams",
  market: "India-first",
  flow: ["Browse verified services", "Order — money held in escrow", "Chat & revise", "Approve — payment released"],
  streaksNote: "Login Streaks are live: earn metallic frames & boost search visibility.",
} as const;

/* Streak tiers for the playable gauntlet.
   TODO(yuvraj): confirm real tier names + day thresholds from the app —
   these are concept placeholders, not the shipped values. */
export const STREAK_TIERS = [
  { days: 7, tier: "bronze" as Tier, name: "BRONZE FRAME" },
  { days: 15, tier: "silver" as Tier, name: "SILVER FRAME" },
  { days: 30, tier: "gold" as Tier, name: "GOLD FRAME" },
];
