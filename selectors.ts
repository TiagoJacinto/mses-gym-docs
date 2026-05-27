/**
 * Single source of truth for all e2e test selectors.
 * Import this in e2e tests — do NOT import from src/test/selectors.ts.
 *
 * Use the VISIBLE variants for interaction/visibility assertions
 * (e.g., `.mermaid svg` NOT `.mermaid` which is the hidden <pre>).
 */

export const Selectors = {
	// ─── Page structure ──────────────────────────────────────────

	/** Main article container (markdown body) */
	markdownBody: "#content",

	/** Table of contents container */
	tableOfContents: "#table-of-contents",

	/** TOC list items */
	tocItem: "#table-of-contents li",

	// ─── Question components ────────────────────────────────────

	questionItem: ".question-item",
	questionNumber: ".question-number",
	questionText: ".question-text",
	questionHeader: ".question-header",
	questionContent: ".question-content",
	questionButtons: ".question-buttons",

	// Buttons
	btnResposta: ".btn-resposta",
	btnDicas: ".btn-dicas",
	btnReferencia: ".btn-referencia",

	// Content blocks
	answerContent: ".answer-content",
	dicasContent: ".dicas-content",
	referenciaContent: ".referencia-content",
	blockLabel: ".block-label",

	// Open state modifiers
	answerOpen: ".answer-content.open",
	dicasOpen: ".dicas-content.open",
	referenciaOpen: ".referencia-content.open",

	// ─── Tables ──────────────────────────────────────────────────

	table: "table",
	tableRow: "tr",
	tableHeader: "th",
	tableCell: "td",

	// Table style variants (used in some tables)
	tableStriped: "table.striped",
	tableBordered: "table.bordered",

	// ─── Document structure ──────────────────────────────────────

	section: "section",
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",

	// ─── Diagrams — Mermaid ─────────────────────────────────────

	/**
	 * The <pre class="mermaid"> source element.
	 * NOTE: this is the hidden <pre> wrapper — not visible on screen.
	 * For visibility/interaction tests use .mermaidSvg instead.
	 */
	mermaid: ".mermaid",

	/**
	 * The rendered SVG inside the mermaid container.
	 * This is the VISIBLE element — use this for toBeVisible(), click(), etc.
	 */
	mermaidSvg: ".mermaid svg",

	// ─── Diagrams — PlantUML ─────────────────────────────────────

	/** PlantUML diagram container (figure/wrapper) */
	plantumlDiagram: ".plantuml-diagram",

	/** PlantUML rendered <img> element (base64 data URL) */
	plantumlImg: ".plantuml-img",

	// ─── Diagram — Fullscreen mode ──────────────────────────────

	diagramFullscreen: ".diagram-fullscreen",
	diagramFullscreenBackdrop: ".diagram-fullscreen-backdrop",
	diagramFullscreenContent: ".diagram-fullscreen-content",
	diagramFullscreenHint: ".diagram-fullscreen-hint",

	// ─── Print / page-break ─────────────────────────────────────

	/** Page-break div — display:none on screen, block in print media */
	pageBreak: ".page-break",

	// ─── Cover page ─────────────────────────────────────────────

	cover: ".cover",
	coverDate: ".cover-date",
	coverAuthors: ".cover-authors",

	// ─── Footer ─────────────────────────────────────────────────

	footer: "footer",
} as const;

export type SelectorKey = keyof typeof Selectors;
