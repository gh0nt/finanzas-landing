# Indicadores de Mercado – Guía de Configuración

## Variables de entorno requeridas

Copia `.env.example` → `.env.local` y rellena los valores:

```env
# Alpha Vantage — obtén tu clave gratuita en https://www.alphavantage.co/support/#api-key
# ⚠️  NUNCA uses el prefijo NEXT_PUBLIC_ con esta clave.
ALPHA_VANTAGE_KEY=TU_CLAVE_AQUI

# (Opcional) Sobreescribe los IDs de dataset de datos.gov.co si cambian
# BANREP_UVR_DATASET=uazr-k2bq
# BANREP_IBR_DATASET=sbx2-7rmk
```

---

## Mapping indicador → fuente → endpoint interno

| Indicador     | Fuente                | Endpoint interno          | Función Alpha Vantage |
| ------------- | --------------------- | ------------------------- | --------------------- |
| TRM (USD/COP) | Alpha Vantage         | `/api/indicators/trm`     | `FX_DAILY`            |
| EUR/COP       | Alpha Vantage         | `/api/fx/eur-cop`         | `FX_DAILY`            |
| GBP/COP       | Alpha Vantage         | `/api/fx/gbp-cop`         | `FX_DAILY`            |
| BRL/COP       | Alpha Vantage         | `/api/fx/brl-cop`         | `FX_DAILY`            |
| Petróleo WTI  | Alpha Vantage         | `/api/commodities/wti`    | `WTI`                 |
| Café          | Alpha Vantage         | `/api/commodities/coffee` | `COFFEE`              |
| Oro (XAU/USD) | Alpha Vantage         | `/api/commodities/gold`   | `FX_DAILY` (XAU/USD)  |
| UVR           | datos.gov.co (SFC)    | `/api/indicators/uvr`     | N/A                   |
| IBR O/N       | datos.gov.co (BanRep) | `/api/indicators/ibr`     | N/A                   |

### Indicadores no disponibles en el plan gratuito

| Indicador         | Motivo                             | Alternativa                                 |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| MSCI COLCAP       | Alpha Vantage no cubre índices BVC | API premium BVC / OpenFinance               |
| Acciones BVC      | BVC no tiene API pública gratuita  | [bvc.com.co](https://www.bvc.com.co) manual |
| Carbón colombiano | No cubierto en Alpha Vantage       | Reuters Eikon / Bloomberg                   |

---

## Límites de tasa (rate limits)

### Alpha Vantage — Plan gratuito

- **25 peticiones / día**
- **5 peticiones / minuto**

| Endpoint                       | `revalidate`   | Peticiones/día (máx) |
| ------------------------------ | -------------- | -------------------- |
| `/api/fx/[pair]` (×4 pares)    | 14 400 s (4 h) | 4 × 6 = **24/día**   |
| `/api/commodities/[commodity]` | 21 600 s (6 h) | 3 × 4 = **12/día**   |
| `/api/indicators/trm`          | 14 400 s (4 h) | **6/día**            |

> **Importante:** Con el plan gratuito, el total de ~42 llamadas estimadas puede superar el límite de 25/día si las cachés expiran y se re-validan en el mismo día. Para producción se recomienda:
>
> 1. Usar `revalidate = 86400` (24 h) como mínimo en desarrollo, o
> 2. Actualizar al plan **Alpha Vantage Premium** (75+ req/min).

### datos.gov.co (BanRep / SFC)

- Sin límite de tasa documentado para el portal Socrata público.
- `revalidate` establecido en 43 200 s (12 h) ya que los datos son diarios.

---

## Esquema de datos unificado

Todos los endpoints internos devuelven el mismo esquema:

```typescript
interface IndicatorData {
  indicatorId: string; // ej: "trm", "eur-cop", "wti"
  label: string; // ej: "TRM (USD/COP)"
  unit: string | null; // ej: "COP", "USD/barril", "%"
  lastUpdated: string; // ISO-8601
  points: Array<{
    t: string; // ISO-8601 timestamp
    v: number; // valor numérico
  }>;
  stale?: boolean; // true si la API falló
  error?: string; // descripción del error (solo si stale)
}
```

---

## Cómo agregar un nuevo indicador

### Paso 1 – Identificar la fuente

Elige entre:

- **Alpha Vantage**: FX (`FX_DAILY`), commodities (`WTI`, `COFFEE`, etc.), acciones globales (`GLOBAL_QUOTE`).
- **datos.gov.co**: Busca el dataset en [datos.gov.co](https://www.datos.gov.co) y anota el ID (formato `xxxx-xxxx`).
- **API propia**: Implementa un nuevo proveedor en `lib/providers/`.

### Paso 2 – Implementar el proveedor

Si usas Alpha Vantage FX, ya está cubierto. Para uno nuevo, crea `lib/providers/miProveedor.ts`:

```typescript
import type { IndicatorData } from "@/lib/indicators";

export async function fetchMiIndicador(): Promise<IndicatorData> {
  try {
    const res = await fetch("https://api.ejemplo.com/datos", {
      next: { revalidate: 14400 },
    });
    // ... parsear y retornar IndicatorData
  } catch (err) {
    return {
      indicatorId: "mi-indicador",
      label: "Mi Indicador",
      unit: null,
      lastUpdated: new Date().toISOString(),
      points: [],
      stale: true,
      error: String(err),
    };
  }
}
```

### Paso 3 – Crear el endpoint API (opcional)

```typescript
// app/api/indicators/mi-indicador/route.ts
import { NextResponse } from "next/server";
import { fetchMiIndicador } from "@/lib/providers/miProveedor";

export const revalidate = 14400;

export async function GET() {
  const data = await fetchMiIndicador();
  return NextResponse.json(data);
}
```

### Paso 4 – Usar en la página

```tsx
// En cualquier Server Component:
import { fetchMiIndicador } from "@/lib/providers/miProveedor";
import { IndicatorCard } from "@/components/charts";

export default async function MiPagina() {
  const data = await fetchMiIndicador();
  return <IndicatorCard data={data} index={0} />;
}
```

---

## Componentes de gráficos disponibles

| Componente          | Uso                                            |
| ------------------- | ---------------------------------------------- |
| `<LineChart>`       | Gráfico SVG de línea genérico (sin cliente JS) |
| `<SparklineWidget>` | Card pequeña con sparkline (página de inicio)  |
| `<IndicatorCard>`   | Card grande con gráfico (página Mercados)      |
| `<FxTable>`         | Tabla de tasas de cambio con sparklines        |
| `<CommodityGrid>`   | Grid de materias primas con sparklines         |
| `<ChartSkeleton>`   | Placeholder de carga (Suspense fallback)       |

---

## Seguridad

- `ALPHA_VANTAGE_KEY` es leída **únicamente server-side** en `lib/providers/alphaVantage.ts`.
- NUNCA usar prefijo `NEXT_PUBLIC_` para esta variable.
- Los endpoints `/api/*` no re-exponen la clave; solo devuelven datos procesados.
- Verificar con: `grep -r "NEXT_PUBLIC_ALPHA" .` debe retornar cero resultados.

---

## Fallback y manejo de errores

- Si la API falla, el campo `stale: true` se activa y `points` queda vacío.
- Los componentes de gráfico muestran "Datos no disponibles" con ícono `cloud_off`.
- El timestamp `lastUpdated` siempre se muestra; si hay error, refleja el momento del intento.
- El SSR nunca se rompe: `Promise.allSettled` garantiza que todos los errores son capturados.
