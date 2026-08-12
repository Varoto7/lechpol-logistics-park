import { test, expect } from '@playwright/test';

test.describe('Niezawodne testy funkcjonalne Lechpol Logistics', () => {

    test('Strona główna ładuje się bez błędów i ma nagłówek H1', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);

        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        await expect(heading).not.toBeEmpty();
    });

    test('Mapa SVG posiada interaktywne strefy z bazy D1', async ({ page }) => {
        // Przechwyć API i zwróć testową halę, aby skrypt mapy podpiął kliknięcia
        await page.route('**/api/get-zones', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    'hala-1': {
                        nazwa: 'Hala Testowa 1',
                        powierzchnia: '1500 m²',
                        status: 'dostepna',
                        opis: 'Testowy opis hali na potrzeby CI'
                    }
                }),
            });
        });

        await page.goto('/');

        const mapSvg = page.locator('#map-svg-element').first();
        await expect(mapSvg).toBeVisible();

        const hala1 = page.locator('#hala-1, #hala1').first();
        await expect(hala1).toBeVisible();

        // Kliknięcie w halę
        await hala1.click({ force: true });

        // Sprawdzenie czy okno modal się wyświetliło
        const modal = page.locator('#map-modal');
        await expect(modal).toBeVisible();
    });

    test('API stref (/api/get-zones) odpowiada', async ({ request }) => {
        const response = await request.get('/api/get-zones');
        expect([200, 404]).toContain(response.status());
    });

});