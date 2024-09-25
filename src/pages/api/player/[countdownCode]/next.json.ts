import type { APIRoute } from "astro";
import { getNextVote } from "../../../../utils/vote";
import { getCountdown } from "../../../../utils/event";

export const GET: APIRoute = async ({ params }) => {
  const countdown = await getCountdown(params.countdownCode as string);
  if (!countdown) {
    return new Response(JSON.stringify({ message: "Countdown not found" }), {
      status: 404,
    });
  }

  const vote = await getNextVote(countdown.code);
  if (!vote) {
    return new Response(JSON.stringify({ message: "No votes left" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(vote));
};
