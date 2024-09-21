import type { APIRoute } from "astro";
import { db, eq, Event, Person, Vote } from "astro:db";

type YoutubeItem = {
  id: string;
  title: string;
  thumbnailUrl: string;
  thumbnailLgUrl: string;
};

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json() as { name: string; votes: YoutubeItem[] };
  console.log(body);

  if (!body.name) {
    return new Response(
      JSON.stringify({ message: "No name provided" }),
      { status: 400 },
    );
  }

  if (!body.votes?.length) {
    return new Response(
      JSON.stringify({ message: "No votes provided" }),
      { status: 400 },
    );
  }

  const event = (await db.select().from(Event).where(
    eq(Event.code, params.eventCode!.toUpperCase()),
  ))[0];

  if (!event) {
    return new Response(
      JSON.stringify({ message: "Event not found" }),
      { status: 404 },
    );
  }

  const person = await db.insert(Person)
    .values({ name: body.name })
    .execute();

  if (!person.lastInsertRowid) {
    return new Response(
      JSON.stringify({ message: "Failed to insert person" }),
      { status: 500 },
    );
  }

  console.log(`created person ${body.name}: ${person.lastInsertRowid}`);

  await db.insert(Vote).values(
    body.votes.map((v) => ({
      sort: Math.floor(Math.random() * 10000000),
      personId: Number(person.lastInsertRowid),
      eventId: event.id,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      thumbnailLgUrl: v.thumbnailLgUrl,
      videoId: v.id,
      playedOn: null,
    })),
  ).execute();

  return new Response(JSON.stringify({ message: "Votes submitted" }));
};
