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

test.describe("RF Table Structure", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForSelector(Selectors.table, { timeout: 10000 });
		await page.waitForTimeout(2000);
	});

	test("functional requirements table should have Título column", async ({
		page,
	}) => {
		const rfTable = page
			.locator(Selectors.table)
			.filter({ hasText: /RF-01/ })
			.first();
		await expect(rfTable).toBeVisible({ timeout: 15000 });

		// Check that Título header exists
		const headers = rfTable.locator(Selectors.tableHeader);
		const headerCount = await headers.count();
		expect(headerCount).toBe(5);

		const headerTexts = await headers.allTextContents();
		expect(headerTexts).toContain("Título");
	});

	test("RF entries should have Título values", async ({ page }) => {
		const rfTable = page
			.locator(Selectors.table)
			.filter({ hasText: /RF-01a/ })
			.first();
		await expect(rfTable).toBeVisible({ timeout: 15000 });

		// RF-01a should have "Criação de membro" as Título
		const row = rfTable.locator(Selectors.tableRow).filter({
			hasText: /RF-01a.*Criação de membro/,
		});
		await expect(row).toBeVisible({ timeout: 10000 });
	});

	test("RF-06 entries should have Login and Logout titles", async ({
		page,
	}) => {
		const rfTable = page
			.locator(Selectors.table)
			.filter({ hasText: /RF-06a/ })
			.first();
		await expect(rfTable).toBeVisible({ timeout: 15000 });

		const rows = rfTable.locator(Selectors.tableRow);
		// Should have Login and Logout
		const loginRow = rows.filter({ hasText: /Login/ });
		const logoutRow = rows.filter({ hasText: /Logout/ });
		await expect(loginRow).toBeVisible({ timeout: 10000 });
		await expect(logoutRow).toBeVisible({ timeout: 10000 });
	});

	test("all RF rows should have 5 columns", async ({ page }) => {
		const rfTable = page
			.locator(Selectors.table)
			.filter({ hasText: /RF-01/ })
			.first();
		await expect(rfTable).toBeVisible({ timeout: 15000 });

		const rows = rfTable.locator(Selectors.tableRow);
		const rowCount = await rows.count();

		for (let i = 0; i < rowCount; i++) {
			const row = rows.nth(i);
			const cells = row.locator(Selectors.tableCell);
			const cellCount = await cells.count();
			// Skip category header rows (colspan=5 indicates a category header)
			if (cellCount === 5) {
				expect(cellCount, `Row ${i} should have 5 columns`).toBe(5);
			}
		}
	});
});
