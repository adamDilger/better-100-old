import { db, eq, Countdown } from "astro:db";

export async function getCountdown(code: string) {
  const countdowns = await db
    .select()
    .from(Countdown)
    .where(eq(Countdown.code, code.toUpperCase()))
    .limit(1);

  if (!countdowns.length) {
    return null;
  }

  return countdowns[0];
}
