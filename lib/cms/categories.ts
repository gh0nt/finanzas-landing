export const STANDARD_GUIDE_CATEGORIES = [
  "Ahorro",
  "Inversión",
  "Crédito",
  "Seguros",
  "Impuestos",
  "Pensiones",
  "Deuda",
  "Ingresos",
  "Finanzas empresariales",
  "Economía global",
  "Otros",
] as const;

const CATEGORY_SET = new Set<string>(STANDARD_GUIDE_CATEGORIES);

export function normalizeGuideCategory(value: unknown) {
  const category = String(value ?? "").trim();

  if (!category) {
    return "Otros";
  }

  return CATEGORY_SET.has(category) ? category : "Otros";
}
