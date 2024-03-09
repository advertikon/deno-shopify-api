// deno-lint-ignore-file require-await
import { ulid } from "std/ulid/mod.ts";
import { EventEmitter } from "node:events";
import {
    CbFunction,
    ClientParams,
    CrateRecurringChargeOptions,
    EventType,
    GetCollectionOptions,
    GetMetafieldOptions,
    GetProductOptions,
    GetWebhookOptions,
    OauthContext,
    PaginateAbleEntity,
    PaginateOptions,
    ShopifyCollection,
    ShopifyCustomCollection,
    ShopifyMetafield,
    ShopifyProduct,
    ShopifyRecurringCharge,
    ShopifyShop,
    ShopifySmartCollection,
    ShopifyWebhook,
} from "./types.ts";
import { ensureShopName, MakeQueryString } from "./helpers.ts";
import { MetafieldResource } from "./constants.ts";

export class ShopifyApi extends EventEmitter {
    protected readonly apiVersion: string;

    baseUrl: string;

    readonly shop: string;

    protected readonly accessToken: string;

    static oauthPage(shop: string, { redirectUrl, scopes, clientId, nonce }: OauthContext) {
        nonce = nonce ?? ulid();
        const shopName = ensureShopName(shop);
        return `https://${shopName}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUrl}&state=${nonce}`;
    }

    constructor({ shop, accessToken, apiVersion = "2024-01" }: ClientParams) {
        super();

        if (!accessToken) {
            throw new Error("Shopify access token is required");
        }

        if (!shop) {
            throw new Error("Shopify shop name is required");
        }

        this.shop = ensureShopName(shop);
        this.accessToken = accessToken;
        this.apiVersion = apiVersion;
        this.baseUrl = `https://${this.shop}/admin/api/${this.apiVersion}`;
    }

    on(eventName: "request", listener: (data: { status: number; url: string }) => void): this;
    on(eventName: "error", listener: (data: { status: number; url: string; body: any }) => void): this;
    on(eventName: "unauthorized", listener: (data: { url: string }) => void): this;
    on(eventName: EventType, listener: (...args: any[]) => void): this {
        super.on(eventName, listener);
        return this;
    }

    emit(eventName: EventType, ...args: any[]): boolean {
        return super.emit(eventName, ...args);
    }

    async getProducts(options: GetProductOptions = {}): Promise<ShopifyProduct[]> {
        const url = `/products.json?${MakeQueryString(options)}`;
        return this.send<{ products: ShopifyProduct[] }>(url).then((response) => response?.products ?? []);
    }

    async paginateProducts(
        options: GetProductOptions,
        cb?: CbFunction<ShopifyProduct>,
        batchSize?: number,
    ): Promise<ShopifyProduct[] | null> {
        const { limit, ...restOptions } = options;
        const url = `/products.json?${MakeQueryString(restOptions)}`;

        if (cb) {
            return this.paginate<ShopifyProduct>({
                targetUrl: url,
                batchSize,
                totalCount: limit,
            }, cb);
        }
        return this.paginate<ShopifyProduct>({
            targetUrl: url,
            batchSize,
            totalCount: limit,
        });
    }

    async productsCount(): Promise<number> {
        const url = `/products/count.json`;
        return this.send<{ count: number }>(url).then((resp) => resp.count);
    }

    async getShop(): Promise<ShopifyShop> {
        const url = `/shop.json`;
        return this.send<{ shop: ShopifyShop }>(url).then((resp) => resp.shop);
    }

    async getWebhooks(options: GetWebhookOptions = {}) {
        const url = `/webhooks.json?${MakeQueryString(options)}`;
        return this.send<{ webhooks: ShopifyWebhook[] }>(url).then((resp) => resp.webhooks);
    }

    async createWebhook(topic: string, address: string): Promise<ShopifyWebhook> {
        const url = `/webhooks.json`;
        const body = JSON.stringify({
            webhook: {
                topic,
                address,
                format: "json",
            },
        });

        return this.send<{ webhook: ShopifyWebhook }>(url, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
        }).then((resp) => resp.webhook);
    }

    async deleteWebhook(id: number) {
        const url = `/webhooks/${id}.json`;
        return this.send(url, { method: "DELETE" });
    }

    async getCollection(collection_id: number): Promise<ShopifyCollection> {
        const url = `/collections/${collection_id}.json`;
        return this.send<{ collection: ShopifyCollection }>(url).then(
            (resp) => resp.collection,
        );
    }

    async getCollectionProducts(collection_id: number): Promise<ShopifyProduct[]>;
    async getCollectionProducts(collection_id: number, cb: CbFunction<ShopifyProduct>): Promise<null>;
    async getCollectionProducts(
        collection_id: number,
        cb?: CbFunction<ShopifyProduct>,
    ): Promise<ShopifyProduct[] | null> {
        const url = `/collections/${collection_id}/products.json`;
        if (cb) {
            return this.paginate<ShopifyProduct>({ targetUrl: url }, cb);
        }
        return this.paginate<ShopifyProduct>({ targetUrl: url });
    }

    async getCustomCollections(options: GetCollectionOptions = {}): Promise<ShopifyCustomCollection[]> {
        const { limit, ...restOptions } = options;
        const url = `/custom_collections.json?${MakeQueryString(restOptions)}`;
        return this.paginate<ShopifyCustomCollection>({
            targetUrl: url,
            totalCount: limit,
        });
    }

    async getSmartCollections(options: GetCollectionOptions = {}): Promise<ShopifySmartCollection[]> {
        const { limit, ...restOptions } = options;
        const url = `/smart_collections.json?${MakeQueryString(restOptions)}`;
        return this.paginate<ShopifySmartCollection>({
            targetUrl: url,
            totalCount: limit,
        });
    }

    async getCollections(
        options?: Omit<GetCollectionOptions, "limit">,
    ): Promise<(ShopifyCustomCollection | ShopifySmartCollection)[]> {
        const customCollections = await this.getCustomCollections(options);
        const smartCollections = await this.getSmartCollections(options);
        return [...customCollections, ...smartCollections];
    }

    async getRecurringCharges(): Promise<ShopifyRecurringCharge[]> {
        const url = `/recurring_application_charges.json`;
        return this.send<{ recurring_application_charges: ShopifyRecurringCharge[] }>(url).then((resp) =>
            resp.recurring_application_charges.filter((charge) => charge.status !== "cancelled")
        );
    }

    async createRecurringCharge(options: CrateRecurringChargeOptions): Promise<ShopifyRecurringCharge> {
        const url = `/recurring_application_charges.json`;

        const body = JSON.stringify({
            recurring_application_charge: options,
        });

        return this.send<{ recurring_application_charge: ShopifyRecurringCharge }>(url, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
        }).then((resp) => resp.recurring_application_charge);
    }

    async cancelRecurringCharge(chargeId: number): Promise<void> {
        const url = `/recurring_application_charges/${chargeId}.json`;
        await this.send(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
    }

    async getResourceMetafields(
        resourceType: MetafieldResource,
        resourceId: number,
        options: GetMetafieldOptions = {},
    ): Promise<ShopifyMetafield[]> {
        const url = `/${resourceType}/${resourceId}/metafields.json?${MakeQueryString(options)}`;
        return this.send<{ metafields: ShopifyMetafield[] }>(url).then((resp) => resp.metafields);
    }

    async getResourceMetafield(
        resourceType: MetafieldResource,
        resourceId: number,
        metafieldId: number,
        options: GetMetafieldOptions = {},
    ): Promise<ShopifyMetafield[]> {
        const url = `/${resourceType}/${resourceId}/metafields/${metafieldId}.json?${MakeQueryString(options)}`;
        return this.send<{ metafields: ShopifyMetafield[] }>(url).then((resp) => resp.metafields);
    }

    async setMetafieldValue(
        resourceType: MetafieldResource,
        resourceId: number,
        metafieldId: number,
        value: string | string[],
    ): Promise<ShopifyMetafield> {
        const url = `/${resourceType}/${resourceId}/metafields/${metafieldId}.json`;
        return this.send<{ metafield: ShopifyMetafield }>(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                metafield: { id: metafieldId, value: Array.isArray(value) ? JSON.stringify(value) : value },
            }),
        }).then((resp) => resp.metafield);
    }

    private async send<T>(
        url: string,
        options: RequestInit = { headers: {} },
        defaultValue: T | undefined = undefined,
    ): Promise<T> {
        options.headers = {
            ...options.headers,
            "X-Shopify-Access-Token": this.accessToken,
        };

        const apiUrl = `${this.baseUrl}${url}`;

        return fetch(apiUrl, options).then((response) => this.processResponse<T>(response, apiUrl, defaultValue));
    }

    private async paginate<T extends PaginateAbleEntity>(opts: PaginateOptions<T>): Promise<T[]>;
    private async paginate<T extends PaginateAbleEntity>(opts: PaginateOptions<T>, cb: CbFunction<T>): Promise<null>;
    private async paginate<T extends PaginateAbleEntity>(
        opts: PaginateOptions<T>,
        cb?: CbFunction<T>,
    ): Promise<T[] | null> {
        const {
            targetUrl,
            totalCount,
            options = { headers: {} },
            batchSize = 250,
        } = opts;
        let results: T[] = [];
        let pageInfo;
        let count = 0;
        let resultsCount = 0;

        while (count++ < 100) {
            const limit = totalCount ? Math.max(1, Math.min(batchSize, totalCount - resultsCount)) : batchSize;
            let url = targetUrl.indexOf("?") > 0 ? `${targetUrl}&limit=${limit}` : `${targetUrl}?limit=${limit}`;

            if (pageInfo) {
                url = `${url}&page_info=${pageInfo}`;
            }

            const apiUrl = `${this.baseUrl}${url}`;

            options.headers = {
                ...options.headers,
                "X-Shopify-Access-Token": this.accessToken,
            };

            const response = await fetch(apiUrl, options);
            const res = await this.processResponse<Record<string, T[]>>(response, apiUrl);

            // there should be only one key, eg { products: [] }
            if (Object.keys(res).length > 1) {
                throw new Error("Response contains more than one key");
            }

            const items = res[Object.keys(res)[0]];
            resultsCount += items.length;

            if (cb) {
                await cb(items);
            } else {
                results = results.concat(items);
            }

            const hasMore = Number(response.headers.get("link")?.indexOf('rel="next"')) > 0;

            if ((totalCount && resultsCount >= totalCount) || !hasMore) {
                return cb ? null : results;
            }

            pageInfo = response.headers
                .get("link")
                ?.split(",")
                ?.find((link) => Number(link.indexOf('"next"')) > 0)
                ?.match(/page_info=(\w+)/)?.[1];

            if (!pageInfo) {
                throw new Error("No page_info in response");
            }
        }

        return cb ? null : results;
    }

    private async processResponse<T>(response: Response, url: string, defaultValue?: T): Promise<T> {
        const body = await this.getResponseBody(response);

        if (response.ok) {
            this.emit("request", { status: response.status, url });
            return body as T;
        }

        if (response.status === 401) {
            this.emit("unauthorized", { url });
            throw new Error("Unauthorized");
        }

        this.emit("error", { status: response.status, url, body });

        if (defaultValue) {
            return defaultValue;
        }

        throw new Error(`Request to ${url} failed: ${response.status} ${body}`);
    }

    protected async getResponseBody(response: Response) {
        if (response.headers.get("content-type")?.includes("application/json")) {
            return response.json().catch((_) => {
                return null;
            });
        }

        return response.text();
    }
}
