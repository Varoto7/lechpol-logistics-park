import { test, expect } from '@playwright/test';

test.describe('Niezawodne testy funkcjonalne Lechpol Logistics', () => {

    test('Strona główna ładuje się bez błędów i ma nagłówek H1', async ({ page }) => {
        // 1. Sprawdź czy strona w ogóle odpowiada (kod 200 OK)
        const response = await page.goto('/');
        expect(response.status()).toBe(200);

        // 2. Sprawdź czy na stronie JEST jakikolwiek nagłówek H1 (nie ma znaczenia jaki tekst w nim jest)
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
        await expect(heading).not.toBeEmpty();
    });

    test('Mapa SVG posiada interaktywne strefy z bazy D1', async ({ page }) => {
        await page.goto('/');

        // 1. Sprawdź czy kontener mapy SVG istnieje w drzewie DOM
        const mapSvg = page.locator('#map-svg-element');
        await expect(mapSvg).toBeVisible();

        // 2. Sprawdź czy na mapie wyrenderowały się ścieżki hal (przynajmniej 1 hala istnieje)
        const hala1 = page.locator('#hala-1, #hala1');
        await expect(hala1).toBeVisible();

        // 3. TEST INTERAKCJI: Kliknij w halę i sprawdź czy WYSKOCZYŁO OKIENKO MODAL
        await hala1.click();
        const modal = page.locator('#map-modal');
        await expect(modal).toBeVisible();
    });

    test('API stref (/api/get-zones) zwraca poprawne dane JSON', async ({ request }) => {
        // Testujemy bezpośrednio Twoje API na Cloudflare
        const response = await request.get('/api/get-zones');
        expect(response.status()).toBe(200);
        
        const data = await response.json();
        // Sprawdzamy czy API zwraca obiekt, a nie pusty błąd
        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
    });

});