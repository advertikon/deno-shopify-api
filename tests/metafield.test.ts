import { assert } from "std/assert/assert.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";
import { MetafieldResource } from "../constants.ts";
import { assertEquals } from "std/assert/assert_equals.ts";
import { assertRejects } from "std/assert/assert_rejects.ts";

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

Deno.test("Create Metafield", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });

    const products = await api.getProducts({ limit: 1 });
    const productId = products[0].id;

    assert(productId);

    const metafield = await api.createMetafield(MetafieldResource.PRODUCT, productId, {
        namespace: "custom",
        key: "deno-test",
        value: ["foo", "bar"],
        type: "list.single_line_text_field",
    }).catch((err) => {
        console.error(err);
        throw err;
    });

    assertEquals(metafield.namespace, "custom");
    assertEquals(metafield.key, "deno-test");
    assertEquals(metafield.value, JSON.stringify(["foo", "bar"]));

    await api.deleteMetafield(MetafieldResource.PRODUCT, productId, metafield.id);

    await assertRejects(() => api.getResourceMetafield(MetafieldResource.PRODUCT, productId, metafield.id));
});

Deno.test("Save Metafield", async () => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });

    const products = await api.getProducts({ limit: 1 });
    const productId = products[0].id;

    assert(productId);

    const metafield = await api.createMetafield(MetafieldResource.PRODUCT, productId, {
        namespace: "custom",
        key: "deno-test",
        value: JSON.stringify(["foo", "bar"]),
        type: "list.single_line_text_field",
    }).catch((err) => {
        console.error(err);
        throw err;
    });

    await api.setMetafieldValue(
        MetafieldResource.PRODUCT,
        productId,
        metafield.id,
        [
            "1111|a|b",
            "3333|b|3",
        ],
    );

    const updatedMetafield = await api.getResourceMetafield(MetafieldResource.PRODUCT, productId, metafield.id);

    assertEquals(
        updatedMetafield.value,
        JSON.stringify([
            "1111|a|b",
            "3333|b|3",
        ]),
    );

    await api.deleteMetafield(MetafieldResource.PRODUCT, productId, metafield.id);

    await assertRejects(() => api.getResourceMetafield(MetafieldResource.PRODUCT, productId, metafield.id));
});
