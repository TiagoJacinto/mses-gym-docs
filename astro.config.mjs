import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";
import plantuml from "astro-plantuml";

const markdownFiles = [
	"public/Trabalho-MSES.md",
	"public/Perguntas-Fundamentais.md",
];

export default defineConfig({
	integrations: [
		mdx(),
		react(),
		mermaid({
			theme: "base",
			autoTheme: true,
			enableLog: true,
			mermaidConfig: {
				flowchart: { curve: "basis" },
			},
		}),
		plantuml(),
	],
	output: "static",
	adapter: vercel(),
	markdown: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
	vite: {
		plugins: [
			{
				name: "watch-markdown",
				configureServer(server) {
					for (const file of markdownFiles) {
						server.watcher.add(file);
					}
					server.watcher.on("change", (file) => {
						if (file.endsWith(".md")) {
							server.ws.send({ type: "full-reload" });
						}
					});
				},
			},
		],
	},
});
