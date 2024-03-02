import { assertEquals } from 'std/assert/assert_equals.ts';
import { MakeQueryString, ensureShopName } from "../helpers.ts";

Deno.test("Make query string", () => {
    const params = {
        a: 1,
        b: '2',
        c: [3, 4],
        d: undefined,
    };
    const expected = 'a=1&b=2&c=3%2C4';
    // @ts-ignore
    const actual = MakeQueryString(params);
    assertEquals(actual, expected);
});


Deno.test("Ensure shop name", () => {
    const shop1 = "example";
    const expected1 = "example.myshopify.com";
    const actual1 = ensureShopName(shop1);
    assertEquals(actual1, expected1);

    const shop2 = "example.myshopify.com";
    const expected2 = "example.myshopify.com";
    const actual2 = ensureShopName(shop2);
    assertEquals(actual2, expected2);
});

