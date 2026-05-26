import { execSync, execFileSync } from 'node:child_process';
import fs, { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';

const mdFile = path.join(process.cwd(), 'public/Trabalho-MSES.md');
const diagramsDir = path.join(process.cwd(), 'public/diagrams');
const content = fs.readFileSync(mdFile, 'utf-8');

if (!existsSync(diagramsDir)) mkdirSync(diagramsDir, { recursive: true });

// PlantUML JAR location: prebuild hook downloads to /tmp on Vercel.
const PLANTUML_JAR = '/tmp/plantuml.jar';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close();
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    req.on('error', (e) => {
      file.close();
      reject(e);
    });
    req.setTimeout(30000, () => {
      req.destroy();
      file.close();
      reject(new Error('Download timeout'));
    });
  });
}

async function ensurePlantUML() {
  if (existsSync(PLANTUML_JAR)) return;

  // Try system plantuml first
  try {
    execSync('plantuml -version', { stdio: 'pipe' });
    return;
  } catch {
    // not installed, fall through
  }

  // Download PlantUML JAR
  const version = process.env.PLANTUML_VERSION || '1.2024.2';
  const jarName = `plantuml-${version}.jar`;
  const url = `https://github.com/plantuml/plantuml/releases/download/v${version}/${jarName}`;
  console.log(`Downloading PlantUML ${version}...`);
  await downloadFile(url, PLANTUML_JAR);
  console.log(`PlantUML JAR saved to ${PLANTUML_JAR}`);
}

function runPlantUML(pumlFile, outputDir) {
  const args = ['-jar', PLANTUML_JAR, '-tsvg', '-o', outputDir, pumlFile];
  try {
    execFileSync('java', args, { stdio: 'pipe' });
  } catch {
    // Fallback: try system plantuml
    try {
      execSync(`plantuml -tsvg -o "${outputDir}" "${pumlFile}"`, {
        stdio: 'pipe',
      });
    } catch (e) {
      throw e;
    }
  }
}

async function main() {
  const regex = /```plantuml\n([\s\S]*?)\n```/g;
  let match;

  const plantumlBlocks = [];
  while ((match = regex.exec(content)) !== null) {
    plantumlBlocks.push(match[1].trim());
  }

  // Ensure PlantUML is available (downloads if needed)
  await ensurePlantUML();

  let count = 0;
  for (const block of plantumlBlocks) {
    const pumlFile = `/tmp/diagram_${count}.puml`;
    fs.writeFileSync(pumlFile, block);

    try {
      runPlantUML(pumlFile, diagramsDir);
      const generated = path.join(diagramsDir, `diagram_${count}.svg`);
      if (existsSync(generated) && fs.statSync(generated).size > 100) {
        console.log(
          `✓ diagram_${count}.svg (${Math.round(fs.statSync(generated).size / 1024)}KB)`
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
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
