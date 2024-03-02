// deno-lint-ignore-file require-await
import { assertEquals } from "std/assert/assert_equals.ts";
import { assertExists } from "std/assert/assert_exists.ts";
import { assert } from "std/assert/assert.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";

loadSync({ export: true });

Deno.test("Get products (limit option)", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    const products = await api.getProducts({ limit });

    assertEquals(products.length, limit);

    for (const product of products) {
        assertExists(product.title);
    }
});

Deno.test("Get products (fields option)", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    const products = await api.getProducts({ limit, fields: "id,title" });

    for (const product of products) {
        assertExists(product.title);
        assertExists(product.id);
        assertEquals(Object.keys(product).length, 2);
    }
});

Deno.test("Paginate products (default batch size)", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    const products = await api.paginateProducts({ limit });

    assertExists(products);
    assertEquals(products.length, limit);

    for (const product of products) {
        assertExists(product.title);
    }
});

Deno.test("Paginate products (fields option)", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    const products = await api.paginateProducts({ limit, fields: "id,title" });

    assertExists(products);
    assertEquals(products.length, limit);

    for (const product of products) {
        assertExists(product.title);
        assertExists(product.id);
        assertEquals(Object.keys(product).length, 2);
    }
});

Deno.test("Paginate products (custom batch size)", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    const products = await api.paginateProducts({ limit }, undefined, 1);

    assertExists(products);
    assertEquals(products.length, limit);

    for (const product of products) {
        assertExists(product.title);
    }
});

Deno.test("Paginate products (callback)", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const limit = 5;
    let calls = 0;
    await api.paginateProducts({ limit }, async (data) => {
        for (const product of data) {
            calls++;
            assertExists(product.title);
        }
    }, 1);

    assertEquals(calls, limit);
});

Deno.test("Products count", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });

    const count = await api.productsCount();

    assert(Number.isInteger(count));
});
