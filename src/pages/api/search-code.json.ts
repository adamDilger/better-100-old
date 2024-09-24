import type { APIRoute } from "astro";
import { db, eq, Event } from "astro:db";

export const GET: APIRoute = async ({ url }) => {
  const search = new URL(url).searchParams.get("code");

  if (!search) {
    return new Response(JSON.stringify({ message: "No code provided" }), {
      status: 400,
    });
  }

  let res = await db
    .select({ name: Event.name, code: Event.code })
    .from(Event)
    .where(eq(Event.code, search));

  if (res.length === 0) {
    return new Response(JSON.stringify({ message: "Code not found" }), {
      status: 404,
    });
  }

  const data = res[0];
  return new Response(JSON.stringify(data));
};
