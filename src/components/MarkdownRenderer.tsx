import { useCallback, useEffect, useRef, useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
	content: string;
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

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
	const [tocItems, setTocItems] = useState<HeadingItem[]>([]);
	const [fullscreenEl, setFullscreenEl] = useState<
		SVGSVGElement | HTMLImageElement | null
	>(null);
	const contentRef = useRef<HTMLDivElement>(null);

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

	// astro-mermaid handles mermaid rendering at runtime
	// astro-plantuml outputs server-rendered PNGs — no client-side plantuml handling needed

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
				<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
					{content}
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
