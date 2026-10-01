import HeroConsole from "@/components/hero-console";
import Rulebook from "@/components/rulebook";
import HouseRules from "@/components/house-rules";
import StreakGauntlet from "@/components/streak-gauntlet";
import OnTheBoard from "@/components/on-the-board";
import TheLedger from "@/components/the-ledger";
import MoneyMechanics from "@/components/money-mechanics";

/* The Scoreboard — Foontro landing page, eight innings. */

export default function Home() {
  return (
    <>
      <HeroConsole />
      <Rulebook />
      <HouseRules />
      <StreakGauntlet />
      <OnTheBoard />
      <TheLedger />
      <MoneyMechanics />
    </>
  );
}
