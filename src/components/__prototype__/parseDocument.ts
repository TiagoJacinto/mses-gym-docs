// PROTOTYPE - parseDocument AST for markdown
// This is throwaway code to validate the design. Delete when done.

export type Node =
	| HeadingNode
	| TextNode
	| CodeBlockNode
	| TableNode
	| ListNode
	| BlockquoteNode
	| HrNode;

export interface HeadingNode {
	type: "heading";
	level: 1 | 2 | 3 | 4;
	text: string;
	children: Node[];
}

export interface TextNode {
	type: "text";
	content: string;
	modifiers?: string[];
}

export interface CodeBlockNode {
	type: "codeBlock";
	codeBlockType: string;
	code: string;
}

export interface TableNode {
	type: "table";
	headers: string[];
	rows: string[][];
}

export interface ListNode {
	type: "list";
	ordered: boolean;
	items: string[];
}

export interface BlockquoteNode {
	type: "blockquote";
	text: string;
}

export interface HrNode {
	type: "hr";
}

// Parse markdown into AST with heading-nesting model
export function parseDocument(markdown: string): Node[] {
	const lines = markdown.split("\n");
	const result: Node[] = [];

	let index = 0;

	function parseUntil(endLevels: number[]): Node[] {
		const children: Node[] = [];

		while (index < lines.length) {
			const line = lines[index];

			// Check if we've hit a heading that ends this block
			const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
			if (headingMatch) {
				const level = headingMatch[1].length;
				// If this heading level is >= any endLevel, stop
				if (level <= Math.max(...endLevels)) {
					break;
				}
				// Otherwise consume this heading and its children
				const text = headingMatch[2].trim();
				index++; // consume the heading line

				const heading: HeadingNode = {
					type: "heading",
					level: level as 1 | 2 | 3 | 4,
					text,
					children: parseUntil([level]), // parse until next heading of same or lower level
				};
				children.push(heading);
				continue;
			}

			// Check for code blocks (```mermaid, ```plantuml, ```...)
			const codeBlockMatch = line.match(/^```(\w*)$/);
			if (codeBlockMatch) {
				const codeBlockType = codeBlockMatch[1] || "fence";
				const codeLines: string[] = [];
				index++; // consume opening fence
				while (index < lines.length && !lines[index].startsWith("```")) {
					codeLines.push(lines[index]);
					index++;
				}
				index++; // consume closing fence

				const codeBlock: CodeBlockNode = {
					type: "codeBlock",
					codeBlockType,
					code: codeLines.join("\n"),
				};
				children.push(codeBlock);
				continue;
			}

			// Check for table rows
			if (line.match(/^\|.*\|$/)) {
				const tableLines: string[] = [];
				while (index < lines.length && lines[index].match(/^\|.*\|$/)) {
					tableLines.push(lines[index]);
					index++;
				}

				const table = parseTable(tableLines);
				children.push(table);
				continue;
			}

			// Check for hr
			if (line.match(/^---+$/)) {
				index++;
				children.push({ type: "hr" });
				continue;
			}

			// Check for blockquote
			const bqMatch = line.match(/^>\s*(.*)$/);
			if (bqMatch) {
				const bqLines: string[] = [bqMatch[1]];
				index++;
				while (index < lines.length && lines[index].startsWith("> ")) {
					bqLines.push(lines[index].slice(2));
					index++;
				}
				children.push({ type: "blockquote", text: bqLines.join(" ") });
				continue;
			}

			// Check for list
			const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
			if (listMatch) {
				const ordered = /^\d+\./.test(listMatch[2]);
				const listItems: string[] = [];
				const indent = listMatch[1].length;

				while (index < lines.length) {
					const currentLine = lines[index];
					const currentMatch = currentLine.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);

					if (!currentMatch) {
						// Check if we're still in the list (indented content)
						if (currentLine.match(/^\s+\S/)) {
							// indented line belongs to previous item
							listItems[listItems.length - 1] += " " + currentLine.trim();
							index++;
							continue;
						}
						break;
					}

					const currentIndent = currentMatch[1].length;
					if (currentIndent < indent) break;

					listItems.push(currentMatch[3]);
					index++;
				}

				children.push({ type: "list", ordered, items: listItems });
				continue;
			}

			// Otherwise it's text content
			if (line.trim()) {
				const textNode = parseInlineText(line.trim());
				children.push(...textNode);
			}
			index++;
		}

		return children;
	}

	result.push(...parseUntil([0]));
	return result;
}

function parseTable(tableLines: string[]): TableNode {
	const rows: string[][] = [];
	let headers: string[] = [];

	for (const line of tableLines) {
		const cells = line
			.split("|")
			.map((c) => c.trim())
			.filter((c) => c.length > 0 && !c.match(/^-+$/));
		if (cells.length === 0) continue;

		if (headers.length === 0) {
			headers = cells;
		} else {
			rows.push(cells);
		}
	}

	return { type: "table", headers, rows };
}

function parseInlineText(text: string): TextNode[] {
	const nodes: TextNode[] = [];

	// Regex to match **bold**, *italic*, `code`, and plain text
	// Order matters: bold before italic, code before anything else
	let match: RegExpExecArray | null = null;
	const regex =
		/(\*\*\*(.+?)\*\*\*)|(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`([^`]+)`)|([^**`*\n]+)/g;
	match = regex.exec(text);

	while (match !== null) {
		if (match[1]) {
			// ***bold italic***
			nodes.push({
				type: "text",
				content: match[2],
				modifiers: ["bold", "italic"],
			});
		} else if (match[3]) {
			// **bold**
			nodes.push({ type: "text", content: match[4], modifiers: ["bold"] });
		} else if (match[5]) {
			// *italic*
			nodes.push({ type: "text", content: match[6], modifiers: ["italic"] });
		} else if (match[7]) {
			// `code`
			nodes.push({ type: "text", content: match[8], modifiers: ["code"] });
		} else if (match[9]) {
			// plain text
			nodes.push({ type: "text", content: match[9] });
		}
	}

	return nodes;
}

// Query functions
export interface Document {
	nodes: Node[];
}

export function createDocument(markdown: string): Document {
	return { nodes: parseDocument(markdown) };
}

export function getByText(doc: Document, content: string): Node | null {
	function search(nodes: Node[]): Node | null {
		for (const node of nodes) {
			if (node.type === "text" && node.content.includes(content)) {
				return node;
			}
			if (node.type === "heading") {
				if (node.text.includes(content)) return node;
				const found = search(node.children);
				if (found) return found;
			}
		}
		return null;
	}
	return search(doc.nodes);
}

export function getAllByText(doc: Document, content: string): Node[] {
	const results: Node[] = [];
	function search(nodes: Node[]): void {
		for (const node of nodes) {
			if (node.type === "text" && node.content.includes(content)) {
				results.push(node);
			}
			if (node.type === "heading") {
				if (node.text.includes(content)) results.push(node);
				search(node.children);
			}
		}
	}
	search(doc.nodes);
	return results;
}

export function getByRole(
	doc: Document,
	role: string,
	options?: { level?: 1 | 2 | 3 | 4 },
): Node | null {
	if (role !== "heading") return null;

	function search(nodes: Node[]): Node | null {
		for (const node of nodes) {
			if (node.type === "heading") {
				if (!options?.level || node.level === options.level) {
					return node;
				}
				const found = search(node.children);
				if (found) return found;
			}
		}
		return null;
	}
	return search(doc.nodes);
}

export function getAllByRole(
	doc: Document,
	role: string,
	options?: { level?: 1 | 2 | 3 | 4 },
): HeadingNode[] {
	if (role !== "heading") return [];

	const results: HeadingNode[] = [];
	function search(nodes: Node[]): void {
		for (const node of nodes) {
			if (node.type === "heading") {
				if (!options?.level || node.level === options.level) {
					results.push(node);
				}
				search(node.children);
			}
		}
	}
	search(doc.nodes);
	return results;
}

export function getByCodeBlock(
	doc: Document,
	codeBlockType?: string,
): CodeBlockNode | null {
	function search(nodes: Node[]): CodeBlockNode | null {
		for (const node of nodes) {
			if (node.type === "codeBlock") {
				if (!codeBlockType || node.codeBlockType === codeBlockType) {
					return node;
				}
			}
			if (node.type === "heading") {
				const found = search(node.children);
				if (found) return found;
			}
		}
		return null;
	}
	return search(doc.nodes);
}

export function getByTable(doc: Document): TableNode | null {
	function search(nodes: Node[]): TableNode | null {
		for (const node of nodes) {
			if (node.type === "table") return node;
			if (node.type === "heading") {
				const found = search(node.children);
				if (found) return found;
			}
		}
		return null;
	}
	return search(doc.nodes);
}

export function getChildrenOf(node: HeadingNode): Node[] {
	return node.children;
}
