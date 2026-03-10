import type { MetadataRoute } from "next";

const BASE_URL = "https://www.finanzassinruido.co";

// ── Blog posts ─────────────────────────────────────────
const blogSlugs = [
  "como-afectara-la-inflacion-sus-inversiones-2025",
  "10-trucos-para-ahorrar-mas",
  "como-mejorar-historial-crediticio",
  "fintechs-colombianas-ronda-inversion",
  "dolar-baja-momento-comprar",
  "nuevas-regulaciones-billeteras-digitales",
  "cdts-mejor-rentabilidad-2025",
];

// ── Educational guides ─────────────────────────────────
const guideSlugs = [
  "guia-completa-cuentas-de-ahorro-colombia",
  "como-funcionan-los-cdts",
  "solicitar-credito-hipotecario-colombia",
  "seguros-indispensables-familia-colombia",
  "declarar-renta-empleado-colombia",
  "invertir-acciones-bvc-principiantes",
  "pensiones-en-colombia-todo-lo-que-debe-saber",
];

// ── Service detail pages ───────────────────────────────
const serviceSlugs = [
  "cdts",
  "fics",
  "acciones",
  "pensiones",
  "crowdfunding",
  "crypto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    // Core pages — high priority, updated frequently
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/markets`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Comparators
    {
      url: `${BASE_URL}/comparators`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/comparators/accounts`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/comparators/cards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/comparators/loans`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/comparators/brokers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    // Info pages
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/company`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Legal — low priority, rarely change
    {
      url: `${BASE_URL}/legal/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...blogRoutes, ...guideRoutes, ...serviceRoutes];
}
