import { count, db, eq, isNull, Person, sql, Vote } from "astro:db";

export async function getNextVote() {
  const votes = await db.select({
    id: Vote.id,
    title: Vote.title,
    videoId: Vote.videoId,
    personName: Person.name,
  })
    .from(Vote)
    .innerJoin(Person, eq(Vote.personId, Person.id))
    .where(isNull(Vote.playedOn))
    .limit(1)
    .orderBy(Vote.sort);

  const currentCount = await db.select({ count: count() })
    .from(Vote)
    .where(isNull(Vote.playedOn));

  return { ...votes[0], count: currentCount[0].count };
}

export function markComplete(id: number) {
  return db.update(Vote)
    .set({ playedOn: new Date() })
    .where(eq(Vote.id, id))
    .run();
}
