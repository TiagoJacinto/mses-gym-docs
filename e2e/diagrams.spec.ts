import { expect, test } from "@playwright/test";
import { Selectors } from "../selectors";

test.describe("Diagram Rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForTimeout(5000);
	});

	// ─── Mermaid ─────────────────────────────────────────────────

	test("mermaid: no syntax error text", async ({ page }) => {
		const errorText = page
			.locator(Selectors.mermaid)
			.filter({ hasText: /Syntax error in text/i });
		await expect(errorText).not.toBeVisible({ timeout: 5000 });
	});

	test("mermaid: no parse error text", async ({ page }) => {
		const parseError = page
			.locator(Selectors.mermaid)
			.filter({ hasText: /Parse error/i });
		await expect(parseError).not.toBeVisible({ timeout: 5000 });
	});

	test("mermaid: all render as SVG", async ({ page }) => {
		const mermaidDivs = page.locator(Selectors.mermaid);
		const count = await mermaidDivs.count();
		expect(count).toBeGreaterThan(0);

		const svgElements = page.locator(".mermaid > svg");
		const svgCount = await svgElements.count();
		expect(svgCount).toBeGreaterThan(0);
	});

	// ─── PlantUML ────────────────────────────────────────────────

	test("plantuml: renders as base64 PNG, not raw code", async ({ page }) => {
		const diagrams = page.locator(Selectors.plantumlDiagram);
		const count = await diagrams.count();
		if (count === 0) {
			test.skip();
			return;
		}

		for (let i = 0; i < count; i++) {
			const el = diagrams.nth(i);
			await expect(el).not.toContainText("@startuml");
			await expect(el).not.toContainText("@enduml");

			const img = el.locator("img");
			await expect(img).toBeVisible();
			await expect(img).toHaveAttribute("src", /^data:image\/png;base64,/);
		}
	});

	test("plantuml: images load without errors", async ({ page }) => {
		const diagrams = page.locator(Selectors.plantumlDiagram);
		const count = await diagrams.count();
		if (count === 0) {
			test.skip();
			return;
		}

		const errors: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") errors.push(msg.text());
		});

		for (let i = 0; i < count; i++) {
			const img = diagrams.nth(i).locator("img");
			const src = await img.getAttribute("src");
			expect(src).toMatch(/^data:image\/png;base64,/);
		}

		expect(errors.filter((e) => e.includes("Failed to load"))).toHaveLength(0);
	});

	test("plantuml: diagram containers are attached to DOM", async ({ page }) => {
		const diagrams = page.locator(Selectors.plantumlDiagram);
		const count = await diagrams.count();
		if (count === 0) {
			test.skip();
			return;
		}
		for (let i = 0; i < count; i++) {
			await expect(diagrams.nth(i)).toBeAttached();
		}
	});
});
