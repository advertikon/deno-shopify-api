import { assertEquals } from 'std/assert/assert_equals.ts';
import { ShopifyApi } from "../client.ts";

Deno.test("Oauth page URL", () => {
    const shop = "example-shop";
    const redirectUrl = "https://example.com/callback";
    const scopes = "read_products,write_products";
    const clientId = "1234567890";
    const nonce = '12345';

    const expectedUrl = `https://example-shop.myshopify.com/admin/oauth/authorize?client_id=1234567890&scope=read_products,write_products&redirect_uri=https://example.com/callback&state=${nonce}`;

    const actualUrl = ShopifyApi.oauthPage(shop, { redirectUrl, scopes, clientId, nonce });

    assertEquals(actualUrl, expectedUrl);
});

