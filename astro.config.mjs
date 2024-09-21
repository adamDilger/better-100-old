// @ts-check
import { defineConfig } from "astro/config";

import db from "@astrojs/db";

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [db(), tailwind(), solidJs()],

  adapter: node({
    mode: "standalone",
  }),
});