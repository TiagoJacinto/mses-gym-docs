/**
 * Stable selector contract for UI elements.
 * Import this in both frontend components and e2e tests to keep selectors in sync.
 */

export const Selectors = {
	// Page structure
	page: "#questions",

	// Question list
	questionItem: ".question-item",
	questionNumber: ".question-number",
	questionText: ".question-text",
	questionHeader: ".question-header",
	questionContent: ".question-content",
	questionButtons: ".question-buttons",

	// Buttons (within question item)
	btnResposta: ".btn-resposta",
	btnDicas: ".btn-dicas",
	btnReferencia: ".btn-referencia",

	// Content blocks (within question item)
	answerContent: ".answer-content",
	dicasContent: ".dicas-content",
	referenciaContent: ".referencia-content",
	blockLabel: ".block-label",

	// Answer/Tip/Reference blocks
	answerOpen: ".answer-content.open",
	dicasOpen: ".dicas-content.open",
	referenciaOpen: ".referencia-content.open",

	// Stats
	statCard: ".stat-card",
	statValue: ".stat-card .value",

	// Tables (home page / requirements)
	table: "table",
	tableRow: "tr",
	tableHeader: "th",
	tableCell: "td",

	// Document structure
	section: "section",
	h3: "h3",
	h2: "h2",
	h1: "h1",

	// Table of contents
	tableOfContents: "#table-of-contents",
	tocItem: "#table-of-contents li",

	// Diagrams
	mermaid: ".mermaid",
	mermaidSvg: ".mermaid svg",

	// Footer
	footer: "footer",

	// Scroll
	html: "html",
} as const;

export type SelectorKey = keyof typeof Selectors;
