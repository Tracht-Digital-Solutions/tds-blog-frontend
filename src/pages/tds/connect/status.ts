import type { APIRoute } from "astro";
import { connectStatusResponse } from "~/lib/connection";

export const prerender = false;
export const GET: APIRoute = () => connectStatusResponse();
