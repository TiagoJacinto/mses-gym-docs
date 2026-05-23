import { execSync } from "node:child_process";
import fs, { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const mdFile = path.join(process.cwd(), "public/Trabalho-MSES.md");
const diagramsDir = path.join(process.cwd(), "public/diagrams");
const content = fs.readFileSync(mdFile, "utf-8");

if (!existsSync(diagramsDir)) mkdirSync(diagramsDir, { recursive: true });

const regex = /```plantuml\n([\s\S]*?)\n```/g;
let count = 0;
let match;

while ((match = regex.exec(content)) !== null) {
	const pumlFile = `/tmp/diagram_${count}.puml`;
	const svgFile = path.join(diagramsDir, `diagram_${count}.svg`);
	fs.writeFileSync(pumlFile, match[1].trim());

	try {
		execSync(`plantuml -tsvg -o "${diagramsDir}" "${pumlFile}" 2>/dev/null`, {
			stdio: "pipe",
		});
		const generated = path.join(diagramsDir, `diagram_${count}.svg`);
		if (existsSync(generated) && fs.statSync(generated).size > 100) {
			console.log(
				`✓ diagram_${count}.svg (${Math.round(fs.statSync(generated).size / 1024)}KB)`,
			);
		} else {
			console.log(`✗ diagram_${count}.svg failed`);
		}
	} catch (e) {
		console.log(`✗ diagram_${count} error: ${e.message}`);
	}
	count++;
}

console.log(`\n${count} diagram(s) rendered to ${diagramsDir}`);
