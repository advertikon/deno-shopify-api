// deno-lint-ignore-file require-await
import { assertEquals } from "std/assert/assert_equals.ts";
import { assertRejects } from "std/assert/assert_rejects.ts";
import { assert } from "std/assert/assert.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";

loadSync({ export: true });

Deno.test("Event emitter", async () => {
  const api = new ShopifyApi({
    accessToken: Deno.env.get("API_TOKEN") as string,
    shop: Deno.env.get("SHOP_NAME") as string,
  });
  let url = "";
  api.on("error", (m) => {
    url = m.url;
  });
  api.emit("error", { url: "https://example.com", status: 404 });
  assertEquals(url, "https://example.com");
});

Deno.test("Error handling (unhandled error)", async () => {
  const api = new ShopifyApi({
    accessToken: Deno.env.get("API_TOKEN") as string,
    shop: Deno.env.get("SHOP_NAME") as string,
  });

  await assertRejects(async () =>
    api.paginateProducts({ limit: 1, fields: "id" }, async (_) => {
      throw new Error("Test error");
    })
  );
});

Deno.test("Error handling (handled error)", async () => {
  const api = new ShopifyApi({
    accessToken: Deno.env.get("API_TOKEN") as string,
    shop: Deno.env.get("SHOP_NAME") as string,
  });

  api.on("error", (m) => {
    console.error(m);
  });

  assert(
    await api
      .paginateProducts({ limit: 1, fields: "id" }, async (_) => {
        throw new Error("Test error");
      })
      .catch((_) => true)
  );
});
