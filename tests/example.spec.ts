import { test, expect } from '@playwright/test';

test.describe('Niezawodne testy funkcjonalne Lechpol Logistics', () => {

    test('Strona główna ładuje się bez błędów i ma nagłówek H1', async ({ page }) => {
        // 1. Sprawdź czy strona w ogóle odpowiada
        const response = await page.goto('/');
        
        // Dodany znak zapytania (?) uspokaja VS Code (sprawdza status tylko, jeśli response nie jest null)
        expect(response?.status()).toBe(200);

        // 2. Sprawdź czy na stronie JEST jakikolwiek nagłówek H1. 
        // Używamy .first(), aby test nie wybuchł, jeśli na stronie będą dwa nagłówki
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        await expect(heading).not.toBeEmpty();
    });

    test('Mapa SVG posiada interaktywne strefy z bazy D1', async ({ page }) => {
        await page.goto('/');

        // 1. Sprawdź czy kontener mapy SVG istnieje w drzewie DOM
        const mapSvg = page.locator('#map-svg-element').first();
        await expect(mapSvg).toBeVisible();

        // 2. Sprawdź czy na mapie wyrenderowały się ścieżki hal
        const hala1 = page.locator('#hala-1, #hala1').first();
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