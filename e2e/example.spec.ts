import { test, expect } from '@playwright/test';

test.describe('MSES Gym Docs', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });

  test('should render the document title', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('#content h1').first();
    await expect(title).toContainText('Sistema de Gestão para Ginásio');
  });

  test('should display stakeholder section heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: '3. Stakeholders e Utilizadores' });
    await expect(heading).toBeVisible();
  });

  test('should render functional requirements table with RF-01', async ({ page }) => {
    await page.goto('/');
    const rf01 = page.getByRole('columnheader', { name: 'RF-01', exact: true });
    await expect(rf01).toBeVisible({ timeout: 10000 });
  });

  test('should render non-functional requirements table', async ({ page }) => {
    await page.goto('/');
    const rnf01 = page.getByRole('columnheader', { name: 'RNF-01', exact: true });
    await expect(rnf01).toBeVisible({ timeout: 10000 });
  });

  test('should display the domain table', async ({ page }) => {
    await page.goto('/');
    const dominio = page.getByRole('columnheader', { name: 'Domínio funcional' });
    await expect(dominio).toBeVisible({ timeout: 10000 });
  });

  test('should render use case UC-01 table header', async ({ page }) => {
    await page.goto('/');
    const uc01 = page.getByRole('columnheader', { name: 'UC-01' });
    await expect(uc01).toBeVisible({ timeout: 10000 });
  });

  test('should render activity diagram', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.mermaid', { timeout: 10000 });
    const mermaidDiagrams = page.locator('.mermaid');
    await expect(mermaidDiagrams).toHaveCount(2);
  });

  test('should display authors footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Derlan Nascimento')).toBeVisible();
    await expect(page.getByText('Tiago Jacinto')).toBeVisible();
  });
});