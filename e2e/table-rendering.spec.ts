import { expect, test } from "@playwright/test";

test.describe("Table Rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForSelector("table", { timeout: 10000 });
		await page.waitForTimeout(2000);
	});

	test("stakeholder tables should have content rows", async ({ page }) => {
		const tables = page.locator("table");
		await expect(tables.first()).toBeVisible({ timeout: 15000 });

		const firstTableRows = tables.first().locator("tr");
		await expect(firstTableRows).toHaveCount(7, { timeout: 15000 });

		const firstDataRowCells = tables.first().locator("tr:nth-child(2) td");
		await expect(firstDataRowCells.first()).toContainText(
			"Responsável Administrativo",
		);
	});

	test("domain table should have 7 functional domains and content", async ({
		page,
	}) => {
		const domainTable = page
			.locator("table")
			.filter({ hasText: "Domínio funcional" });
		await expect(domainTable).toBeVisible({ timeout: 15000 });

		const rows = domainTable.locator("tr");
		await expect(rows).toHaveCount(9, { timeout: 15000 });

		await expect(domainTable.locator("tr:nth-child(2)")).toContainText(
			"Gestão de utentes",
		);
	});

	test("functional requirements table should contain RF-01 through RF-25", async ({
		page,
	}) => {
		const rfTable = page
			.locator("table")
			.filter({ hasText: "Título" })
			.filter({ hasText: "RF-01" });
		await expect(rfTable).toBeVisible({ timeout: 15000 });

		const content = await rfTable.textContent();
		expect(content).toContain("RF-01");
		expect(content).toContain("RF-09");
		expect(content).toContain("RF-25");
	});

	test("non-functional requirements table should contain RNF-01", async ({
		page,
	}) => {
		const rnfTable = page.locator("table").filter({ hasText: "RNF-01" });
		await expect(rnfTable).toBeVisible({ timeout: 15000 });

		const content = await rnfTable.textContent();
		expect(content).toContain("RNF-01");
		expect(content).toContain("RNF-05");
	});

	test("use case detail tables should have Campo/Valor rows", async ({
		page,
	}) => {
		const ucTables = page.locator("table").filter({ hasText: "UC-01" });
		await expect(ucTables.first()).toBeVisible({ timeout: 15000 });

		const ucTableRows = ucTables.first().locator("tr");
		const rowCount = await ucTableRows.count();
		expect(rowCount).toBeGreaterThan(2);
	});

	test("tables should have visible borders", async ({ page }) => {
		const tables = page.locator("table");
		const count = await tables.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const table = tables.nth(i);
			const firstTd = table.locator("td").first();
			await expect(firstTd).toBeVisible();
			const borderBottom = await firstTd.evaluate(
				(el) => window.getComputedStyle(el).borderBottomStyle,
			);
			expect(borderBottom).not.toBe("none");
		}
	});

	test("tables should render with header cells and data cells", async ({
		page,
	}) => {
		const stakeholderTable = page
			.locator("table")
			.filter({ hasText: "Ator" })
			.first();
		await expect(stakeholderTable.locator("th").first()).toContainText("Ator");
		await expect(stakeholderTable.locator("td").first()).toContainText(
			"Responsável Administrativo",
		);
	});

	test("no tables should be empty (only header row)", async ({ page }) => {
		const tables = page.locator("table");
		const count = await tables.count();

		for (let i = 0; i < count; i++) {
			const table = tables.nth(i);
			const rows = table.locator("tr");
			const rowCount = await rows.count();

			expect(
				rowCount,
				`Table ${i} should have data rows beyond header`,
			).toBeGreaterThan(1);
		}
	});

	test("page should have correct total table count after content load", async ({
		page,
	}) => {
		const tables = page.locator("table");
		const count = await tables.count();

		expect(count).toBe(19);
	});

	test("tables should have visible borders (grid lines)", async ({ page }) => {
		const table = page.locator("table").first();
		await expect(table).toBeVisible();
		const firstTd = table.locator("td").first();
		const borderStyle = await firstTd.evaluate(
			(el) => window.getComputedStyle(el).borderStyle,
		);
		expect(borderStyle).toBe("solid");
	});
});

test.describe("Document Structure", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForSelector("table", { timeout: 10000 });
		await page.waitForTimeout(2000);
	});

	test("all section headings should be visible", async ({ page }) => {
		await expect(
			page.locator("h2").filter({ hasText: "Stakeholders e Utilizadores" }),
		).toBeVisible();
		await expect(
			page.locator("h3").filter({ hasText: "Requisitos Funcionais" }),
		).toBeVisible();
		await expect(
			page.locator("h3").filter({ hasText: "Requisitos Não Funcionais" }),
		).toBeVisible();
		await expect(
			page.locator("h3").filter({ hasText: "Casos de Uso" }),
		).toBeVisible();
	});

	test("mermaid diagrams should render as SVG", async ({ page }) => {
		const mermaidDivs = page.locator(".mermaid");
		await expect(mermaidDivs.first()).toBeVisible();

		await page.waitForSelector(".mermaid svg", { timeout: 10000 });

		const svgCount = await page.locator(".mermaid svg").count();
		expect(svgCount).toBeGreaterThan(0);
	});

	test("table of contents should be populated", async ({ page }) => {
		const tocItems = page.locator("#table-of-contents li");
		const count = await tocItems.count();

		expect(count).toBeGreaterThan(5);
	});
});
