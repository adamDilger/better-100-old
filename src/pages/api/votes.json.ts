import type { APIRoute } from "astro";
import { db, Person, Vote } from "astro:db";

type YoutubeItem = {
  id: string;
  title: string;
  thumbnail: string;
};

export const POST: APIRoute = async ({ request }) => {
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
      title: v.title,
      videoId: v.id,
      playedOn: null,
    })),
  ).execute();

  return new Response(JSON.stringify({ message: "Votes submitted" }));
};
