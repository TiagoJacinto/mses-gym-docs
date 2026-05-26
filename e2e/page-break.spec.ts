import { test, expect } from "@playwright/test";

/**
 * Page-break print behavior test.
 *
 * Key insight: Playwright's page.pdf() produces a real paginated PDF and
 * tells us the page count.  A forced page-break that pushes the article past
 * the bottom of page 1 MUST result in ≥ 2 PDF pages.  Without it, everything
 * fits on page 1.
 *
 * We use CSS @media print emulation + PDF page-count as the ground truth.
 */

function buildPageHTML(withPageBreak: boolean): string {
	return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <title>Page Break Test</title>
  <style>
    @media print {
      .page-break {
        display: block !important;
        height: 0;
        margin: 0;
        padding: 0;
      }

      .page-break::after {
        content: "";
        display: block;
        page-break-after: always;
        break-after: page;
      }
    }

    .page-break {
      display: none;
    }

    body {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
    }

    /*
     * A4 at 96dpi ≈ 1123px.
     * Push the date near the bottom of the first printed page.
     * Everything after the page-break div lands on page 2.
     */
    .cover-date {
      margin-top: 900px;
    }
  </style>
</head>
<body>
  <div>
    <p class="cover-date">Águeda, 25 de março de 2026</p>
    ${withPageBreak ? '<div class="page-break"></div>' : ""}
  </div>

  <article>
    <h2>Índice</h2>
    <p>This is the Índice section.</p>
  </article>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// CSS property tests — verify the rules fire correctly in print media
// ---------------------------------------------------------------------------

test.describe("page-break CSS properties", () => {
	test("screen: .page-break has display:none", async ({ page }) => {
		await page.setContent(buildPageHTML(true));
		await page.emulateMedia({ media: "screen" });

		const display = await page.evaluate(() => {
			const el = document.querySelector<HTMLElement>(".page-break");
			return window.getComputedStyle(el!).display;
		});
		expect(display).toBe("none");
	});

	test("print: .page-break has display:block", async ({ page }) => {
		await page.setContent(buildPageHTML(true));
		await page.emulateMedia({ media: "print" });

		const display = await page.evaluate(() => {
			const el = document.querySelector<HTMLElement>(".page-break");
			return window.getComputedStyle(el!).display;
		});
		expect(display).toBe("block");
	});

	test("print: .page-break::after has page-break-after:always", async ({
		page,
	}) => {
		await page.setContent(buildPageHTML(true));
		await page.emulateMedia({ media: "print" });

		const pageBreakAfter = await page.evaluate(() => {
			const el = document.querySelector<HTMLElement>(".page-break");
			const style = window.getComputedStyle(el!, "::after");
			return (style as unknown as Record<string, string>).pageBreakAfter;
		});
		expect(pageBreakAfter).toBe("always");
	});

	test("print: .page-break::after has break-after:page", async ({ page }) => {
		await page.setContent(buildPageHTML(true));
		await page.emulateMedia({ media: "print" });

		const breakAfter = await page.evaluate(() => {
			const el = document.querySelector<HTMLElement>(".page-break");
			const style = window.getComputedStyle(el!, "::after");
			return (style as unknown as Record<string, string>).breakAfter;
		});
		expect(breakAfter).toBe("page");
	});
});

// ---------------------------------------------------------------------------
// DOM structure tests — verify ordering is correct regardless of CSS
// ---------------------------------------------------------------------------

test.describe("DOM structure", () => {
	test("WITH page-break: page-break div exists in DOM", async ({ page }) => {
		await page.setContent(buildPageHTML(true));
		await page.emulateMedia({ media: "print" });

		const exists = await page.evaluate(
			() => !!document.querySelector(".page-break"),
		);
		expect(exists).toBe(true);
	});

	test("WITHOUT page-break: page-break div is absent from DOM", async ({
		page,
	}) => {
		await page.setContent(buildPageHTML(false));
		await page.emulateMedia({ media: "print" });

		const exists = await page.evaluate(
			() => !!document.querySelector(".page-break"),
		);
		expect(exists).toBe(false);
	});

	test("WITH page-break: Índice h2 is after the date in DOM order", async ({
		page,
	}) => {
		await page.setContent(buildPageHTML(true));
		await page.emulateMedia({ media: "print" });

		const order = await page.evaluate(() => {
			return Array.from(document.querySelectorAll("p, h2")).map((el) =>
				(el as HTMLElement).textContent!.trim(),
			);
		});

		const dateIdx = order.findIndex((t) => t.includes("Águeda"));
		const indiceIdx = order.findIndex((t) => t.includes("Índice"));

		expect(dateIdx).toBeGreaterThanOrEqual(0);
		expect(indiceIdx).toBeGreaterThanOrEqual(0);
		expect(indiceIdx).toBeGreaterThan(dateIdx);
	});
});

// ---------------------------------------------------------------------------
// PDF pagination tests — the definitive behavioral proof
// ---------------------------------------------------------------------------

test.describe("PDF pagination", () => {
	/**
	 * Generate a PDF and check the result:
	 * - WITH page-break: must have ≥ 2 pages  (break fires, article goes to p2)
	 * - WITHOUT page-break: must have exactly 1 page  (everything fits on p1)
	 */
	test("WITH page-break → PDF has ≥ 2 pages", async ({ page }) => {
		await page.setContent(buildPageHTML(true));
		await page.emulateMedia({ media: "print" });

		const pdfBuffer = await page.pdf({
			printBackground: true,
			format: "A4",
		});

		// Parse the PDF header to get the page count.
		// A valid PDF has `/Count N` where N is the number of pages.
		const pdfStr = pdfBuffer.toString("binary");
		const pageCountMatch = pdfStr.match(/\/Count (\d+)/);
		const pageCount = pageCountMatch ? parseInt(pageCountMatch[1], 10) : 1;

		expect(pageCount).toBeGreaterThanOrEqual(2);
	});

	test("WITHOUT page-break → PDF has exactly 1 page", async ({ page }) => {
		await page.setContent(buildPageHTML(false));
		await page.emulateMedia({ media: "print" });

		const pdfBuffer = await page.pdf({
			printBackground: true,
			format: "A4",
		});

		const pdfStr = pdfBuffer.toString("binary");
		const pageCountMatch = pdfStr.match(/\/Count (\d+)/);
		const pageCount = pageCountMatch ? parseInt(pageCountMatch[1], 10) : 1;

		expect(pageCount).toBe(1);
	});
});
