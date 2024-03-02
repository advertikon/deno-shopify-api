import { assert } from "std/assert/assert.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";

loadSync({ export: true });

Deno.test("Get custom collection", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    const collections = await api.getCustomCollections({ limit });

    assert(Array.isArray(collections));
});

Deno.test("Get smart collection", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    const collections = await api.getSmartCollections({ limit });

    assert(Array.isArray(collections));
});
