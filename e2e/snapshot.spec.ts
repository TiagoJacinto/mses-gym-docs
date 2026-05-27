import { test, expect } from "@playwright/test";

/**
 * Snapshot tests for https://mses-gym-docs.vercel.app
 * Run with: npx playwright test e2e/snapshot.spec.ts --project=chromium
 * Update snapshots with: npx playwright test e2e/snapshot.spec.ts --project=chromium --update-snapshots
 */

test.describe("Visual snapshot tests", () => {
	test("homepage without scrollbar", async ({ page }) => {
		await page.goto("https://mses-gym-docs.vercel.app", {
			waitUntil: "networkidle",
		});
		await expect(page).toHaveScreenshot("homepage-no-scroll.png", {
			fullPage: false,
			animations: "disabled",
			timeout: 30000,
		});
	});

	test("table of contents visible section", async ({ page }) => {
		await page.goto("https://mses-gym-docs.vercel.app", {
			waitUntil: "networkidle",
		});
		await expect(page).toHaveScreenshot("above-fold.png", {
			fullPage: false,
			animations: "disabled",
			timeout: 30000,
		});
	});

	test("section 1 — Introdução", async ({ page }) => {
		await page.goto("https://mses-gym-docs.vercel.app", {
			waitUntil: "networkidle",
		});
		const heading = page.getByRole("heading", {
			level: 1,
			name: /1\.\s*Introdução/,
		});
		await heading.scrollIntoViewIfNeeded();
		await heading.waitFor();
		await expect(page).toHaveScreenshot("section-1-intro.png", {
			fullPage: true,
			animations: "disabled",
			timeout: 30000,
		});
	});

	test("section 2 — Etapa 1", async ({ page }) => {
		await page.goto("https://mses-gym-docs.vercel.app", {
			waitUntil: "networkidle",
		});
		const heading = page.getByRole("heading", {
			level: 1,
			name: /2\.\s*Etapa 1/,
		});
		await heading.scrollIntoViewIfNeeded();
		await heading.waitFor();
		await expect(page).toHaveScreenshot("section-2-etapa1.png", {
			fullPage: true,
			animations: "disabled",
			timeout: 30000,
		});
	});

	test("section 3 — Stakeholders", async ({ page }) => {
		await page.goto("https://mses-gym-docs.vercel.app", {
			waitUntil: "networkidle",
		});
		const heading = page.getByRole("heading", {
			level: 1,
			name: /3\.\s*Stakeholders/,
		});
		await heading.scrollIntoViewIfNeeded();
		await heading.waitFor();
		await expect(page).toHaveScreenshot("section-3-stakeholders.png", {
			fullPage: true,
			animations: "disabled",
			timeout: 30000,
		});
	});

	test("section 4 — Requisitos", async ({ page }) => {
		await page.goto("https://mses-gym-docs.vercel.app", {
			waitUntil: "networkidle",
		});
		const heading = page.getByRole("heading", {
			level: 1,
			name: /4\.\s*Identificação.*Requisitos/,
		});
		await heading.scrollIntoViewIfNeeded();
		await heading.waitFor();
		await expect(page).toHaveScreenshot("section-4-requisitos.png", {
			fullPage: true,
			animations: "disabled",
			timeout: 30000,
		});
	});

	test("section 5 — Etapa 2", async ({ page }) => {
		await page.goto("https://mses-gym-docs.vercel.app", {
			waitUntil: "networkidle",
		});
		const heading = page.getByRole("heading", {
			level: 1,
			name: /5\.\s*Etapa 2/,
		});
		await heading.scrollIntoViewIfNeeded();
		await heading.waitFor();
		await expect(page).toHaveScreenshot("section-5-etapa2.png", {
			fullPage: true,
			animations: "disabled",
			timeout: 30000,
		});
	});
});
