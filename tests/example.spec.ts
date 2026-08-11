import { test, expect } from '@playwright/test';

test.describe('Testy witryny Lechpol Logistics', () => {

    test('Strona główna i mapa ładują się prawidłowo', async ({ page }) => {
        // 1. Wejdź na stronę
        await page.goto('/');

        // 2. Sprawdź czy nagłówek strony jest widoczny
        await expect(page.locator('h1')).toContainText('Nowoczesne centrum logistyczne');

        // 3. Sprawdź czy mapa SVG istnieje
        const mapSvg = page.locator('#interactiveMapSvg');
        await expect(mapSvg).toBeVisible();

        // 4. Kliknij w Halę 1 na mapie
        const hala1 = page.locator('#hala-1, #hala1');
        await hala1.click();

        // 5. Sprawdź czy po kliknięciu otworzyło się okno Modal
        const modal = page.locator('#map-modal');
        await expect(modal).toBeVisible();
        await expect(page.locator('#modal-title')).not.toBeEmpty();
    });

    test('Działanie strony z halami', async ({ page }) => {
        await page.goto('/hale');
        await expect(page.locator('h1')).toContainText('Dostępne Hale Magazynowe');
        
        // Sprawdź czy przynajmniej jedna karta hali się wyrenderowała z bazy D1
        const hallCards = page.locator('#halls-grid > div');
        await expect(hallCards.first()).toBeVisible();
    });

});