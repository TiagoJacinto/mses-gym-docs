import { test, expect } from '@playwright/test';

test.describe('Perguntas de Defesa - Screenshot Snapshots', () => {
  test('page loads matches baseline screenshot', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    await expect(page).toHaveScreenshot('perguntas-defesa-page.png');
  });

  test('first question renders correctly', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    const firstQuestion = page.locator('.question').first();
    await expect(firstQuestion).toHaveScreenshot('perguntas-defesa-q1.png');
  });

  test('category heading renders correctly', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    const heading = page.locator('h2').first();
    await expect(heading).toHaveScreenshot('perguntas-defesa-heading.png');
  });

  test('stats bar renders correctly', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    const statsBar = page.locator('.stats-bar, .stat-card').first();
    await expect(statsBar).toHaveScreenshot('perguntas-defesa-stats.png');
  });

  test('footer renders correctly', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toHaveScreenshot('perguntas-defesa-footer.png');
  });

  test('answer block open matches screenshot', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    await page.locator('.q-btn-resposta').first().click();
    await page.waitForTimeout(300);
    const openSection = page.locator('.answer-section.open').first();
    await expect(openSection).toHaveScreenshot('perguntas-defesa-answer-open.png');
  });

  test('tip block open matches screenshot', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    await page.locator('.q-btn-dicas').first().click();
    await page.waitForTimeout(300);
    const openSection = page.locator('.tip-section.open').first();
    await expect(openSection).toHaveScreenshot('perguntas-defesa-tip-open.png');
  });

  test('ref block open matches screenshot', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    await page.locator('.q-btn-ref').first().click();
    await page.waitForTimeout(300);
    const openSection = page.locator('.ref-section.open').first();
    await expect(openSection).toHaveScreenshot('perguntas-defesa-ref-open.png');
  });

  test('question with all sections open matches screenshot', async ({ page }) => {
    await page.goto('/perguntas-defesa');
    await page.locator('.q-btn-resposta').first().click();
    await page.locator('.q-btn-dicas').first().click();
    await page.locator('.q-btn-ref').first().click();
    await page.waitForTimeout(300);
    const firstQuestion = page.locator('.question').first();
    await expect(firstQuestion).toHaveScreenshot('perguntas-defesa-q1-all-open.png');
  });
});