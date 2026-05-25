import { readFileSync } from "node:fs";
import { remark } from "remark";
import { visit } from "unist-util-visit";

const FILE_PATH = new URL("../../public/Trabalho-MSES.md", import.meta.url);

interface TreeNode {
	text: string;
	parts: number[];
	mdastDepth: number;
	children: TreeNode[];
}

/** Extract the numeric prefix parts from a heading, e.g. "2.1.3. Foo" → [2,1,3] */
function parseHeadingParts(text: string): number[] {
	const match = text.match(/^([\d.]+)/);
	if (!match) return [];
	return match[1]
		.split(".")
		.filter((p) => p !== "")
		.map(Number);
}

/**
 * Build a heading tree.
 *
 * Hierarchy is determined by:
 * 1. Heading prefix parts when a heading has numbered sections (e.g. "2.1.3. Foo")
 * 2. mdast depth as a fallback for unnumbered headings (e.g. "UC-01 — ...")
 *
 * Within a numbered section, a heading X is a child of heading Y if Y's parts
 * are a proper prefix of X's parts AND Y is the closest such ancestor in the
 * preceding heading sequence.
 */
function buildHeadingTree(
	headings: Array<{ text: string; mdastDepth: number }>,
): TreeNode[] {
	const roots: TreeNode[] = [];
	const stack: TreeNode[] = [];

	for (const h of headings) {
		const parts = parseHeadingParts(h.text);
		const node: TreeNode = {
			text: h.text,
			parts,
			mdastDepth: h.mdastDepth,
			children: [],
		};

		// Pop stack: remove nodes that cannot be the parent of this heading.
		// We stop when we find a node that is a valid parent OR the stack is empty.
		while (stack.length > 0) {
			const top = stack[stack.length - 1];
			if (isParentOf(top, node)) {
				break;
			}
			stack.pop();
		}

		if (stack.length === 0) {
			roots.push(node);
		} else {
			stack[stack.length - 1].children.push(node);
		}
		stack.push(node);
	}

	return roots;
}

/** True if parent could be a logical ancestor of child based on heading structure */
function isParentOf(parent: TreeNode, child: TreeNode): boolean {
	if (parent.parts.length > 0 && child.parts.length > 0) {
		// Case: parent has numbered prefix and child has a numbered prefix.
		// Child is a parent if parent's parts are a proper prefix of child's parts
		// OR child has a single part and is at mdastDepth parent.mdastDepth + 1
		// (handles cases like "3. Stakeholders e Utilizadores" → "1. Atores Principais")
		if (
			child.parts.length > parent.parts.length &&
			child.parts
				.slice(0, parent.parts.length)
				.every((v, i) => v === parent.parts[i])
		) {
			return true;
		}
		if (
			child.parts.length === 1 &&
			child.mdastDepth === parent.mdastDepth + 1
		) {
			return true;
		}
		return false;
	}
	// Case: unnumbered headings — use mdast depth
	if (parent.parts.length === 0 && child.parts.length === 0) {
		return child.mdastDepth === parent.mdastDepth + 1;
	}
	// Mixed: parent has parts, child doesn't (or vice versa) — use mdast depth
	return child.mdastDepth === parent.mdastDepth + 1;
}

function flatten(headings: TreeNode[]): TreeNode[] {
	const result: TreeNode[] = [];
	for (const h of headings) {
		result.push(h);
		result.push(...flatten(h.children));
	}
	return result;
}

function findNode(text: string, nodes: TreeNode[]): TreeNode | undefined {
	for (const n of nodes) {
		if (n.text === text) return n;
		const found = findNode(text, n.children);
		if (found) return found;
	}
	return undefined;
}

function parseDocument() {
	const raw = readFileSync(FILE_PATH, "utf-8");
	const tree = remark.parse(raw) as Root;

	const headings: Array<{ text: string; mdastDepth: number }> = [];
	visit(tree, "heading", (node: Heading) => {
		const text = (node.children ?? [])
			.filter((c): c is { type: "text"; value: string } => c.type === "text")
			.map((c) => c.value)
			.join("");
		headings.push({ text, mdastDepth: node.depth });
	});

	const headingTree = buildHeadingTree(headings);
	return { headingTree, flat: flatten(headingTree) };
}

function headingExists(text: string, flat: TreeNode[]): boolean {
	return flat.some((h) => h.text === text);
}

function hasChildHeading(
	parentText: string,
	childText: string,
	headingTree: TreeNode[],
): boolean {
	const parent = findNode(parentText, headingTree);
	return parent ? parent.children.some((h) => h.text === childText) : false;
}

function getChildrenOf(text: string, headingTree: TreeNode[]): TreeNode[] {
	return findNode(text, headingTree)?.children ?? [];
}

export { getChildrenOf, hasChildHeading, headingExists, parseDocument };
