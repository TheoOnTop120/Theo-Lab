import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "500_infos_sur_theo.md");
const outputPath = path.join(root, "src", "data", "public-facts.json");

const publishedIds = new Set([
  1, 9, 12, 14, 16, 17, 18, 19, 21, 24, 25, 26, 27, 28, 29, 30, 51, 54, 55, 58,
  59, 60, 61, 62, 63, 64, 69, 70, 71, 72, 76, 77, 78, 79, 80, 83, 143, 191, 192,
  193, 194, 196, 211, 216, 217, 220, 221, 224, 229, 161, 162, 231, 235, 236,
  237, 238, 239, 240, 241, 242, 244, 245, 250, 251, 252, 253, 254, 255, 257,
  258, 259, 260, 261, 274, 275, 276, 277, 280, 281, 282, 283, 284, 285, 286,
  287, 288, 290, 291, 292, 293, 295, 296, 297, 298, 300, 301, 302, 303, 311,
  312, 313, 316, 317, 319, 320, 321, 331, 332, 333, 335, 336, 338, 340, 344,
  350, 351, 352, 353, 357, 358, 359, 363, 373, 374, 380, 383, 398, 399, 400,
  412, 416, 421, 424, 425, 483, 484, 485, 486, 487, 491, 492, 493, 494, 495,
  496, 497, 498, 499,
]);

const categoryBySection = new Map([
  ["Identité et contexte", "Repères"],
  ["Préférences de réponse et de travail", "Façon de travailler"],
  ["Ordinateur principal : configuration connue", "Matériel"],
  ["Stockage et partitions", "Stockage"],
  ["Écrans, accessoires et appareils", "Périphériques"],
  ["Jeux : Rocket League", "Jeux vidéo"],
  ["Jeux : Fortnite et performances", "Jeux vidéo"],
  ["Linux et installation multi-système", "Linux"],
  ["Programmation et langages", "Programmation"],
  ["Intelligence artificielle locale", "IA locale"],
  ["Serveur domestique et réseau", "Serveur personnel"],
  ["Windows et activation", "Systèmes"],
  ["Projets et organisation des fichiers", "Organisation numérique"],
  ["Musique, actualité et outils du quotidien", "Outils numériques"],
  ["Synthèse prudente", "En bref"],
]);

const markdown = await readFile(sourcePath, "utf8");
const facts = [];
let section = "";

for (const line of markdown.split(/\r?\n/u)) {
  const heading = line.match(/^##\s+(.+)$/u);
  if (heading) {
    section = heading[1].trim();
    continue;
  }
  const entry = line.match(/^(\d+)\.\s+(.+)$/u);
  if (entry) {
    facts.push({ id: Number(entry[1]), section, text: entry[2].trim() });
  }
}

if (
  facts.length !== 500 ||
  facts.some((fact, index) => fact.id !== index + 1)
) {
  throw new Error(
    `Expected 500 sequential numbered facts; found ${facts.length}.`,
  );
}

const sensitivePattern =
  /(?:\b\d{1,3}(?:\.\d{1,3}){3}\b|(?:[A-Z]:\\|\\\\)|\b\d{1,2}\s?h\b|adresse|domicile|école|scolair|santé|médical|chirurg|poids|mesur|Bastogne|Belgique|Wallonie|duckdns|horaire|coucher|réveil|ANTHROPIC_API_KEY|ANTHROPIC_AUTH_TOKEN)/iu;
const publicFacts = facts
  .filter((fact) => publishedIds.has(fact.id))
  .map((fact) => {
    if (sensitivePattern.test(fact.text)) {
      throw new Error(`Privacy check rejected source entry ${fact.id}.`);
    }
    const category = categoryBySection.get(fact.section);
    if (!category) {
      throw new Error(
        `No public category configured for entry ${fact.id} (${fact.section}).`,
      );
    }
    return { id: fact.id, category, text: fact.text };
  });

if (publicFacts.length !== publishedIds.size) {
  throw new Error(
    "Some explicitly approved public entries were not found in the source.",
  );
}

await writeFile(
  outputPath,
  `${JSON.stringify(publicFacts, null, 2)}\n`,
  "utf8",
);
console.info(
  `Generated ${publicFacts.length} public facts from ${facts.length} source entries.`,
);
