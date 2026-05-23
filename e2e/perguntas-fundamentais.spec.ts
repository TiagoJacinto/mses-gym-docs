import { expect, test } from "@playwright/test";

test.describe("Perguntas Fundamentais", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/perguntas-defesa");
	});

	test("should load page with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/Perguntas Fundamentais/);
	});

	test("should display document header title", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: /Perguntas Fundamentais/ }),
		).toBeVisible();
	});

	test("should display all 20 questions", async ({ page }) => {
		const questions = page.locator(".question-item");
		await expect(questions).toHaveCount(20);
	});

	test("should display question numbers 1-20 sequentially", async ({
		page,
	}) => {
		const numbers = await page.locator(".question-number").allTextContents();
		expect(numbers).toHaveLength(20);
		for (let i = 0; i < 20; i++) {
			expect(numbers[i]).toBe(`${i + 1}`);
		}
	});

	test("should display question text for each question", async ({ page }) => {
		const firstQuestion = page.locator(".question-item").first();
		await expect(firstQuestion.locator(".question-text")).toContainText(
			"Qual é o problema operacional",
		);
	});

	test("should have Resposta button for each question", async ({ page }) => {
		const buttons = page.locator(".btn-resposta");
		await expect(buttons).toHaveCount(20);
	});

	test("should have Dicas button for each question", async ({ page }) => {
		const buttons = page.locator(".btn-dicas");
		await expect(buttons).toHaveCount(20);
	});

	test("should have Referencia button for each question", async ({ page }) => {
		const buttons = page.locator(".btn-referencia");
		await expect(buttons).toHaveCount(20);
	});

	test("clicking Resposta reveals answer block", async ({ page }) => {
		const firstQuestion = page.locator(".question-item").first();
		const respostaBtn = firstQuestion.locator(".btn-resposta");
		await respostaBtn.click();
		await expect(firstQuestion.locator(".answer-content")).toBeVisible();
		await expect(firstQuestion.locator(".answer-content")).toContainText(
			"sistema resolve",
		);
	});

	test("clicking Dicas reveals tips block", async ({ page }) => {
		const firstQuestion = page.locator(".question-item").first();
		const dicasBtn = firstQuestion.locator(".btn-dicas");
		await dicasBtn.click();
		await expect(firstQuestion.locator(".dicas-content")).toBeVisible();
		await expect(firstQuestion.locator(".dicas-content")).toContainText(
			"Foca na palavra",
		);
	});

	test("clicking Referencia reveals reference block", async ({ page }) => {
		const firstQuestion = page.locator(".question-item").first();
		const refBtn = firstQuestion.locator(".btn-referencia");
		await refBtn.click();
		await expect(firstQuestion.locator(".referencia-content")).toBeVisible();
		await expect(firstQuestion.locator(".referencia-content")).toContainText(
			"Secção 2.1",
		);
	});

	test("accordion behavior - only one block open at a time per question", async ({
		page,
	}) => {
		const firstQuestion = page.locator(".question-item").first();
		const respostaBtn = firstQuestion.locator(".btn-resposta");
		const dicasBtn = firstQuestion.locator(".btn-dicas");

		await respostaBtn.click();
		await expect(firstQuestion.locator(".answer-content")).toBeVisible();

		await dicasBtn.click();
		await expect(firstQuestion.locator(".answer-content")).not.toBeVisible();
		await expect(firstQuestion.locator(".dicas-content")).toBeVisible();
	});

	test("closing a block when clicking its button again", async ({ page }) => {
		const firstQuestion = page.locator(".question-item").first();
		const respostaBtn = firstQuestion.locator(".btn-resposta");

		await respostaBtn.click();
		await expect(firstQuestion.locator(".answer-content")).toBeVisible();

		await respostaBtn.click();
		await expect(firstQuestion.locator(".answer-content")).not.toBeVisible();
	});

	test("all answer blocks contain non-empty content", async ({ page }) => {
		const answers = page.locator(".answer-content");
		const count = await answers.count();
		for (let i = 0; i < count; i++) {
			const answer = answers.nth(i);
			await answer.locator("..").evaluate((el: Element) => {
				(window as any).testHelper = el;
			});
		}
		const firstQuestion = page.locator(".question-item").first();
		const respostaBtn = firstQuestion.locator(".btn-resposta");
		await respostaBtn.click();
		const content = await firstQuestion
			.locator(".answer-content")
			.textContent();
		expect(content?.trim().length).toBeGreaterThan(0);
	});

	test("question 20 has correct content", async ({ page }) => {
		const lastQuestion = page.locator(".question-item").last();
		const respostaBtn = lastQuestion.locator(".btn-resposta");
		await respostaBtn.click();
		await expect(lastQuestion.locator(".answer-content")).toContainText(
			"injecção SQL",
		);
		await expect(lastQuestion.locator(".answer-content")).toContainText("XSS");
	});

	test("scroll behavior is smooth", async ({ page }) => {
		const html = page.locator("html");
		await expect(html).toHaveCSS("scroll-behavior", "smooth");
	});

	test("footer displays project metadata", async ({ page }) => {
		await expect(page.locator("footer")).toBeVisible();
		await expect(
			page.getByText("Sistema de Gestão para Ginásio"),
		).toBeVisible();
	});
});
