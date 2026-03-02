import { expect, request } from '@playwright/test';

export async function getTotalProducts(
    centerCode: number,
    promotion: number
): Promise<number> {
    const context = await request.newContext({
        baseURL: process.env.API_URL,
        extraHTTPHeaders: {
            'Store-Code': centerCode.toString(),
            'content-type': 'application/json',
        },
    });

    const response = await context.get('', {
        params: {
            promotions: promotion
        },
    });

    if (!response.ok()) {
        console.error('API FAILED');
        console.error('Status:', response.status());
        console.error('StatusText:', response.statusText());
        console.error('Response body:', await response.text());
    }

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.meta.total;
}
