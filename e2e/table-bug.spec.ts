import { expect, test } from "@playwright/test";
import { Selectors } from "./selectors";

test.describe("Table Bug", () => {
	test("RF-01 functional requirement should be visible", async ({ page }) => {
		await page.goto("/");
		const rf01 = page.locator(Selectors.tableRow).filter({
			hasText: /RF-01/,
		});
		await expect(rf01).toBeVisible({ timeout: 10000 });
	});

	test("RNF-01 non-functional requirement should be visible", async ({
		page,
	}) => {
		await page.goto("/");
		// RNF-01 comes in variants like RNF-01a, RNF-01b
		const rnf01 = page.locator(Selectors.tableRow).filter({
			hasText: /RNF-01/,
		});
		await expect(rnf01.first()).toBeVisible({ timeout: 10000 });
	});

	test("stakeholder table should have Ator column header", async ({ page }) => {
		await page.goto("/");
		const ator = page.locator(Selectors.tableHeader).filter({
			hasText: "Ator",
		});
		await expect(ator.first()).toBeVisible({ timeout: 10000 });
	});

	test("domain table Domínio header should be visible", async ({ page }) => {
		await page.goto("/");
		// RNF table has "Domínio" column
		const dominio = page.locator(Selectors.tableHeader).filter({
			hasText: /Domínio/,
		});
		await expect(dominio.first()).toBeVisible({ timeout: 10000 });
	});

	test("UC-01 section should be visible", async ({ page }) => {
		await page.goto("/");
		// UC tables are preceded by headings like "UC-01 — Gerir Registo de Membros"
		const uc01 = page.getByText(/UC-01.*Gerir Registo/);
		await expect(uc01).toBeVisible({ timeout: 10000 });
	});

	test("RF-01 row should contain Criar Registo description", async ({
		page,
	}) => {
		await page.goto("/");
		const rf01Row = page
			.locator(Selectors.tableRow)
			.filter({ hasText: /RF-01/ });
		await expect(rf01Row).toBeVisible({ timeout: 10000 });
		await expect(rf01Row).toContainText("Criar Registo");
	});
});
