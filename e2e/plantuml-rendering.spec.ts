import { expect, test } from "@playwright/test";

test.describe("PlantUML diagram rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("PlantUML blocks render as images, not raw PlantUML code", async ({
		page,
	}) => {
		const plantumlDiagrams = page.locator(".plantuml-diagram");
		const count = await plantumlDiagrams.count();

		if (count === 0) {
			test.skip();
			return;
		}

		for (let i = 0; i < count; i++) {
			const el = plantumlDiagrams.nth(i);
			await expect(el).not.toContainText("@startuml");
			await expect(el).not.toContainText("@enduml");

			const img = el.locator("img");
			await expect(img).toBeVisible();
			await expect(img).toHaveAttribute("src", /^data:image\/png;base64,/);
		}
	});

	test("PlantUML images load successfully", async ({ page }) => {
		const plantumlDiagrams = page.locator(".plantuml-diagram");
		const count = await plantumlDiagrams.count();

		if (count === 0) {
			test.skip();
			return;
		}

		const errors: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") {
				errors.push(msg.text());
			}
		});

		for (let i = 0; i < count; i++) {
			const el = plantumlDiagrams.nth(i);
			const img = el.locator("img");
			const src = await img.getAttribute("src");
			expect(src).toMatch(/^data:image\/png;base64,/);
		}

		expect(errors.filter((e) => e.includes("Failed to load"))).toHaveLength(0);
	});

	test("PlantUML diagrams are wrapped in figure element", async ({ page }) => {
		const plantumlDiagrams = page.locator(".plantuml-diagram");
		const count = await plantumlDiagrams.count();

		if (count === 0) {
			test.skip();
			return;
		}

		for (let i = 0; i < count; i++) {
			const el = plantumlDiagrams.nth(i);
			await expect(el).toBeAttached();
		}
	});
});
