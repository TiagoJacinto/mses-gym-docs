import { expect, test } from "@playwright/test";

/**
 * Minimal section-verification tests.
 * Each test confirms that a major section heading is present on the page.
 * No scroll, no exact text match — just "does this section exist".
 */

test.describe("Trabalho-MSES section presence", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
	});

	// ─── Cover & Intro ───────────────────────────────────────────────

	test("cover page loads", async ({ page }) => {
		await expect(page.getByText("Sistema de Gestão")).toBeVisible();
	});

	test("section 1 — Introdução", async ({ page }) => {
		await expect(
			page.getByRole("heading", { level: 1, name: /1\.\s*Introdução/ }),
		).toBeVisible();
	});

	// ─── Section 2 ───────────────────────────────────────────────────

	test("section 2 heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", { level: 1, name: /2\.\s*Etapa 1/ }),
		).toBeVisible();
	});

	// ─── Section 3 ───────────────────────────────────────────────────

	test("section 3 heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", { level: 1, name: /3\.\s*Stakeholders/ }),
		).toBeVisible();
	});

	// ─── Section 4 — Requirements ────────────────────────────────────

	test("section 4 heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", {
				level: 1,
				name: /4\.\s*Identificação.*Requisitos/,
			}),
		).toBeVisible();
	});

	// ─── Section 5 — Structural Modelling ───────────────────────────

	test("section 5 heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", { level: 1, name: /5\.\s*Etapa 2/ }),
		).toBeVisible();
	});
});
