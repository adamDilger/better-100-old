import type { APIRoute } from "astro";
import { getNextVote, markComplete } from "../../../../utils/vote";

export const GET: APIRoute = async ({ params }) => {
  const voteToComplete = await getNextVote(params.eventCode as string);
  if (!voteToComplete) {
    return new Response(
      JSON.stringify({ message: "No votes left" }),
      { status: 404 },
    );
  }

  await markComplete(voteToComplete.id);

  const nextVote = await getNextVote(params.eventCode as string);
  if (!nextVote) {
    return new Response(
      JSON.stringify({ message: "No votes left" }),
      { status: 404 },
    );
  }

  return new Response(JSON.stringify(nextVote));
};
