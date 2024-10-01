/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createToken } from "../controllers/create-token";

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/":
        const data = {
          message: "Hello World!",
          status: "success",
        };

        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });

      case "/create-token":
        if (request.method !== "POST") {
          return new Response(
            JSON.stringify({ result: "Method not allowed" }),
            { status: 405, headers: { "Content-Type": "application/json" } }
          );
        }
        return createToken(request, env);

      default:
        return new Response(JSON.stringify({ result: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
    }
  },
};
