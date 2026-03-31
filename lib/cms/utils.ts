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

function normalizeCategoryToken(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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
  const normalized = normalizeCategoryToken(category);

  if (normalized.includes("invers")) {
    return "blue";
  }

  if (normalized.includes("credito")) {
    return "purple";
  }

  if (normalized.includes("seguro")) {
    return "orange";
  }

  return "";
}

export function getGuideCoverTheme(category: string) {
  const normalized = normalizeCategoryToken(category);

  if (normalized.includes("ahorro")) {
    return {
      icon: "savings",
      gradient: "linear-gradient(135deg,#0f766e 0%, #14b8a6 100%)",
    };
  }

  if (normalized.includes("invers")) {
    return {
      icon: "account_balance",
      gradient: "linear-gradient(135deg,#1d4ed8 0%, #4338ca 100%)",
    };
  }

  if (normalized.includes("credito") || normalized.includes("deuda")) {
    return {
      icon: "credit_score",
      gradient: "linear-gradient(135deg,#6d28d9 0%, #7c3aed 100%)",
    };
  }

  if (normalized.includes("seguro")) {
    return {
      icon: "verified_user",
      gradient: "linear-gradient(135deg,#ea580c 0%, #f59e0b 100%)",
    };
  }

  if (normalized.includes("impuesto")) {
    return {
      icon: "receipt_long",
      gradient: "linear-gradient(135deg,#b45309 0%, #f59e0b 100%)",
    };
  }

  if (normalized.includes("pension")) {
    return {
      icon: "account_balance_wallet",
      gradient: "linear-gradient(135deg,#0f766e 0%, #0f766e 45%, #14b8a6 100%)",
    };
  }

  if (normalized.includes("ingreso")) {
    return {
      icon: "payments",
      gradient: "linear-gradient(135deg,#0891b2 0%, #2563eb 100%)",
    };
  }

  if (normalized.includes("empresa")) {
    return {
      icon: "business_center",
      gradient: "linear-gradient(135deg,#1f2937 0%, #334155 100%)",
    };
  }

  if (normalized.includes("econom")) {
    return {
      icon: "language",
      gradient: "linear-gradient(135deg,#1e3a8a 0%, #0f766e 100%)",
    };
  }

  return {
    icon: "menu_book",
    gradient: "linear-gradient(135deg,#1e3a8a 0%, #1d4ed8 100%)",
  };
}

export function resolveGuideCoverTheme(
  category: string,
  coverIcon?: string | null,
  coverGradient?: string | null,
) {
  const defaults = getGuideCoverTheme(category);

  return {
    icon: String(coverIcon ?? "").trim() || defaults.icon,
    gradient: String(coverGradient ?? "").trim() || defaults.gradient,
  };
}
