import type { APIRoute } from "astro";
import { publicRuntimeResponse } from "~/lib/connection";

export const prerender = false;
export const GET: APIRoute = () => publicRuntimeResponse();
