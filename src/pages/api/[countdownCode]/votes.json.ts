import type { APIRoute } from "astro";
import { db, Person, Vote } from "astro:db";
import { getCountdown } from "../../../utils/event";

type YoutubeItem = {
  id: string;
  title: string;
  thumbnailUrl: string;
  thumbnailLgUrl: string;
};

export const POST: APIRoute = async ({ params, request }) => {
  const body = (await request.json()) as { name: string; votes: YoutubeItem[] };
  console.log(body);

  if (!body.name) {
    return new Response(JSON.stringify({ message: "No name provided" }), {
      status: 400,
    });
  }

  if (body.name.length > 30) {
    return new Response(
      JSON.stringify({ message: "Name longer than 30 characters" }),
      { status: 400 },
    );
  }

  if (!body.votes?.length) {
    return new Response(JSON.stringify({ message: "No votes provided" }), {
      status: 400,
    });
  }

  const countdown = await getCountdown(params.countdownCode!);
  if (!countdown) {
    return new Response(JSON.stringify({ message: "Countdown not found" }), {
      status: 404,
    });
  }

  if (countdown.started) {
    return new Response(
      JSON.stringify({ message: "Voting has closed for this countdown" }),
      {
        status: 400,
      },
    );
  }

  const person = await db.insert(Person).values({ name: body.name }).execute();

  if (!person.lastInsertRowid) {
    return new Response(
      JSON.stringify({ message: "Failed to insert person" }),
      { status: 500 },
    );
  }

  console.log(`created person ${body.name}: ${person.lastInsertRowid}`);

  await db
    .insert(Vote)
    .values(
      body.votes.map((v) => ({
        sort: Math.floor(Math.random() * 1000000000),
        personId: Number(person.lastInsertRowid),
        countdownId: countdown.id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        thumbnailLgUrl: v.thumbnailLgUrl,
        videoId: v.id,
        playedOn: null,
      })),
    )
    .execute();

  return new Response(JSON.stringify({ message: "Votes submitted" }));
};
