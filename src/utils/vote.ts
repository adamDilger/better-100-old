import { and, count, db, eq, Event, isNull, Person, Vote } from "astro:db";

export type PlayerVote = {
  id: number;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  thumbnailLgUrl: string;
  personName: string;

  count: number;
};

export async function getNextVote(eventCode: string): Promise<PlayerVote> {
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
    .innerJoin(Event, eq(Vote.eventId, Event.id))
    .where(and(isNull(Vote.playedOn), eq(Event.code, eventCode.toUpperCase())))
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
