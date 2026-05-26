import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
	content: string;
	plantumlSvgPaths: (string | null)[];
}

interface HeadingItem {
	id: string;
	text: string;
	level: number;
}

type DiagramElement = SVGSVGElement | HTMLImageElement;

function FullscreenDialog({
	element,
	onClose,
}: {
	element: DiagramElement;
	onClose: () => void;
}) {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKey);
		dialogRef.current?.focus();
		return () => document.removeEventListener("keydown", handleKey);
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
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<button
				type="button"
				className="diagram-fullscreen-backdrop"
				onClick={handleBackdropClick}
				aria-label="Close dialog"
			/>
			<div className="diagram-fullscreen-content">
				{element.tagName === "svg" ? (
					<svg
						style={{ width: "100%", height: "100%", cursor: "grab" }}
						dangerouslySetInnerHTML={{ __html: element.innerHTML }}
					/>
				) : (
					<img
						src={(element as HTMLImageElement).src}
						alt={(element as HTMLImageElement).alt || "Diagram fullscreen"}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
							cursor: "grab",
						}}
					/>
				)}
			</div>
			<div className="diagram-fullscreen-hint">
				Click or press Escape to exit
			</div>
		</div>
	);
}

// Custom components for react-markdown
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]/g, "")
		.replace(/--+/g, "-")
		.trim();
}

export default function MarkdownRenderer({
	content,
	plantumlSvgPaths,
}: MarkdownRendererProps) {
	const [tocItems, setTocItems] = useState<HeadingItem[]>([]);
	const [fullscreenEl, setFullscreenEl] = useState<
		SVGSVGElement | HTMLImageElement | null
	>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Pre-process: replace plantuml blocks with placeholder divs
	const processedContent = content.replace(
		/```plantuml\n([\s\S]*?)\n```/g,
		(_, code) => {
			const idx = plantumlSvgPaths.findIndex((_, i) => true); // placeholder
			return `<div class="plantuml" data-plantuml-raw="${Buffer.from(code.trim()).toString("base64")}"></div>`;
		},
	);

	useEffect(() => {
		if (!contentRef.current) return;

		const container = contentRef.current;
		const headings = container.querySelectorAll("h2, h3, h4");
		const items: HeadingItem[] = [];

		headings.forEach((h) => {
			if (!h.id) h.id = h.textContent || String(Date.now());
			items.push({
				id: h.id,
				text: h.textContent || "",
				level: h.tagName === "H2" ? 2 : h.tagName === "H3" ? 3 : 4,
			});
		});

		setTocItems(items);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!contentRef.current || typeof window === "undefined") return;

		const initDiagrams = async () => {
			const mermaidModule = await import("mermaid");
			const mermaid = mermaidModule.default;

			mermaid.initialize({
				startOnLoad: false,
				theme: window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "base",
				flowchart: { curve: "basis" },
			});

			const panzoom = (window as unknown as Record<string, unknown>).panzoom;

			const mermaidNodes = contentRef.current!.querySelectorAll(".mermaid");
			for (const [index, node] of Array.from(mermaidNodes).entries()) {
				const code = node.textContent?.trim();
				if (!code) continue;

				try {
					const { svg } = await mermaid.render(`mermaid-${index}`, code);
					const wrapper = document.createElement("div");
					wrapper.className = "mermaid-pan-wrapper";
					wrapper.style.overflow = "hidden";
					wrapper.style.position = "relative";
					node.innerHTML = "";
					node.appendChild(wrapper);
					wrapper.innerHTML = svg;

					const svgEl = wrapper.querySelector("svg");
					if (svgEl && panzoom) {
						(panzoom as Function)(svgEl, {
							maxZoom: 5,
							minZoom: 0.3,
							bounds: true,
							boundsPadding: 0.1,
							zoomDoubleClickSpeed: 1,
						});
						svgEl.style.cursor = "grab";

						let clickCount = 0;
						let clickTimer: ReturnType<typeof setTimeout> | null = null;
						svgEl.addEventListener("click", (e) => {
							clickCount++;
							if (clickCount === 2) {
								e.preventDefault();
								e.stopPropagation();
								const clone = svgEl.cloneNode(true) as SVGSVGElement;
								clone.style.overflow = "visible";
								setFullscreenEl(clone);
							}
							if (clickCount > 2) clickCount = 0;
							if (clickTimer) clearTimeout(clickTimer);
							clickTimer = setTimeout(() => {
								clickCount = 0;
							}, 400);
						});
					}
				} catch (error) {
					const err = error as Error;
					node.innerHTML = `<pre>${err?.message || String(error)}</pre>`;
				}
			}

			const plantumlNodes = contentRef.current!.querySelectorAll(".plantuml");
			plantumlNodes.forEach((node, idx) => {
				const svgPath = plantumlSvgPaths[idx];
				if (!svgPath) return;

				node.innerHTML = "";
				const wrapper = document.createElement("div");
				wrapper.className = "plantuml-pan-wrapper";
				wrapper.style.overflow = "hidden";
				wrapper.style.position = "relative";
				node.appendChild(wrapper);

				const img = document.createElement("img");
				img.src = svgPath;
				img.alt = "PlantUML diagram";
				img.style.maxWidth = "100%";
				img.style.display = "block";
				img.style.margin = "0 auto";
				img.style.cursor = "grab";
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
					img.addEventListener("click", (e) => {
						clickCount++;
						if (clickCount === 2) {
							e.preventDefault();
							e.stopPropagation();
							const clone = img.cloneNode(true) as HTMLImageElement;
							setFullscreenEl(clone);
						}
						if (clickCount > 2) clickCount = 0;
						if (clickTimer) clearTimeout(clickTimer);
						clickTimer = setTimeout(() => {
							clickCount = 0;
						}, 400);
					});
				};
			});
		};

		initDiagrams();
	}, [plantumlSvgPaths]);

	const components: Components = {
		h2({ children }) {
			const id = slugify(String(children));
			return <h2 id={id}>{children}</h2>;
		},
		h3({ children }) {
			const id = slugify(String(children));
			return <h3 id={id}>{children}</h3>;
		},
		h4({ children }) {
			const id = slugify(String(children));
			return <h4 id={id}>{children}</h4>;
		},
		table({ children }) {
			return <table>{children}</table>;
		},
	};

	return (
		<>
			<details id="table-of-contents" open>
				<summary>Índice</summary>
				<ul>
					{tocItems.map((item) => (
						<li key={item.id}>
							<a href={`#${item.id}`}>{item.text}</a>
						</li>
					))}
				</ul>
			</details>

			<article ref={contentRef} id="content" className="markdown-body">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={components}
				>
					{processedContent}
				</ReactMarkdown>
			</article>

			{fullscreenEl && (
				<FullscreenDialog
					element={fullscreenEl}
					onClose={() => setFullscreenEl(null)}
				/>
			)}
		</>
	);
}