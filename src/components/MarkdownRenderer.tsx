import { useState, useEffect, useRef, useCallback } from 'react';

interface MarkdownRendererProps {
  content: string;
  plantumlSvgPaths: (string | null)[];
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseMarkdown(md: string): { html: string; mermaidCount: number; plantumlCount: number } {
  let html = md;
  let mermaidCount = 0;
  let plantumlCount = 0;

  html = html.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    mermaidCount++;
    return `<div class="mermaid">${escapeHtml(code.trim())}</div>`;
  });

  html = html.replace(/```plantuml\n([\s\S]*?)```/g, (_, code) => {
    const idx = plantumlCount;
    plantumlCount++;
    return `<div class="plantuml" data-plantuml-index="${idx}"></div>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^#### (.+)$/gm, '<h4 id="$1">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const lines = html.split('\n');
  const resultLines: string[] = [];
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];

    if (line.match(/^\|.*\|$/)) {
      const tableLines: string[] = [];

      while (lineIndex < lines.length && lines[lineIndex].match(/^\|.*\|$/)) {
        tableLines.push(lines[lineIndex]);
        lineIndex++;
      }

      if (tableLines.length > 0) {
        const rows: string[] = [];
        let headerProcessed = false;

        for (const tableLine of tableLines) {
          const cells = tableLine.split('|').map(c => c.trim()).filter(c => c.length > 0 && !c.match(/^-+$/));
          if (cells.length === 0) continue;

          const tag = headerProcessed ? 'td' : 'th';
          const rowHtml = '<tr>' + cells.map(c => `<${tag} style="border: 1px solid #333;">${c}</${tag}>`).join('') + '</tr>';
          rows.push(rowHtml);
          headerProcessed = true;
        }

        if (rows.length > 0) {
          resultLines.push('<table style="border-collapse: collapse;"><tbody>' + rows.join('') + '</tbody></table>');
        }
      }
    } else {
      resultLines.push(line);
      lineIndex++;
    }
  }

  html = resultLines.join('\n');

  const allLines = html.split('\n');
  const result: string[] = [];
  let inBlock = false;
  const blockTags = ['<pre>', '<table>', '<ul>', '<ol>', '<h', '<hr', '<div'];

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    const trimmed = line.trim();

    if (!trimmed) { result.push(''); inBlock = false; continue; }

    const isBlockStart = blockTags.some(t => trimmed.startsWith(t));
    const isBlockEnd = trimmed.startsWith('</');

    if (isBlockStart || inBlock) {
      inBlock = true;
      result.push(line);
      if (isBlockEnd && !trimmed.startsWith('<div')) inBlock = false;
      continue;
    }

    if (trimmed.match(/^<(h[1-4]|p|table|ul|ol|li|blockquote|pre|div|hr)/)) {
      result.push(line);
    } else if (trimmed) {
      result.push(`<p>${line}</p>`);
    }
  }

  return { html: result.join('\n'), mermaidCount, plantumlCount };
}

type DiagramElement = SVGSVGElement | HTMLImageElement;

function FullscreenDialog({ element, onClose }: { element: DiagramElement; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      className="diagram-fullscreen"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <button type="button" className="diagram-fullscreen-backdrop" onClick={handleBackdropClick} aria-label="Close dialog" />
      <div className="diagram-fullscreen-content">
        {element.tagName === 'svg' ? (
          <svg style={{ width: '100%', height: '100%', cursor: 'grab' }} dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
        ) : (
          <img src={(element as HTMLImageElement).src} alt={(element as HTMLImageElement).alt || 'Diagram fullscreen'} style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'grab' }} />
        )}
      </div>
      <div className="diagram-fullscreen-hint">Click or press Escape to exit</div>
    </div>
  );
}

export default function MarkdownRenderer({ content, plantumlSvgPaths }: MarkdownRendererProps) {
  const [parsedHtml, setParsedHtml] = useState('');
  const [tocItems, setTocItems] = useState<HeadingItem[]>([]);
  const [fullscreenEl, setFullscreenEl] = useState<SVGSVGElement | HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { html } = parseMarkdown(content);
    setParsedHtml(html);
  }, [content]);

  useEffect(() => {
    if (!contentRef.current) return;

    const container = contentRef.current;
    const headings = container.querySelectorAll('h2, h3, h4');
    const items: HeadingItem[] = [];

    headings.forEach((h) => {
      if (!h.id) h.id = h.textContent || String(Date.now());
      items.push({ id: h.id, text: h.textContent || '', level: h.tagName === 'H2' ? 2 : h.tagName === 'H3' ? 3 : 4 });
    });

    setTocItems(items);
  }, []);

  useEffect(() => {
    if (!contentRef.current || typeof window === 'undefined') return;

    const initDiagrams = async () => {
      const mermaidModule = await import('mermaid');
      const mermaid = mermaidModule.default;

      mermaid.initialize({
        startOnLoad: false,
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'base',
        flowchart: { curve: 'basis' }
      });

      const panzoom = (window as unknown as Record<string, unknown>).panzoom;

      const mermaidNodes = contentRef.current!.querySelectorAll('.mermaid');
      for (const [index, node] of Array.from(mermaidNodes).entries()) {
        const code = node.textContent?.trim();
        if (!code) continue;

        try {
          const { svg } = await mermaid.render(`mermaid-${index}`, code);
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-pan-wrapper';
          wrapper.style.overflow = 'hidden';
          wrapper.style.position = 'relative';
          node.innerHTML = '';
          node.appendChild(wrapper);
          wrapper.innerHTML = svg;

          const svgEl = wrapper.querySelector('svg');
          if (svgEl && panzoom) {
            (panzoom as Function)(svgEl, {
              maxZoom: 5,
              minZoom: 0.3,
              bounds: true,
              boundsPadding: 0.1,
              zoomDoubleClickSpeed: 1,
            });
            svgEl.style.cursor = 'grab';

            let clickCount = 0;
            let clickTimer: ReturnType<typeof setTimeout> | null = null;
            svgEl.addEventListener('click', (e) => {
              clickCount++;
              if (clickCount === 2) {
                e.preventDefault();
                e.stopPropagation();
                const clone = svgEl.cloneNode(true) as SVGSVGElement;
                clone.style.overflow = 'visible';
                setFullscreenEl(clone);
              }
              if (clickCount > 2) clickCount = 0;
              if (clickTimer) clearTimeout(clickTimer);
              clickTimer = setTimeout(() => { clickCount = 0; }, 400);
            });
          }
        } catch (error) {
          const err = error as Error;
          node.innerHTML = `<pre>${escapeHtml(err?.message || String(error))}</pre>`;
        }
      }

      const plantumlNodes = contentRef.current!.querySelectorAll('.plantuml');
      plantumlNodes.forEach((node) => {
        const idx = parseInt(node.getAttribute('data-plantuml-index') || '0', 10);
        const svgPath = plantumlSvgPaths[idx];
        if (!svgPath) return;

        node.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'plantuml-pan-wrapper';
        wrapper.style.overflow = 'hidden';
        wrapper.style.position = 'relative';
        node.appendChild(wrapper);

        const img = document.createElement('img');
        img.src = svgPath;
        img.alt = 'PlantUML diagram';
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        img.style.cursor = 'grab';
        wrapper.appendChild(img);

        img.onload = () => {
          if (panzoom) {
            (panzoom as Function)(img, {
              maxZoom: 5,
              minZoom: 0.3,
              bounds: true,
              boundsPadding: 0.1,
              zoomDoubleClickSpeed: 1,
            });
          }

          let clickCount = 0;
          let clickTimer: ReturnType<typeof setTimeout> | null = null;
          img.addEventListener('click', (e) => {
            clickCount++;
            if (clickCount === 2) {
              e.preventDefault();
              e.stopPropagation();
              const clone = img.cloneNode(true) as HTMLImageElement;
              setFullscreenEl(clone);
            }
            if (clickCount > 2) clickCount = 0;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 400);
          });
        };
      });
    };

    initDiagrams();
  }, [plantumlSvgPaths]);

  return (
    <>
      <details id="table-of-contents" open>
        <summary>Índice</summary>
        <ul>
          {tocItems.map(item => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ul>
      </details>

      <article ref={contentRef} id="content" dangerouslySetInnerHTML={{ __html: parsedHtml }} />

      {fullscreenEl && (
        <FullscreenDialog element={fullscreenEl} onClose={() => setFullscreenEl(null)} />
      )}
    </>
  );
}