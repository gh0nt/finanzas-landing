export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function estimateReadingMinutes(markdown: string) {
  const words = markdown
    .replace(/[#*_>`~\-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function estimateChapters(markdown: string) {
  const headingMatches = markdown.match(/^##\s+/gm);
  return headingMatches?.length ?? 1;
}

export function extractMarkdownHeadings(markdown: string) {
  const headings = markdown
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, "").trim())
    .filter(Boolean)
    .slice(0, 8);

  return headings.map((label) => ({
    id: slugify(label),
    label,
  }));
}

export function levelToDots(level: string) {
  if (level === "Avanzado") {
    return 3;
  }

  if (level === "Intermedio") {
    return 2;
  }

  return 1;
}

export function categoryToStyle(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("invers")) {
    return "blue";
  }

  if (normalized.includes("cr")) {
    return "purple";
  }

  if (normalized.includes("seguro")) {
    return "orange";
  }

  return "";
}
