import { expect, test } from "@playwright/test";

test.describe("Diagram Fullscreen Mode", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForTimeout(3000);
	});

	test("double-click on diagram enters fullscreen mode", async ({ page }) => {
		const mermaidDiv = page.locator(".mermaid").first();
		const count = await mermaidDiv.count();

		if (count === 0) {
			test.skip();
			return;
		}

		await mermaidDiv.dblclick();

		const fullscreenOverlay = page.locator(".diagram-fullscreen");
		await expect(fullscreenOverlay).toBeVisible({ timeout: 3000 });
	});

	test("single click in fullscreen does NOT exit fullscreen", async ({ page }) => {
		const mermaidDiv = page.locator(".mermaid").first();
		const count = await mermaidDiv.count();

		if (count === 0) {
			test.skip();
			return;
		}

		await mermaidDiv.dblclick();

		const fullscreenOverlay = page.locator(".diagram-fullscreen");
		await expect(fullscreenOverlay).toBeVisible({ timeout: 3000 });

		await fullscreenOverlay.click();

		await expect(fullscreenOverlay).toBeVisible({ timeout: 1000 });
	});

	test("Escape key exits fullscreen mode", async ({ page }) => {
		const mermaidDiv = page.locator(".mermaid").first();
		const count = await mermaidDiv.count();

		if (count === 0) {
			test.skip();
			return;
		}

		await mermaidDiv.dblclick();

		const fullscreenOverlay = page.locator(".diagram-fullscreen");
		await expect(fullscreenOverlay).toBeVisible({ timeout: 3000 });

		await page.keyboard.press("Escape");

		await expect(fullscreenOverlay).not.toBeVisible({ timeout: 1000 });
	});

	test("click on backdrop exits fullscreen", async ({ page }) => {
		const mermaidDiv = page.locator(".mermaid").first();
		const count = await mermaidDiv.count();

		if (count === 0) {
			test.skip();
			return;
		}

		await mermaidDiv.dblclick();

		const fullscreenOverlay = page.locator(".diagram-fullscreen");
		await expect(fullscreenOverlay).toBeVisible({ timeout: 3000 });

		await page.evaluate(() => {
			const backdrop = document.querySelector(".diagram-fullscreen-backdrop") as HTMLElement;
			backdrop?.click();
		});

		await expect(fullscreenOverlay).not.toBeVisible({ timeout: 1000 });
	});

	test("diagram fills entire viewport in fullscreen", async ({ page }) => {
		const mermaidDiv = page.locator(".mermaid").first();
		const count = await mermaidDiv.count();

		if (count === 0) {
			test.skip();
			return;
		}

		await mermaidDiv.dblclick();

		const fullscreenOverlay = page.locator(".diagram-fullscreen");
		await expect(fullscreenOverlay).toBeVisible({ timeout: 3000 });

		const diagramBounds = await page.evaluate(() => {
			const svg = document.querySelector(".diagram-fullscreen svg") as SVGSVGElement;
			const img = document.querySelector(".diagram-fullscreen img") as HTMLImageElement;
			const diagram = svg || img;
			if (!diagram) return null;
			const rect = diagram.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const tolerance = 10;
			return {
				left: Math.round(rect.left),
				right: Math.round(rect.right),
				top: Math.round(rect.top),
				bottom: Math.round(rect.bottom),
				width: Math.round(rect.width),
				height: Math.round(rect.height),
				viewportWidth,
				viewportHeight,
				fillsWidth: rect.left <= tolerance && rect.right >= viewportWidth - tolerance,
				fillsHeight: rect.top <= tolerance && rect.bottom >= viewportHeight - tolerance,
				coverage: Math.round((rect.width * rect.height) / (viewportWidth * viewportHeight) * 100),
			};
		});

		console.log("Diagram bounds:", diagramBounds);
		expect(diagramBounds).not.toBeNull();
		expect(diagramBounds!.fillsWidth).toBe(true);
		expect(diagramBounds!.coverage).toBeGreaterThan(50);
	});
});