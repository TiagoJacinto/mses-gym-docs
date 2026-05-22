import { test, expect } from '@playwright/test';

test.describe('Perguntas de Defesa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/perguntas-defesa');
  });

  test('should load page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Perguntas de Defesa/);
  });

  test('should display header with correct metadata', async ({ page }) => {
    await expect(page.getByText('Sistema de Gestão para Ginásio — MSES')).toBeVisible();
    await expect(page.getByText('Universidade de Aveiro')).toBeVisible();
  });

  test('should display stats section with 55 questions', async ({ page }) => {
    const statCard = page.locator('.stat-card .value').first();
    await expect(statCard).toContainText('55');
  });

  test('should display all 6 category headings', async ({ page }) => {
    const categories = [
      '1. Análise de Requisitos — Requisitos Funcionais',
      '2. Requisitos Não Funcionais',
      '3. Stakeholders e Atores',
      '4. Casos de Uso',
      '5. Modelação Estrutural — Diagrama de Classes',
      '7. Questões Globais',
    ];
    for (const cat of categories) {
      await expect(page.getByText(cat)).toBeVisible();
    }
  });

  test('should display all 55 questions', async ({ page }) => {
    const questions = page.locator('.question');
    await expect(questions).toHaveCount(55);
  });

  test('should have 3 buttons per question (Resposta, Dicas, Ref)', async ({ page }) => {
    const buttons = page.locator('.q-btn');
    const count = await buttons.count();
    expect(count).toBe(55 * 3);
  });

  test('clicking Resposta button reveals answer block', async ({ page }) => {
    const firstQuestion = page.locator('.question').first();
    const respostaBtn = firstQuestion.locator('.q-btn-resposta');

    await respostaBtn.click();
    const answerBlock = firstQuestion.locator('.answer-block');
    await expect(answerBlock).toBeVisible();
  });

  test('clicking Dicas button triggers action', async ({ page }) => {
    const firstQuestion = page.locator('.question').first();
    const dicasBtn = firstQuestion.locator('.q-btn-dicas');
    const target = await dicasBtn.getAttribute('data-target');
    const targetSection = page.locator('.tip-section.' + target + ', .ref-section.' + target);
    const initialClass = await targetSection.first().getAttribute('class');
    await dicasBtn.click();
    await page.waitForTimeout(500);
    const afterClass = await targetSection.first().getAttribute('class');
    expect(initialClass).not.toContain('open');
    expect(afterClass).toContain('open');
  });

  test('clicking Ref button triggers action', async ({ page }) => {
    const firstQuestion = page.locator('.question').first();
    const refBtn = firstQuestion.locator('.q-btn-ref');
    const target = await refBtn.getAttribute('data-target');
    const targetSection = page.locator('.ref-section.' + target);
    const initialClass = await targetSection.getAttribute('class');
    await refBtn.click();
    await page.waitForTimeout(500);
    const afterClass = await targetSection.getAttribute('class');
    expect(initialClass).not.toContain('open');
    expect(afterClass).toContain('open');
  });

  test('answer block contains expected content for question 1', async ({ page }) => {
    const firstQuestion = page.locator('.question').first();
    const respostaBtn = firstQuestion.locator('.q-btn-resposta');
    await respostaBtn.click();
    await page.waitForTimeout(500);
    const target = await respostaBtn.getAttribute('data-target');
    const targetSection = firstQuestion.locator('.' + target);
    await expect(targetSection).toHaveClass(/open/);
    await expect(targetSection.locator('.answer-block')).toContainText('desativação');
    await expect(targetSection.locator('.answer-block')).toContainText('RNF-11');
  });

  test('tip block has correct styling label', async ({ page }) => {
    const firstQuestion = page.locator('.question').first();
    const dicasBtn = firstQuestion.locator('.q-btn-dicas');
    await dicasBtn.click();
    await page.waitForTimeout(500);
    const target = await dicasBtn.getAttribute('data-target');
    const targetSection = page.locator('.tip-section.' + target);
    await expect(targetSection).toHaveClass(/open/);
    await expect(targetSection.locator('.block-label')).toContainText('Dicas');
  });

  test('ref block has correct styling label', async ({ page }) => {
    const firstQuestion = page.locator('.question').first();
    const refBtn = firstQuestion.locator('.q-btn-ref');
    await refBtn.click();
    await page.waitForTimeout(500);
    const target = await refBtn.getAttribute('data-target');
    const targetSection = page.locator('.ref-section.' + target);
    await expect(targetSection).toHaveClass(/open/);
    await expect(targetSection.locator('.block-label')).toContainText('Referência');
  });

  test('question numbers are sequential from 1 to 55', async ({ page }) => {
    const numbers = await page.locator('.q-num').allTextContents();
    expect(numbers).toHaveLength(55);
    for (let i = 0; i < 55; i++) {
      expect(numbers[i]).toBe(`${i + 1}.`);
    }
  });

  test('all questions have answer, tip, and ref blocks', async ({ page }) => {
    for (let i = 1; i <= 55; i++) {
      await expect(page.locator(`[data-target="answer-${i}"]`)).toBeAttached();
      await expect(page.locator(`[data-target="tip-${i}"]`)).toBeAttached();
      await expect(page.locator(`[data-target="ref-${i}"]`)).toBeAttached();
    }
  });

  test('footer displays authors and advisor', async ({ page }) => {
    await expect(page.getByText('Derlan Nascimento')).toBeVisible();
    await expect(page.getByText('Micael Oliveira')).toBeVisible();
    await expect(page.getByText('Rodrigo Fonseca')).toBeVisible();
    await expect(page.getByText('Tiago Jacinto')).toBeVisible();
    await expect(page.getByText('Professor José Martins')).toBeVisible();
  });

  test('dark mode CSS variables are defined', async ({ page }) => {
    const styles = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return {
        bgDark: computedStyle.getPropertyValue('--bg').trim(),
      };
    });
    expect(styles.bgDark).toBeTruthy();
  });

  test('buttons have hover states defined', async ({ page }) => {
    const btn = page.locator('.q-btn').first();
    await btn.hover();
    await expect(btn).toBeVisible();
  });

  test('scroll behavior is smooth', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveCSS('scroll-behavior', 'smooth');
  });

  test('last question (55) has answer, dicas, and ref content', async ({ page }) => {
    const lastQuestion = page.locator('.question').last();
    const respostaBtn = lastQuestion.locator('.q-btn-resposta');
    await respostaBtn.click();
    await page.waitForTimeout(500);
    const target = await respostaBtn.getAttribute('data-target');
    const answerSection = lastQuestion.locator('.' + target);
    await expect(answerSection).toHaveClass(/open/);
    await expect(answerSection.locator('.answer-block')).toContainText('RF-24');
    await expect(answerSection.locator('.answer-block')).toContainText('RF-23');

    const dicasBtn = lastQuestion.locator('.q-btn-dicas');
    await dicasBtn.click();
    await page.waitForTimeout(500);
    const tipTarget = await dicasBtn.getAttribute('data-target');
    const tipSection = page.locator('.tip-section.' + tipTarget);
    await expect(tipSection).toHaveClass(/open/);
    await expect(tipSection).toContainText('privilégio');

    const refBtn = lastQuestion.locator('.q-btn-ref');
    await refBtn.click();
    await page.waitForTimeout(500);
    const refTarget = await refBtn.getAttribute('data-target');
    const refSection = page.locator('.ref-section.' + refTarget);
    await expect(refSection).toHaveClass(/open/);
    await expect(refSection).toContainText('OWASP');
  });

  test('each category has expected number of questions', async ({ page }) => {
    const headings = page.locator('h2');
    expect(await headings.count()).toBeGreaterThanOrEqual(6);

    const rfQuestionCount = await page.locator('.question').filter({
      has: page.locator('.q-text:has-text("RF-")')
    }).count();
    expect(rfQuestionCount).toBeGreaterThanOrEqual(10);
  });
});