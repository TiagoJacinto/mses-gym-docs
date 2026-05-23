import { expect, test } from "@playwright/test";
import path from "path";

test.describe("PlantUML diagram rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("PlantUML blocks render as SVG images, not raw PlantUML code", async ({
		page,
	}) => {
		const plantumlElements = page.locator(".plantuml");
		const count = await plantumlElements.count();

		if (count === 0) {
			test.skip();
			return;
		}

		for (let i = 0; i < count; i++) {
			const el = plantumlElements.nth(i);
			await expect(el).not.toContainText("@startuml");
			await expect(el).not.toContainText("@enduml");

			const img = el.locator("img");
			await expect(img).toBeVisible();
			await expect(img).toHaveAttribute(
				"src",
				/\/diagrams\/diagram_\d+\.svg$/,
			);
		}
	});

	test("PlantUML SVG images load successfully without errors", async ({
		page,
	}) => {
		const plantumlElements = page.locator(".plantuml");
		const count = await plantumlElements.count();

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
			const el = plantumlElements.nth(i);
			const img = el.locator("img");
			const src = await img.getAttribute("src");

			const response = await page.request.get(src!);
			expect(response.status()).toBe(200);

			const contentType = response.headers()["content-type"];
			expect(contentType).toContain("image/svg+xml");
		}

		expect(errors.filter((e) => e.includes("Failed to load"))).toHaveLength(0);
	});

	test("PlantUML diagrams are wrapped in pan-zoom container", async ({
		page,
	}) => {
		const plantumlElements = page.locator(".plantuml");
		const count = await plantumlElements.count();

		if (count === 0) {
			test.skip();
			return;
		}

		for (let i = 0; i < count; i++) {
			const el = plantumlElements.nth(i);
			const wrapper = el.locator(".plantuml-pan-wrapper");
			await expect(wrapper).toBeAttached();
		}
	});
});
