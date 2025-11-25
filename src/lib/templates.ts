import { Template } from "@/types/cv";

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Un design épuré et contemporain avec une mise en page à deux colonnes",
    preview: "/templates/modern.png",
    category: "modern",
  },
  {
    id: "classic",
    name: "Classique",
    description: "Un style traditionnel et professionnel, parfait pour les secteurs conservateurs",
    preview: "/templates/classic.png",
    category: "classic",
  },
  {
    id: "minimal",
    name: "Minimaliste",
    description: "Un design simple et élégant qui met l'accent sur le contenu",
    preview: "/templates/minimal.png",
    category: "minimal",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Un style audacieux et original pour les profils créatifs",
    preview: "/templates/creative.png",
    category: "creative",
  },
];

export const themeColors = [
  { name: "Bleu", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#db2777" },
  { name: "Rouge", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Vert", value: "#16a34a" },
  { name: "Teal", value: "#0d9488" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Gris", value: "#475569" },
  { name: "Noir", value: "#18181b" },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

