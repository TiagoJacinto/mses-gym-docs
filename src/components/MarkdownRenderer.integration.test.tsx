import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock mermaid before importing MarkdownRenderer
vi.mock("mermaid", () => ({
	default: {
		initialize: vi.fn(),
		render: vi.fn().mockResolvedValue({ svg: "<svg>test</svg>" }),
	},
}));

// Mock panzoom
Object.defineProperty(window, "panzoom", {
	value: vi.fn(),
	writable: true,
});

import MarkdownRenderer from "./MarkdownRenderer";

// Integration tests for MarkdownRenderer
// These tests verify the full component behavior including useEffect side effects
// Browser-dependent features (mermaid, panzoom) are mocked

describe("MarkdownRenderer", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	describe("basic markdown rendering", () => {
		it("renders h1 heading from markdown", async () => {
			render(
				<MarkdownRenderer content="# Main Heading" plantumlSvgPaths={[]} />,
			);

			await waitFor(() => {
				const h1 = document.querySelector("h1");
				expect(h1).toBeTruthy();
				expect(h1).toHaveTextContent("Main Heading");
			});
		});

		it("renders h2 heading from markdown", async () => {
			render(
				<MarkdownRenderer content="## Sub Heading" plantumlSvgPaths={[]} />,
			);

			await waitFor(() => {
				const h2 = document.querySelector("h2");
				expect(h2).toBeTruthy();
				expect(h2).toHaveTextContent("Sub Heading");
			});
		});

		it("renders h3 heading from markdown", async () => {
			render(
				<MarkdownRenderer content="### Small Heading" plantumlSvgPaths={[]} />,
			);

			await waitFor(() => {
				const h3 = document.querySelector("h3");
				expect(h3).toBeTruthy();
				expect(h3).toHaveTextContent("Small Heading");
			});
		});

		it("renders bold text using ** syntax", async () => {
			render(
				<MarkdownRenderer
					content="This is **bold text** example"
					plantumlSvgPaths={[]}
				/>,
			);

			await waitFor(() => {
				const boldElement = document.querySelector("strong");
				expect(boldElement).toBeTruthy();
				expect(boldElement).toHaveTextContent("bold text");
			});
		});

		it("renders italic text using * syntax", async () => {
			render(
				<MarkdownRenderer
					content="This is *italic text* example"
					plantumlSvgPaths={[]}
				/>,
			);

			await waitFor(() => {
				const italicElement = document.querySelector("em");
				expect(italicElement).toBeTruthy();
				expect(italicElement).toHaveTextContent("italic text");
			});
		});

		it("renders inline code using backticks", async () => {
			render(
				<MarkdownRenderer
					content="Use the `console.log()` function"
					plantumlSvgPaths={[]}
				/>,
			);

			await waitFor(() => {
				const codeElement = document.querySelector("code");
				expect(codeElement).toBeTruthy();
				expect(codeElement).toHaveTextContent("console.log()");
			});
		});

		it("renders markdown links correctly", async () => {
			render(
				<MarkdownRenderer
					content="Visit [our website](https://example.com) for more"
					plantumlSvgPaths={[]}
				/>,
			);

			await waitFor(() => {
				const link = document.querySelector("a");
				expect(link).toBeTruthy();
				expect(link).toHaveAttribute("href", "https://example.com");
				expect(link).toHaveTextContent("our website");
			});
		});
	});

	describe("component structure", () => {
		it("renders article element with id content", async () => {
			render(<MarkdownRenderer content="Some content" plantumlSvgPaths={[]} />);

			await waitFor(() => {
				const article = document.getElementById("content");
				expect(article).toBeTruthy();
			});
		});

		it("renders table of contents details element", async () => {
			render(<MarkdownRenderer content="## Section" plantumlSvgPaths={[]} />);

			await waitFor(() => {
				const toc = document.getElementById("table-of-contents");
				expect(toc).toBeTruthy();
			});
		});

		it("renders toc with correct summary label", async () => {
			render(<MarkdownRenderer content="## Section" plantumlSvgPaths={[]} />);

			await waitFor(() => {
				const summary = document.querySelector("summary");
				expect(summary).toHaveTextContent("Índice");
			});
		});

		it("toc is open by default", async () => {
			render(<MarkdownRenderer content="## Section" plantumlSvgPaths={[]} />);

			await waitFor(() => {
				const toc = document.getElementById("table-of-contents");
				expect(toc).toHaveAttribute("open");
			});
		});
	});

	describe("empty and edge cases", () => {
		it("handles empty content string", async () => {
			render(<MarkdownRenderer content="" plantumlSvgPaths={[]} />);

			await waitFor(() => {
				const article = document.querySelector("#content");
				expect(article).toBeTruthy();
			});
		});

		it("handles whitespace-only content", async () => {
			render(<MarkdownRenderer content="   \n\n   " plantumlSvgPaths={[]} />);

			await waitFor(() => {
				const article = document.querySelector("#content");
				expect(article).toBeTruthy();
			});
		});

		it("renders mixed content with heading and formatted text", async () => {
			render(
				<MarkdownRenderer
					content="# Title\n\n**Bold** and *italic* text."
					plantumlSvgPaths={[]}
				/>,
			);

			await waitFor(() => {
				expect(document.querySelector("h1")).toBeTruthy();
				expect(document.querySelector("strong")).toBeTruthy();
				expect(document.querySelector("em")).toBeTruthy();
			});
		});

		it("handles strong emphasis with ***", async () => {
			render(
				<MarkdownRenderer
					content="***very strong emphasis***"
					plantumlSvgPaths={[]}
				/>,
			);

			await waitFor(() => {
				const strong = document.querySelector("strong em");
				expect(strong).toBeTruthy();
				expect(strong).toHaveTextContent("very strong emphasis");
			});
		});
	});

	describe("content updates", () => {
		it("updates rendered content when content prop changes", async () => {
			const { rerender } = render(
				<MarkdownRenderer content="# First" plantumlSvgPaths={[]} />,
			);

			await waitFor(() => {
				expect(document.querySelector("h1")).toHaveTextContent("First");
			});

			rerender(<MarkdownRenderer content="# Second" plantumlSvgPaths={[]} />);

			await waitFor(() => {
				expect(document.querySelector("h1")).toHaveTextContent("Second");
			});
		});
	});
});
