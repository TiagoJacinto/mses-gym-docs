import { expect, test } from "@playwright/test";

test.describe("Mermaid Diagrams Rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForTimeout(5000);
	});

	test("no mermaid diagram should show syntax error", async ({ page }) => {
		const errorText = page.locator("text=Syntax error in text");
		await expect(errorText).not.toBeVisible({ timeout: 5000 });
	});

	test("no mermaid diagram should show parse error", async ({ page }) => {
		const parseError = page.locator("text=Parse error");
		await expect(parseError).not.toBeVisible({ timeout: 5000 });
	});

	test("all mermaid diagrams should render as SVG", async ({ page }) => {
		const mermaidDivs = page.locator(".mermaid");
		const count = await mermaidDivs.count();
		expect(count).toBeGreaterThan(0);

		const svgElements = page.locator(".mermaid svg");
		const svgCount = await svgElements.count();
		expect(svgCount).toBe(count);
	});
});
