import type { APIRoute } from "astro";
import { connectResponse } from "~/lib/connection";

export const prerender = false;
export const POST: APIRoute = ({ request }) => connectResponse(request);
