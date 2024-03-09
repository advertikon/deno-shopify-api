import { assert } from "std/assert/assert.ts";
import { loadSync } from "std/dotenv/mod.ts";
import { ShopifyApi } from "../client.ts";

loadSync({ export: true });
const address = "https://maxvehicle.com/webhook";
const topic = "app/uninstalled";

Deno.test("Webhook", async (test1) => {
    const api = new ShopifyApi({
        accessToken: Deno.env.get("API_TOKEN") as string,
        shop: Deno.env.get("SHOP_NAME") as string,
    });
    const webhooks = await api.getWebhooks();

    assert(Array.isArray(webhooks));
    assert(webhooks.every((webhook) => webhook.topic !== topic && webhook.address !== address));

    await test1.step("Create webhook", async (test2) => {
        const webhook = await api.createWebhook(topic, address);
        const webhooks = await api.getWebhooks();

        assert(Array.isArray(webhooks));
        assert(webhooks.some((webhook) => webhook.topic === topic && webhook.address === address));

        const webhooks2 = await api.getWebhooks({ topic, address });

        assert(Array.isArray(webhooks2));
        assert(webhooks2.some((webhook) => webhook.topic === topic && webhook.address === address));

        await test2.step("Delete webhook", async () => {
            await api.deleteWebhook(webhook.id);
            const webhooks = await api.getWebhooks();

            assert(Array.isArray(webhooks));
            assert(webhooks.every((webhook) => webhook.topic !== topic && webhook.address !== address));
        });
    });
});
