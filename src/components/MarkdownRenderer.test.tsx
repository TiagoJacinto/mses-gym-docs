import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MarkdownRenderer from './MarkdownRenderer';

// These tests focus on the MarkdownRenderer component's rendering behavior
// Tests that depend on complex side effects (useEffect for diagram rendering)
// are marked as integration tests and skipped for unit testing purposes

describe('MarkdownRenderer', () => {
  describe('basic markdown rendering', () => {
    it('renders h1 heading', async () => {
      render(
        <MarkdownRenderer
          content="# Heading 1"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        const h1 = document.querySelector('h1');
        expect(h1).toBeTruthy();
        expect(h1).toHaveTextContent('Heading 1');
      });
    });

    it('renders bold text with **', async () => {
      render(
        <MarkdownRenderer
          content="This is **bold text** example"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        const boldElement = document.querySelector('strong');
        expect(boldElement).toBeTruthy();
        expect(boldElement).toHaveTextContent('bold text');
      });
    });

    it('renders italic text with *', async () => {
      render(
        <MarkdownRenderer
          content="This is *italic text* example"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        const italicElement = document.querySelector('em');
        expect(italicElement).toBeTruthy();
        expect(italicElement).toHaveTextContent('italic text');
      });
    });

    it('renders inline code with backticks', async () => {
      render(
        <MarkdownRenderer
          content="This is `inline code` example"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        const codeElement = document.querySelector('code');
        expect(codeElement).toBeTruthy();
        expect(codeElement).toHaveTextContent('inline code');
      });
    });

    it('renders links with proper href', async () => {
      render(
        <MarkdownRenderer
          content="Check [this link](https://example.com)"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        const link = document.querySelector('a');
        expect(link).toBeTruthy();
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveTextContent('this link');
      });
    });

    it('renders horizontal rules', async () => {
      render(
        <MarkdownRenderer
          content="Some text\n---\nMore text"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        expect(document.querySelector('hr')).toBeTruthy();
      });
    });
  });

  describe('table rendering', () => {
    it('renders markdown tables as HTML tables', async () => {
      render(
        <MarkdownRenderer
          content="| Header 1 | Header 2 |\n| Cell 1 | Cell 2 |"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        const table = document.querySelector('table');
        expect(table).toBeTruthy();
      });
    });
  });

  describe('component structure', () => {
    it('renders article with id content', async () => {
      render(
        <MarkdownRenderer content="Simple content" plantumlSvgPaths={[]} />
      );

      await waitFor(() => {
        const article = document.getElementById('content');
        expect(article).toBeTruthy();
      });
    });

    it('renders toc details element', async () => {
      render(
        <MarkdownRenderer content="## Section" plantumlSvgPaths={[]} />
      );

      await waitFor(() => {
        const toc = document.getElementById('table-of-contents');
        expect(toc).toBeTruthy();
      });
    });

    it('renders toc with summary label', async () => {
      render(
        <MarkdownRenderer content="## Section" plantumlSvgPaths={[]} />
      );

      await waitFor(() => {
        const summary = document.querySelector('summary');
        expect(summary).toHaveTextContent('Índice');
      });
    });
  });

  describe('empty and edge cases', () => {
    it('handles empty content', async () => {
      render(
        <MarkdownRenderer content="" plantumlSvgPaths={[]} />
      );

      await waitFor(() => {
        const article = document.querySelector('#content');
        expect(article).toBeTruthy();
      });
    });

    it('handles whitespace-only content', async () => {
      render(
        <MarkdownRenderer content="   \n\n   " plantumlSvgPaths={[]} />
      );

      await waitFor(() => {
        const article = document.querySelector('#content');
        expect(article).toBeTruthy();
      });
    });

    it('renders mixed content with headings and text', async () => {
      render(
        <MarkdownRenderer
          content="# Title\n\n**Bold** and *italic* text."
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeTruthy();
        expect(document.querySelector('strong')).toBeTruthy();
        expect(document.querySelector('em')).toBeTruthy();
      });
    });

    it('handles strong emphasis', async () => {
      render(
        <MarkdownRenderer
          content="***very strong***"
          plantumlSvgPaths={[]}
        />
      );

      await waitFor(() => {
        const strong = document.querySelector('strong em');
        expect(strong).toBeTruthy();
      });
    });
  });
});