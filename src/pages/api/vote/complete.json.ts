import type { APIRoute } from "astro";
import { getNextVote, markComplete } from "../../../utils/vote";

export const GET: APIRoute = async () => {
  const voteToComplete = await getNextVote();
  if (!voteToComplete) {
    return new Response(
      JSON.stringify({ message: "No votes left" }),
      { status: 404 },
    );
  }

  await markComplete(voteToComplete.id);

  const nextVote = await getNextVote();
  if (!nextVote) {
    return new Response(
      JSON.stringify({ message: "No votes left" }),
      { status: 404 },
    );
  }

  return new Response(JSON.stringify(nextVote));
};
