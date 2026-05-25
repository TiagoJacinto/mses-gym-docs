// PROTOTYPE - Custom Vitest matchers for parseDocument AST
// This is throwaway code to validate the design. Delete when done.

import { describe, expect, it, expect as vitestExpect } from "vitest";
import type { HeadingNode, Node } from "./parseDocument";

// Matcher extensions
declare module "vitest" {
	interface Assertion {
		toHaveChildHeading(): void;
		toHaveChildHeading(text: string): void;
		toHaveChildHeading(options: { level?: 1 | 2 | 3 | 4 }): void;
		toHaveDescendantHeading(): void;
		toHaveDescendantHeading(text: string): void;
		toHaveDescendantHeading(options: { level?: 1 | 2 | 3 | 4 }): void;
	}
}

function isHeadingNode(node: Node): node is HeadingNode {
	return node.type === "heading";
}

function findChildHeading(
	children: Node[],
	text?: string,
	level?: 1 | 2 | 3 | 4,
): HeadingNode | null {
	for (const node of children) {
		if (!isHeadingNode(node)) continue;
		if (text !== undefined && node.text !== text) continue;
		if (level !== undefined && node.level !== level) continue;
		return node;
	}
	return null;
}

function findDescendantHeading(
	nodes: Node[],
	text?: string,
	level?: 1 | 2 | 3 | 4,
): HeadingNode | null {
	for (const node of nodes) {
		if (!isHeadingNode(node)) continue;
		// First check if this node matches
		if (text !== undefined && node.text !== text) {
			// doesn't match text, check children
		} else if (level !== undefined && node.level !== level) {
			// doesn't match level, check children
		} else {
			// this node matches criteria
			return node;
		}
		// Search children recursively
		const found = findDescendantHeading(node.children, text, level);
		if (found) return found;
	}
	return null;
}

// Register matchers
vitestExpect.extend({
	toHaveChildHeading(
		this: any,
		node: HeadingNode,
		textOrOptions?: string | { level?: 1 | 2 | 3 | 4 },
	) {
		let text: string | undefined;
		let level: 1 | 2 | 3 | 4 | undefined;

		if (typeof textOrOptions === "string") {
			text = textOrOptions;
		} else if (textOrOptions) {
			level = textOrOptions.level;
		}

		const found = findChildHeading(node.children, text, level);

		if (found) {
			return {
				pass: true,
				message: () =>
					`Expected heading not to have child heading matching criteria`,
			};
		} else {
			const criteria = text
				? `text="${text}"`
				: level
					? `level=${level}`
					: "any";
			return {
				pass: false,
				message: () =>
					`Expected heading "${node.text}" to have child heading matching ${criteria}`,
			};
		}
	},

	toHaveDescendantHeading(
		this: any,
		node: HeadingNode,
		textOrOptions?: string | { level?: 1 | 2 | 3 | 4 },
	) {
		let text: string | undefined;
		let level: 1 | 2 | 3 | 4 | undefined;

		if (typeof textOrOptions === "string") {
			text = textOrOptions;
		} else if (textOrOptions) {
			level = textOrOptions.level;
		}

		const found = findDescendantHeading(node.children, text, level);

		if (found) {
			return {
				pass: true,
				message: () =>
					`Expected heading not to have descendant heading matching criteria`,
			};
		} else {
			const criteria = text
				? `text="${text}"`
				: level
					? `level=${level}`
					: "any";
			return {
				pass: false,
				message: () =>
					`Expected heading "${node.text}" to have descendant heading matching ${criteria}`,
			};
		}
	},
});

export function getChildrenOf(node: HeadingNode): Node[] {
	return node.children;
}
