import { test, expect } from '@playwright/test';

test.describe('Table Content Bug', () => {
  test('RF-01 functional requirement should be visible', async ({ page }) => {
    await page.goto('/');
    const rf01 = page.getByRole('columnheader', { name: 'RF-01', exact: true });
    await expect(rf01).toBeVisible({ timeout: 10000 });
  });

  test('RNF-01 non-functional requirement should be visible', async ({ page }) => {
    await page.goto('/');
    const rnf01 = page.getByRole('columnheader', { name: 'RNF-01', exact: true });
    await expect(rnf01).toBeVisible({ timeout: 10000 });
  });

  test('stakeholder table should have Ator column header', async ({ page }) => {
    await page.goto('/');
    const ator = page.getByRole('columnheader', { name: 'Ator' }).first();
    await expect(ator).toBeVisible({ timeout: 10000 });
  });

  test('domain table "Domínio funcional" header should be visible', async ({ page }) => {
    await page.goto('/');
    const dominio = page.getByRole('columnheader', { name: 'Domínio funcional' });
    await expect(dominio).toBeVisible({ timeout: 10000 });
  });

  test('UC-01 use case table should be visible', async ({ page }) => {
    await page.goto('/');
    const uc01 = page.getByRole('columnheader', { name: 'UC-01' });
    await expect(uc01).toBeVisible({ timeout: 10000 });
  });

  test('RF-01 row should contain "Gerir Registo de Utente" description', async ({ page }) => {
    await page.goto('/');
    const rf01Row = page.locator('th:has-text("RF-01")').first();
    await expect(rf01Row).toBeVisible({ timeout: 10000 });
  });
});