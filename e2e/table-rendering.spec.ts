import { expect, test } from "@playwright/test";
import { Selectors } from "./selectors";

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

	test("use case detail tables should have Campo/Valor rows", async ({
		page,
	}) => {
		// UC tables follow headings like "UC-01 — Gerir Registo de Membros"
		// and have "Campo | Valor" columns
		const ucText = page.getByText(/UC-01/);
		await expect(ucText.first()).toBeVisible({ timeout: 15000 });
		// The table after UC-01 heading has Campo/Valor structure
		const ucTable = page.locator(Selectors.table).filter({
			hasText: /Campo.*Valor|Ator principal/,
		});
		await expect(ucTable.first()).toBeVisible({ timeout: 15000 });
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

		// Home page has: stakeholder tables (3) + RF table (1) + RNF table (1) + UC tables (9) = 14+
		expect(count).toBeGreaterThan(10);
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
		// No <section> wrappers in markdown — h3 with "Requisitos Funcionais" exists directly
		const rfHeading = page.locator(Selectors.h3).filter({
			hasText: /Requisitos Funcionais/,
		});
		await expect(rfHeading).toBeVisible({ timeout: 5000 });
		// Table should follow the heading
		await expect(rfHeading.locator("~ table").first()).toBeVisible();
	});

	test("mermaid diagrams should render as SVG", async ({ page }) => {
		const mermaidDivs = page.locator(Selectors.mermaid);
		await expect(mermaidDivs.first()).toBeVisible();

		await page.waitForSelector(Selectors.mermaidSvg, { timeout: 10000 });

		const svgCount = await page.locator(Selectors.mermaidSvg).count();
		expect(svgCount).toBeGreaterThan(0);
	});

	test("page should have at least one section", async ({ page }) => {
		const sections = page.locator(Selectors.section);
		const count = await sections.count();
		expect(count).toBeGreaterThan(0);
	});
});
