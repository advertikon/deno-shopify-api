const SHOP_SUFFIX = '.myshopify.com';

export function MakeQueryString(params: Record<string, string | number | string[] | number[]>) {
    return Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => {
            if (Array.isArray(v)) {
                return `${encodeURIComponent(k)}=${encodeURIComponent(v.join(','))}`;
            }

            return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
        })
        .join('&');
}

export function ensureShopName(shop: string): string {
    return shop.endsWith(SHOP_SUFFIX) ? shop : `${shop}${SHOP_SUFFIX}`;
}