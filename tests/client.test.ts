// deno-lint-ignore-file require-await
import { assertEquals } from "std/assert/assert_equals.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";

loadSync({ export: true });

Deno.test("Event emitter", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    let message = "";
    api.on("test", (m) => {
        message = m;
    });
    api.emit("test", "Hello, world!");
    assertEquals(message, "Hello, world!");
});
