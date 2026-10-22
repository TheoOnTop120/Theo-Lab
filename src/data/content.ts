import rawFacts from "./public-facts.json";
import type { Fact, Project } from "./types";

export const facts = rawFacts as Fact[];
export const categories = [...new Set(facts.map((fact) => fact.category))];

export const projects: Project[] = [
  {
    title: "F1 Race Replay",
    category: "Python · données de F1",
    description:
      "Un projet Python autour de la Formule 1, de FastF1 et des données de télémétrie.",
    factIds: [292, 293, 295, 296, 297, 298],
    tags: ["Python", "FastF1", "Arcade", "PySide6"],
  },
  {
    title: "Expérimentations web",
    category: "Développement web",
    description:
      "Des projets personnels explorés avec les outils modernes du web.",
    factIds: [283, 300, 302, 303],
    tags: ["Vite", "React", "Web"],
  },
  {
    title: "IA locale",
    category: "Intelligence artificielle",
    description:
      "Explorer des modèles exécutés sur son propre matériel et leur usage pour coder.",
    factIds: [321, 331, 332, 333, 338, 340, 344],
    tags: ["Ollama", "Modèles locaux", "Code"],
  },
  {
    title: "Serveur personnel",
    category: "Auto-hébergement",
    description:
      "Un terrain d'expérimentation pour les services personnels et l'administration système.",
    factIds: [363, 373, 374, 380, 383, 398, 399, 400],
    tags: ["OpenMediaVault", "Linux", "Services"],
  },
];

export function getFact(id: number): Fact | undefined {
  return facts.find((fact) => fact.id === id);
}

export function getFacts(ids: number[]): Fact[] {
  return ids.flatMap((id) => {
    const fact = getFact(id);
    return fact ? [fact] : [];
  });
}
