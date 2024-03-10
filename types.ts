export type ClientParams = { shop: string; accessToken: string; apiVersion?: string };
export type OauthContext = { redirectUrl: string; scopes: string; clientId: string; nonce?: string };

export type ShopifyProduct = {
    body_html: string;
    created_at: string;
    handle: string;
    id: number;
    images: {
        id: number;
        product_id: number;
        position: number;
        created_at: string;
        updated_at: string;
        width: number;
        height: number;
        src: string;
        variant_ids: number[];
    }[];
    options: {
        id: number;
        product_id: number;
        name: string;
        position: number;
        values: string[];
    };
    product_type: string;
    published_at: string;
    published_scope: string;
    status: string;
    tags: string;
    template_suffix: string;
    title: string;
    updated_at: string;
    variants: {
        barcode: string;
        compare_at_price: null | number;
        created_at: string;
        fulfillment_service: string;
        grams: number;
        weight: number;
        weight_unit: string;
        id: number;
        inventory_item_id: number;
        inventory_management: string;
        inventory_policy: string;
        inventory_quantity: number;
        option1: string;
        position: number;
        price: number;
        product_id: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        title: string;
        updated_at: string;
    }[];
    vendor: string;
};

export type GetProductOptions = {
    collection_id?: number;
    created_at_max?: string;
    created_at_min?: string;
    fields?: string;
    handle?: string;
    ids?: string;
    limit?: number;
    product_type?: string;
    published_at_max?: string;
    published_at_min?: string;
    published_status?: "published" | "unpublished" | "any";
    since_id?: number;
    status?: "active" | "archived" | "draft";
    title?: string;
    undated_at_max?: string;
    updated_at_min?: string;
    vendor?: string;
};

export type GetCollectionOptions = {
    fields?: string;
    handle?: string;
    ids?: string;
    limit?: number;
    product_id?: number;
    published_at_max?: string;
    published_at_min?: string;
    published_status?: "published" | "unpublished" | "any";
    since_id?: number;
    title?: string;
    updated_at_min?: string;
    updated_at_max?: string;
};

export type GetWebhookOptions = {
    address?: string;
    created_at_min?: string;
    created_at_max?: string;
    fields?: string;
    limit?: number;
    since_id?: number;
    topic?: string;
    updated_at_min?: string;
    updated_at_max?: string;
};

export type GetMetafieldOptions = {
    created_at_min?: string;
    created_at_max?: string;
    fields?: string;
    key?: string;
    limit?: number;
    namespace?: string;
    since_id?: number;
    type?: string;
    updated_at_min?: string;
    updated_at_max?: string;
};

export type CreateMetafieldOptions = {
    namespace: string;
    key: string;
    value: string | string[];
    type:
        | "boolean"
        | "color"
        | "date"
        | "date_time"
        | "dimension"
        | "json"
        | "money"
        | "multiline_text_field"
        | "number_decimal"
        | "number_integer"
        | "rating"
        | "rich_text_field"
        | "single_line_text_field"
        | "url"
        | "volume"
        | "weight"
        | "collection_reference"
        | "file_reference"
        | "metaobject_reference"
        | "mixed_reference"
        | "page_reference"
        | "product_reference"
        | "product_variant_reference"
        | "list.collection_reference"
        | "list.color"
        | "list.date"
        | "list.date_time"
        | "list.dimension"
        | "list.file_reference"
        | "list.metaobject_reference"
        | "list.mixed_reference"
        | "list.number_integer"
        | "list.number_decimal"
        | "list.page_reference"
        | "list.product_reference"
        | "list.rating"
        | "list.single_line_text_field"
        | "list.url"
        | "list.variant_reference"
        | "list.volume"
        | "list.weight";
};

export type PaginateOptions<T> = {
    targetUrl: string;
    totalCount?: number;
    options?: RequestInit;
    batchSize?: number;
};

export type CbFunction<T> = (data: T[]) => Promise<void>;

export type ShopifyShop = {
    address1: string;
    address2: string;
    checkout_api_supported: boolean;
    city: string;
    country: string;
    country_code: string;
    country_name: string;
    county_taxes: null;
    created_at: string;
    customer_email: string;
    currency: string;
    domain: string;
    enabled_presentment_currencies: string[];
    eligible_for_card_reader_giveaway: boolean;
    eligible_for_payments: boolean;
    email: string;
    finances: boolean;
    force_ssl: boolean;
    google_apps_domain: null;
    google_apps_login_enabled: null;
    has_discounts: boolean;
    has_gift_cards: boolean;
    has_storefront: boolean;
    iana_timezone: string;
    id: number;
    latitude: number;
    longitude: number;
    money_format: string;
    money_in_emails_format: string;
    money_with_currency_format: string;
    money_with_currency_in_emails_format: string;
    multi_location_enabled: boolean;
    myshopify_domain: string;
    name: string;
    password_enabled: boolean;
    phone: null;
    plan_display_name: string;
    pre_launch_enabled: boolean;
    plan_name: string;
    primary_locale: string;
    primary_location_id: number;
    province: string;
    province_code: string;
    requires_extra_payments_agreement: boolean;
    setup_required: boolean;
    shop_owner: string;
    source: null;
    taxes_included: null;
    tax_shipping: null;
    timezone: string;
    transactional_sms_disabled: boolean;
    updated_at: string;
    weight_unit: string;
    zip: string;
    marketing_sms_consent_enabled_at_checkout: boolean;
};

export type ShopifyRecurringCharge = {
    activated_on: string | null;
    billing_on: string | null;
    cancelled_on: string | null;
    capped_amount: string;
    confirmation_url: string;
    created_at: string;
    id: number;
    name: string;
    price: string;
    return_url: string;
    status: string;
    terms: string;
    test: null | boolean;
    trial_days: number;
    trial_ends_on: string | null;
    updated_at: string;
    currency: string;
};

export type ShopifyWebhook = {
    address: string;
    api_version: string;
    created_at: string;
    fields: string[];
    format: string;
    id: number;
    metafield_namespaces: string[];
    private_metafield_namespaces: string[];
    topic: string;
    updated_at: string;
};

export type ShopifyCollection = {
    body_html: string;
    handle: string;
    id: number;
    image: {
        src: string;
        alt: string;
    };
    published_at: string;
    published_scope: string;
    sort_order: string;
    template_suffix: string | null;
    title: string;
    updated_at: string;
};

export type ShopifyCustomCollection = ShopifyCollection & {
    image: {
        width: number;
        height: number;
        created_at: string;
    };
    published: boolean;
};

export type ShopifySmartCollection = ShopifyCollection & {
    rules: {
        column: string;
        relation: string;
        condition: string;
    };
    disjunctive: boolean;
};

export type PaginateAbleEntity = ShopifyProduct | ShopifyCustomCollection | ShopifySmartCollection;

export type CrateRecurringChargeOptions = {
    name: string;
    price: number;
    return_url: string;
    test?: boolean;
};

export type EventType = "error" | "request" | "unauthorized";

export type ShopifyMetafield = {
    created_at: string;
    description: string;
    id: number;
    key: string;
    namespace: string;
    owner_id: number;
    owner_resource: string;
    updated_at: string;
    value: string;
    type: string;
};
