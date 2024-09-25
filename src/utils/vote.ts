import { and, count, db, eq, Countdown, isNull, Person, Vote } from "astro:db";

export type PlayerVote = {
  id: number;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  thumbnailLgUrl: string;
  personName: string;

  count: number;
};

export async function getNextVote(countdownCode: string): Promise<PlayerVote> {
  const votes = await db
    .select({
      id: Vote.id,
      title: Vote.title,
      videoId: Vote.videoId,
      thumbnailUrl: Vote.thumbnailUrl,
      thumbnailLgUrl: Vote.thumbnailLgUrl,
      personName: Person.name,
    })
    .from(Vote)
    .innerJoin(Person, eq(Vote.personId, Person.id))
    .innerJoin(Countdown, eq(Vote.countdownId, Countdown.id))
    .where(
      and(
        isNull(Vote.playedOn),
        eq(Countdown.code, countdownCode.toUpperCase()),
      ),
    )
    .limit(1)
    .orderBy(Vote.sort);

  const currentCount = await db
    .select({ count: count() })
    .from(Vote)
    .where(isNull(Vote.playedOn));

  return { ...votes[0], count: currentCount[0].count };
}

export function markComplete(id: number) {
  return db
    .update(Vote)
    .set({ playedOn: new Date() })
    .where(eq(Vote.id, id))
    .run();
}
