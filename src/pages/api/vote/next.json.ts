import type { APIRoute } from "astro";
import { getNextVote } from "../../../utils/vote";

export const GET: APIRoute = async () => {
  const vote = await getNextVote();
  if (!vote) {
    return new Response(
      JSON.stringify({ message: "No votes left" }),
      { status: 404 },
    );
  }

  return new Response(JSON.stringify(vote));
};
