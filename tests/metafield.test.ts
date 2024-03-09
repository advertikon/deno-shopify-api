import { assert } from "std/assert/assert.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";
import { MetafieldResource } from "../constants.ts";

loadSync({ export: true });

Deno.test("Metafield", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const products = await api.getProducts({ limit: 1 });
    const metafields = await api.getResourceMetafields(MetafieldResource.PRODUCT, products[0].id);

    assert(Array.isArray(metafields));
});
