import { afterEach, describe, expect, it, vi } from "vitest";

import { contentCache } from "./cache";
import { getShopProduct } from "./shop-api";

afterEach(() => {
  contentCache.invalidate();
  vi.unstubAllGlobals();
});

const product = { slug: "router", title: "Router", offers: [] };

describe("getShopProduct", () => {
  it("renders nothing on a failure and does not remember it", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("no", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(product), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    expect(await getShopProduct("router", "de")).toBeNull();
    // The next render asks again rather than reading the failure from the memo.
    expect(await getShopProduct("router", "de")).toEqual(product);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
