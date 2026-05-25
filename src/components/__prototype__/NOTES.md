# Prototype Verdict: parseDocument AST + Matchers

**Date**: 2025-05-23

## Question Being Answered
Can we build a `parseDocument` AST for markdown with chained matchers (like testing-library's `expect(node).toHaveChildHeading()`)?

**Answer: YES** — validated via prototype.

## Design Decisions

### AST Node Types

```ts
type Node =
  | { type: 'heading'; level: 1|2|3|4; text: string; children: Node[] }
  | { type: 'text'; content: string; modifiers?: string[] }
  | { type: 'codeBlock'; codeBlockType: string; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'hr' };
```

**Key insight**: Only headings have `children`. All other nodes are leaf nodes. This matches the DOM mental model where headings own their content scope.

### Query Functions

```ts
createDocument(markdown: string): Document

getByText(doc, content): Node | null
getAllByText(doc, content): Node[]
getByRole(doc, 'heading', { level?: 1|2|3|4 }): HeadingNode | null
getAllByRole(doc, 'heading', { level?: 1|2|3|4 }): HeadingNode[]
getByCodeBlock(doc, codeBlockType?: string): CodeBlockNode | null
getByTable(doc): TableNode | null
getChildrenOf(node: HeadingNode): Node[]
```

### Matchers

```ts
// Direct child only (immediate children)
expect(node).toHaveChildHeading()
expect(node).toHaveChildHeading('Title')
expect(node).toHaveChildHeading({ level: 2 })

// Recursive (any depth)
expect(node).toHaveDescendantHeading()
expect(node).toHaveDescendantHeading('Title')
expect(node).toHaveDescendantHeading({ level: 3 })
```

**Matcher rule**: Only works on HeadingNode (nodes with children). Text nodes with no children will fail the matcher.

### Inline Text Model

Free-form modifiers on text nodes — `modifiers?: string[]` allows any string. Could use `'bold'`, `'italic'`, `'code'`, etc.

## What Works

1. **Heading nesting** — parser correctly handles h1 → h2 → h3 nesting with proper child scopes
2. **getByText/getByRole** — query functions work correctly for finding nodes
3. **Matcher chaining** — the matcher API design is valid and intuitive

## Prototype Files

- `src/components/__prototype__/parseDocument.ts` — AST parser + query functions
- `src/components/__prototype__/matchers.ts` — custom Vitest matchers
- `src/components/__prototype__/parseDocument.test.ts` — test suite

## Next Steps

1. **Decide**: Keep prototype as throwaway OR absorb into real implementation
2. **If absorb**: Create `src/lib/parseDocument.ts` and integrate with MarkdownRenderer tests
3. **Test runner issue**: Vitest runner had issues with TypeScript files in bun test — may need to use `.js` extension or configure properly

## Status: DELETE OR ABSORB

Per prototype rules — this is throwaway. Either delete it or capture this verdict and integrate the validated design into real code.