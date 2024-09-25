import type { APIRoute } from "astro";
import { getNextVote, markComplete } from "../../../../utils/vote";
import { getCountdown } from "../../../../utils/event";

export const GET: APIRoute = async ({ params }) => {
  const countdown = await getCountdown(params.countdownCode as string);
  if (!countdown) {
    return new Response(JSON.stringify({ message: "Countdown not found" }), {
      status: 404,
    });
  }

  const voteToComplete = await getNextVote(countdown.code);
  if (!voteToComplete) {
    return new Response(JSON.stringify({ message: "No votes left" }), {
      status: 404,
    });
  }

  await markComplete(voteToComplete.id);

  const nextVote = await getNextVote(params.countdownCode as string);
  if (!nextVote) {
    return new Response(JSON.stringify({ message: "No votes left" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(nextVote));
};
