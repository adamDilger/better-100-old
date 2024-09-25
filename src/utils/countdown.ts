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

export async function createCountdown(
  countdownName: string,
  maxVoteCount: number,
) {
  let code: string;

  let exists = false;
  do {
    code = makeCode();

    const existingCountdowns = await db
      .select({ id: Countdown.id })
      .from(Countdown)
      .where(eq(Countdown.code, code));

    exists = existingCountdowns.length > 0;
    if (exists) console.log(`Code ${code} exists, trying again`);
  } while (exists);

  let c: any;
  try {
    c = await db
      .insert(Countdown)
      .values({ code, name: countdownName, maxVoteCount: maxVoteCount })
      .execute();
    console.log("Countdown created:", countdownName, code);
  } catch (error: any) {
    console.error(
      `Failed to create countdown: ${countdownName}`,
      error.message,
    );
    throw error;
  }

  return code;
}

function makeCode(length = 5) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
