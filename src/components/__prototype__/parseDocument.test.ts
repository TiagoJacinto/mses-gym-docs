// PROTOTYPE - Tests for parseDocument AST
// This is throwaway code to validate the design. Delete when done.

import { describe, expect, it } from "vitest";
import {
	createDocument,
	getAllByRole,
	getAllByText,
	getByCodeBlock,
	getByRole,
	getByTable,
	getByText,
	getChildrenOf,
} from "./parseDocument";
import "./matchers";

// Tracer bullet 1: parseDocument parses headings with nesting
describe("parseDocument - headings", () => {
	it("parses a simple heading", () => {
		const doc = createDocument("# Title");

		expect(doc.nodes).toHaveLength(1);
		expect(doc.nodes[0].type).toBe("heading");
		expect((doc.nodes[0] as any).text).toBe("Title");
		expect((doc.nodes[0] as any).level).toBe(1);
	});

	it("parses nested headings", () => {
		const doc = createDocument(`# Title

## Section

### Subsection`);

		const h1 = doc.nodes[0] as any;
		expect(h1.type).toBe("heading");
		expect(h1.level).toBe(1);
		expect(h1.text).toBe("Title");
		expect(h1.children).toHaveLength(1);

		const h2 = h1.children[0];
		expect(h2.type).toBe("heading");
		expect(h2.level).toBe(2);
		expect(h2.text).toBe("Section");
		expect(h2.children).toHaveLength(1);

		const h3 = h2.children[0];
		expect(h3.type).toBe("heading");
		expect(h3.level).toBe(3);
		expect(h3.text).toBe("Subsection");
	});

	it("parses sibling headings at root level", () => {
		const doc = createDocument(`# First

# Second`);

		expect(doc.nodes).toHaveLength(2);
		expect((doc.nodes[0] as any).text).toBe("First");
		expect((doc.nodes[1] as any).text).toBe("Second");
	});
});

// Tracer bullet 2: parseDocument parses inline text with modifiers
describe("parseDocument - inline text", () => {
	it("parses plain text", () => {
		const doc = createDocument("Some text content.");

		expect(doc.nodes[0].type).toBe("text");
		expect((doc.nodes[0] as any).content).toBe("Some text content.");
	});

	it("parses bold text", () => {
		const doc = createDocument("This is **bold** text.");

		expect(doc.nodes[0].type).toBe("text");
		expect((doc.nodes[0] as any).content).toBe("This is ");
		expect(doc.nodes[1].type).toBe("text");
		expect((doc.nodes[1] as any).content).toBe("bold");
		expect((doc.nodes[1] as any).modifiers).toContain("bold");
	});

	it("parses italic text", () => {
		const doc = createDocument("This is *italic* text.");

		expect(doc.nodes[1].type).toBe("text");
		expect((doc.nodes[1] as any).content).toBe("italic");
		expect((doc.nodes[1] as any).modifiers).toContain("italic");
	});

	it("parses bold italic combined", () => {
		const doc = createDocument("***bold italic***");

		expect(doc.nodes[0].type).toBe("text");
		expect((doc.nodes[0] as any).content).toBe("bold italic");
		expect((doc.nodes[0] as any).modifiers).toContain("bold");
		expect((doc.nodes[0] as any).modifiers).toContain("italic");
	});

	it("parses code inline", () => {
		const doc = createDocument("Use `console.log()` function");

		expect(doc.nodes[1].type).toBe("text");
		expect((doc.nodes[1] as any).content).toBe("console.log()");
		expect((doc.nodes[1] as any).modifiers).toContain("code");
	});

	it("parses text inside heading children", () => {
		const doc = createDocument("# Title\n\nSome **bold** text inside.");

		const h1 = doc.nodes[0] as any;
		expect(h1.children[0].type).toBe("text");
		expect(h1.children[0].content).toBe("Some ");
		expect(h1.children[1].type).toBe("text");
		expect(h1.children[1].content).toBe("bold");
		expect(h1.children[1].modifiers).toContain("bold");
	});
});

// Tracer bullet 3: parseDocument parses codeBlock
describe("parseDocument - codeBlock", () => {
	it("parses mermaid code block", () => {
		const doc = createDocument("```mermaid\ngraph TD\n  A --> B\n```");

		expect(doc.nodes[0].type).toBe("codeBlock");
		expect((doc.nodes[0] as any).codeBlockType).toBe("mermaid");
		expect((doc.nodes[0] as any).code).toBe("graph TD\n  A --> B");
	});

	it("parses plantuml code block", () => {
		const doc = createDocument("```plantuml\nAlice -> Bob\n```");

		expect(doc.nodes[0].type).toBe("codeBlock");
		expect((doc.nodes[0] as any).codeBlockType).toBe("plantuml");
	});

	it("parses generic code block", () => {
		const doc = createDocument("```\nconst x = 1;\n```");

		expect(doc.nodes[0].type).toBe("codeBlock");
		expect((doc.nodes[0] as any).codeBlockType).toBe("");
	});
});

// Tracer bullet 4: parseDocument parses table
describe("parseDocument - table", () => {
	it("parses table with headers and rows", () => {
		const doc = createDocument(`| Col1 | Col2 |
|------|------|
| A    | B    |
| C    | D    |`);

		expect(doc.nodes[0].type).toBe("table");
		const table = doc.nodes[0] as any;
		expect(table.headers).toEqual(["Col1", "Col2"]);
		expect(table.rows).toHaveLength(2);
		expect(table.rows[0]).toEqual(["A", "B"]);
		expect(table.rows[1]).toEqual(["C", "D"]);
	});
});

// Tracer bullet 5: getByText finds nodes
describe("getByText", () => {
	it("finds text node by content", () => {
		const doc = createDocument("Some unique text here");

		const found = getByText(doc, "unique");
		expect(found).not.toBeNull();
		expect((found as any).content).toBe("unique");
	});

	it("finds heading by text", () => {
		const doc = createDocument("# Target Heading");

		const found = getByText(doc, "Target");
		expect(found).not.toBeNull();
		expect((found as any).type).toBe("heading");
		expect((found as any).text).toBe("Target Heading");
	});

	it("returns null when not found", () => {
		const doc = createDocument("Some text");

		const found = getByText(doc, "nonexistent");
		expect(found).toBeNull();
	});
});

// Tracer bullet 6: getByRole finds headings by level
describe("getByRole", () => {
	it("finds heading by role", () => {
		const doc = createDocument(`# Title

## Section`);

		const found = getByRole(doc, "heading");
		expect(found).not.toBeNull();
		expect((found as any).level).toBe(1);
	});

	it("finds heading by level", () => {
		const doc = createDocument(`# Title

## Section`);

		const found = getByRole(doc, "heading", { level: 2 });
		expect(found).not.toBeNull();
		expect((found as any).level).toBe(2);
		expect((found as any).text).toBe("Section");
	});

	it("returns null for non-heading role", () => {
		const doc = createDocument("Some text");

		const found = getByRole(doc, "paragraph");
		expect(found).toBeNull();
	});
});

// Tracer bullet 7: toHaveChildHeading matcher
describe("toHaveChildHeading", () => {
	it("checks direct child heading exists", () => {
		const doc = createDocument(`# Parent

## Child

### Grandchild`);

		const h1 = doc.nodes[0] as any;
		expect(h1).toHaveChildHeading(); // has direct h2 child
	});

	it("checks child heading by text", () => {
		const doc = createDocument(`# Parent

## Child Heading`);

		const h1 = doc.nodes[0] as any;
		expect(h1).toHaveChildHeading("Child Heading");
	});

	it("checks child heading by level", () => {
		const doc = createDocument(`# Parent

## Child`);

		const h1 = doc.nodes[0] as any;
		expect(h1).toHaveChildHeading({ level: 2 });
	});

	it("fails when no child heading matches", () => {
		const doc = createDocument(`# Parent

Some text`);

		const h1 = doc.nodes[0] as any;
		expect(h1).not.toHaveChildHeading({ level: 2 });
	});
});

// Tracer bullet 8: toHaveDescendantHeading matcher
describe("toHaveDescendantHeading", () => {
	it("checks descendant heading exists (recursive)", () => {
		const doc = createDocument(`# Parent

## Child

### Grandchild`);

		const h1 = doc.nodes[0] as any;
		expect(h1).toHaveDescendantHeading({ level: 3 }); // h3 is grandchild, not direct child
	});

	it("checks descendant heading by text", () => {
		const doc = createDocument(`# Parent

## Child

### Grandchild`);

		const h1 = doc.nodes[0] as any;
		expect(h1).toHaveDescendantHeading("Grandchild");
	});

	it("fails when no descendant heading matches", () => {
		const doc = createDocument(`# Parent

## Child`);

		const h1 = doc.nodes[0] as any;
		expect(h1).not.toHaveDescendantHeading({ level: 4 }); // no h4 exists
	});
});

// Tracer bullet 9: getChildrenOf utility
describe("getChildrenOf", () => {
	it("returns children of a heading", () => {
		const doc = createDocument(`# Title

Some text

## Section`);

		const h1 = doc.nodes[0] as any;
		const children = getChildrenOf(h1);

		expect(children).toHaveLength(2);
		expect(children[0].type).toBe("text");
		expect(children[1].type).toBe("heading");
	});
});
