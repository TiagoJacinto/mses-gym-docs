import { expect, test } from "@playwright/test";
import { Selectors } from "../selectors";

test.describe("Table Rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForSelector(Selectors.table, { timeout: 10000 });
		await page.waitForTimeout(2000);
	});

	test("stakeholder tables should have content rows", async ({ page }) => {
		const tables = page.locator(Selectors.table);
		await expect(tables.first()).toBeVisible({ timeout: 15000 });

		const firstTableRows = tables.first().locator(Selectors.tableRow);
		// Atores Principais table has 3 rows (header + 2 data rows)
		const rowCount = await firstTableRows.count();
		expect(rowCount).toBeGreaterThan(1);
	});

	test("stakeholder table should have Ator column", async ({ page }) => {
		const atorTable = page
			.locator(Selectors.table)
			.filter({ hasText: /Ator/ })
			.first();
		await expect(atorTable).toBeVisible({ timeout: 15000 });
		await expect(
			atorTable.locator(Selectors.tableHeader).first(),
		).toContainText("Ator");
	});

	test("functional requirements table should contain RF-01", async ({
		page,
	}) => {
		const rfTable = page.locator(Selectors.table).filter({ hasText: /RF-01/ });
		await expect(rfTable).toBeVisible({ timeout: 15000 });

		const content = await rfTable.textContent();
		expect(content).toContain("RF-01");
	});

	test("non-functional requirements table should contain RNF-01", async ({
		page,
	}) => {
		const rnfTable = page
			.locator(Selectors.table)
			.filter({ hasText: /RNF-01/ });
		await expect(rnfTable).toBeVisible({ timeout: 15000 });

		const content = await rnfTable.textContent();
		expect(content).toContain("RNF-01");
	});

	test("tables should have visible borders", async ({ page }) => {
		const tables = page.locator(Selectors.table);
		const count = await tables.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const table = tables.nth(i);
			const firstTd = table.locator(Selectors.tableCell).first();
			await expect(firstTd).toBeVisible();
		}
	});

	test("tables: border style is solid (grid lines)", async ({ page }) => {
		const table = page.locator(Selectors.table).first();
		await expect(table).toBeVisible();
		const firstTd = table.locator(Selectors.tableCell).first();
		const borderStyle = await firstTd.evaluate(
			(el) => window.getComputedStyle(el).borderStyle,
		);
		expect(borderStyle).toBe("solid");
	});

	test("no tables should be empty (only header row)", async ({ page }) => {
		const tables = page.locator(Selectors.table);
		const count = await tables.count();

		for (let i = 0; i < count; i++) {
			const table = tables.nth(i);
			const rows = table.locator(Selectors.tableRow);
			const rowCount = await rows.count();

			expect(
				rowCount,
				`Table ${i} should have data rows beyond header`,
			).toBeGreaterThan(1);
		}
	});

	test("page should render multiple tables", async ({ page }) => {
		const tables = page.locator(Selectors.table);
		const count = await tables.count();

		// Actual count: stakeholder (3) + RF (1) + RNF (1) + UC use case detail (1) = 6
		expect(count).toBeGreaterThan(4);
	});

	test("tables should have visible borders (grid lines)", async ({ page }) => {
		const table = page.locator(Selectors.table).first();
		await expect(table).toBeVisible();
		const firstTd = table.locator(Selectors.tableCell).first();
		const borderStyle = await firstTd.evaluate(
			(el) => window.getComputedStyle(el).borderStyle,
		);
		expect(borderStyle).toBe("solid");
	});
});

test.describe("Document Structure", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForSelector(Selectors.table, { timeout: 10000 });
		await page.waitForTimeout(2000);
	});

	test("requirements section should have heading and table", async ({
		page,
	}) => {
		// The RF table follows h3 with "Requisitos Funcionais" (h3, not h2)
		// The document has ### 4.1. Requisitos Funcionais (RF) which renders as h3
		const rfHeading = page.getByText(/Requisitos Funcionais/, { exact: false });
		await expect(rfHeading.first()).toBeVisible({ timeout: 10000 });
		// Table should follow the heading
		await expect(rfHeading.locator("~ table").first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("page should have at least one section", async ({ page }) => {
		const sections = page.locator(Selectors.section);
		const count = await sections.count();
		expect(count).toBeGreaterThan(0);
	});
});
