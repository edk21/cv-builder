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
  {
    id: "tech",
    name: "Tech",
    description: "Optimisé pour les développeurs et profils techniques",
    preview: "/templates/tech.png",
    category: "modern",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophistiqué et autoritaire, idéal pour les cadres et dirigeants",
    preview: "/templates/executive.png",
    category: "classic",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Maximise l'espace pour faire tenir beaucoup d'informations",
    preview: "/templates/compact.png",
    category: "minimal",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Titres imposants et contrastes forts pour ne pas passer inaperçu",
    preview: "/templates/bold.png",
    category: "creative",
  },
  {
    id: "academic",
    name: "Académique",
    description: "Structure formelle mettant en avant la formation et la recherche",
    preview: "/templates/academic.png",
    category: "classic",
  },
];

export const themeColors = [
  { name: "color.blue", value: "#2563eb" },
  { name: "color.indigo", value: "#4f46e5" },
  { name: "color.violet", value: "#7c3aed" },
  { name: "color.pink", value: "#db2777" },
  { name: "color.red", value: "#dc2626" },
  { name: "color.orange", value: "#ea580c" },
  { name: "color.green", value: "#16a34a" },
  { name: "color.teal", value: "#0d9488" },
  { name: "color.cyan", value: "#0891b2" },
  { name: "color.gray", value: "#475569" },
  { name: "color.black", value: "#18181b" },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
