import { assertEquals } from "std/assert/assert_equals.ts";
import { assertExists } from "std/assert/assert_exists.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";
import { ensureShopName } from "../helpers.ts";

loadSync({ export: true });

Deno.test("Get shop", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const shop = await api.getShop();

    assertExists(shop);
    assertEquals(shop.myshopify_domain, ensureShopName(Deno.env.get("SHOP_NAME") as string));
});
