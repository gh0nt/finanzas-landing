/**
 * Banco de la República (BanRep) / Datos Abiertos Colombia provider.
 *
 * Data sources used:
 *   - USD/EUR: CDN (fxCdn provider)
 *   - UVR: datos.gov.co Socrata API (SFC dataset)
 *   - IBR: datos.gov.co Socrata API (BanRep dataset)
 *
 * On failure, stale: true is set and the UI degrades gracefully.
 */

import type { IndicatorData, IndicatorPoint } from "@/lib/indicators";

/** 12-hour revalidation for daily macro indicators */
export const BANREP_REVALIDATE = 43_200;

const DATOS_BASE = "https://www.datos.gov.co/resource";

// ─────────────────────────────────────────────────────────────────────────────
// UVR  –  Unidad de Valor Real
// Dataset: SFC via datos.gov.co  (field names may vary by dataset version)
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUVR(maxPoints = 90): Promise<IndicatorData> {
  // Try primary datos.gov.co endpoint for UVR
  // Dataset ID "uazr-k2bq" is the SFC UVR dataset on datos.gov.co.
  // If the dataset changes, update this ID in the .env (see README).
  const datasetId = process.env.BANREP_UVR_DATASET ?? "uazr-k2bq";

  try {
    const url =
      `${DATOS_BASE}/${datasetId}.json` +
      `?$limit=${maxPoints}&$order=vigenciadesde%20DESC`;

    const res = await fetch(url, { next: { revalidate: BANREP_REVALIDATE } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: Array<Record<string, string>> = await res.json();
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("Dataset vacío o estructura inesperada");

    // Normalise field names across dataset versions
    const points: IndicatorPoint[] = data
      .map((row) => {
        const rawDate =
          row["vigenciadesde"] ?? row["fecha"] ?? row["date"] ?? "";
        const rawVal = row["valor"] ?? row["uvr"] ?? row["value"] ?? "";
        const v = parseFloat(rawVal.replace(",", "."));
        return { t: toIso(rawDate), v };
      })
      .filter((p) => !isNaN(p.v) && p.t !== "")
      .sort((a, b) => a.t.localeCompare(b.t))
      .slice(-maxPoints);

    const lastUpdated = points.at(-1)?.t ?? new Date().toISOString();
    return {
      indicatorId: "uvr",
      label: "UVR",
      unit: "EUR",
      lastUpdated,
      points,
    };
  } catch (err) {
    return errorResult("uvr", "UVR", "EUR", String(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// IBR O/N  –  Indicador Bancario de Referencia (overnight)
// Dataset: BanRep via datos.gov.co
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchIBR(maxPoints = 90): Promise<IndicatorData> {
  const datasetId = process.env.BANREP_IBR_DATASET ?? "sbx2-7rmk";

  try {
    const url =
      `${DATOS_BASE}/${datasetId}.json` +
      `?$limit=${maxPoints}&$order=fecha%20DESC`;

    const res = await fetch(url, { next: { revalidate: BANREP_REVALIDATE } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: Array<Record<string, string>> = await res.json();
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("Dataset vacío o estructura inesperada");

    const points: IndicatorPoint[] = data
      .map((row) => {
        const rawDate = row["fecha"] ?? row["date"] ?? "";
        const rawVal =
          row["tasa_overnight"] ??
          row["ibr_overnight"] ??
          row["tasa"] ??
          row["value"] ??
          "";
        const v = parseFloat(rawVal.replace(",", "."));
        return { t: toIso(rawDate), v };
      })
      .filter((p) => !isNaN(p.v) && p.t !== "")
      .sort((a, b) => a.t.localeCompare(b.t))
      .slice(-maxPoints);

    const lastUpdated = points.at(-1)?.t ?? new Date().toISOString();
    return {
      indicatorId: "ibr",
      label: "IBR O/N",
      unit: "%",
      lastUpdated,
      points,
    };
  } catch (err) {
    return errorResult("ibr", "IBR O/N", "%", String(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Normalise various date formats to ISO strings */
function toIso(raw: string): string {
  if (!raw) return "";
  // Already ISO or close
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10) + "T00:00:00Z";
  // DD/MM/YYYY
  const ddmm = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (ddmm) return `${ddmm[3]}-${ddmm[2]}-${ddmm[1]}T00:00:00Z`;
  return "";
}

function errorResult(
  indicatorId: string,
  label: string,
  unit: string | null,
  error: string,
): IndicatorData {
  return {
    indicatorId,
    label,
    unit,
    lastUpdated: new Date().toISOString(),
    points: [],
    stale: true,
    error,
  };
}
