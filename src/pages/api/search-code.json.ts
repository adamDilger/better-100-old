import type { APIRoute } from "astro";
import { db, eq, Countdown } from "astro:db";

export const GET: APIRoute = async ({ url }) => {
  const search = new URL(url).searchParams.get("code");

  if (!search) {
    return new Response(JSON.stringify({ message: "No code provided" }), {
      status: 400,
    });
  }

  if (search.length !== 4) {
    return new Response(JSON.stringify({ message: "Invalid code length" }), {
      status: 400,
    });
  }

  let res = await db
    .select({ name: Countdown.name, code: Countdown.code })
    .from(Countdown)
    .where(eq(Countdown.code, search));

  if (res.length === 0) {
    return new Response(JSON.stringify({ message: "Code not found" }), {
      status: 404,
    });
  }

  const data = res[0];
  return new Response(JSON.stringify(data));
};
