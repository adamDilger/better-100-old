import type { APIRoute } from "astro";
import { getNextVote } from "../../../../utils/vote";

export const GET: APIRoute = async ({ params }) => {
  const vote = await getNextVote(params.eventCode as string);
  if (!vote) {
    return new Response(JSON.stringify({ message: "No votes left" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(vote));
};
