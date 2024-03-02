import { assert } from "std/assert/assert.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";

loadSync({ export: true });

Deno.test("Get recurring charges", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });

    const charges = await api.getRecurringCharges();

    assert(Array.isArray(charges));
});
