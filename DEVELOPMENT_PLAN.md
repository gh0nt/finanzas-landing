# Finanzas sin Ruido - Development Plan (UI-First Phase)

**Project**: Finanzas sin Ruido  
**Market**: Colombia  
**Phase**: UI + Components + Mock Data + Routing  
**Tech Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui + Radix, Zod  
**Deployment**: Vercel

---

## 1. IMPLEMENTATION PLAN (Phased Approach)

### **Phase 1: Foundation & Setup** (Days 1-2)

- [ ] 1.1 Project initialization with TypeScript + ESLint + Prettier
- [ ] 1.2 TailwindCSS configuration with brand colors
- [ ] 1.3 Install shadcn/ui CLI + base components (Button, Card, Input)
- [ ] 1.4 Create folder structure (app/, components/, lib/, data/, schemas/)
- [ ] 1.5 Configure fonts (local fonts via next/font)
- [ ] 1.6 Setup Zod schemas package structure
- [ ] 1.7 Create mock data directory with TypeScript files
- [ ] 1.8 Setup Playwright for smoke tests

**Rationale for shadcn/ui**: Pre-built accessible components (WCAG 2.1 AA), Radix primitives for keyboard navigation and screen readers (Colombian accessibility law 1618/2013), full Tailwind control, copy-paste approach = no external dependencies bloat, excellent for compliance-heavy UIs.

---

### **Phase 2: Core Layout & Global Components** (Days 3-4)

- [ ] 2.1 Root layout with metadata API
- [ ] 2.2 Navbar component (desktop + mobile, with search placeholder)
- [ ] 2.3 Footer component (legal links + company identity block + 4 columns)
- [ ] 2.4 Colombian compliance components:
  - `DisclaimerBanner` (top bar or modal for first visit)
  - `CompanyIdentityCard` (NIT, legal name, address, regulator info)
  - `UpdatedTimestamp` ("Actualizado hace X minutos")
  - `MethodologyNote` (for comparators)
- [ ] 2.5 CTA components (newsletter signup, contact prompt)
- [ ] 2.6 Loading states + error boundaries

---

### **Phase 3: Corporate & Legal Pages** (Days 5-6)

- [ ] 3.1 Home page (`/`) - hero, value props, featured comparators, blog highlights
- [ ] 3.2 Company page (`/company`) - transparency focus:
  - Legal entity info (NIT, CIIU code if applicable)
  - Team or organizational structure
  - Regulatory compliance statement
  - Values/mission
- [ ] 3.3 Services page (`/services`) - grid of service cards
- [ ] 3.4 Products page (`/products`) - pricing plans with feature comparison
- [ ] 3.5 Legal pages:
  - `/legal/terms` - Terms & Conditions
  - `/legal/privacy` - Privacy Policy (GDPR-inspired + Colombian data law 1581/2012)
  - `/legal/disclaimer` - Financial Disclaimer (investment risks, no personalized advice)
- [ ] 3.6 Contact page (`/contact`) - form with consent checkbox

---

### **Phase 4: Blog & News** (Days 7-9)

- [ ] 4.1 Blog list page (`/blog`) - grid, filters by category
- [ ] 4.2 Blog detail page (`/blog/[slug]`) - article template with related posts
- [ ] 4.3 Optional: Category page (`/blog/category/[slug]`)
- [ ] 4.4 News list page (`/news`) - latest market news
- [ ] 4.5 News detail page (`/news/[slug]`)
- [ ] 4.6 Shared components:
  - `ArticleCard` (blog/news)
  - `AuthorBio`
  - `CategoryBadge`
  - `ShareButtons`
  - `TableOfContents` (for long guides)
- [ ] 4.7 Guides hub (`/guides`) + detail page (`/guides/[slug]`)

---

### **Phase 5: Product Comparators** (Days 10-13)

- [ ] 5.1 Comparators hub page (`/comparators`) - landing with 4 main comparators
- [ ] 5.2 Savings accounts comparator (`/comparators/accounts`):
  - Filter sidebar (bank, interest rate range, minimum balance)
  - Sort controls (rate DESC, fees ASC)
  - Results table with expand/collapse rows
  - Product detail drawer
- [ ] 5.3 Credit cards comparator (`/comparators/cards`)
- [ ] 5.4 Loans comparator (`/comparators/loans`)
- [ ] 5.5 Brokers comparator (`/comparators/brokers`)
- [ ] 5.6 Shared comparator components:
  - `FilterSidebar`
  - `SortControls`
  - `ComparisonTable`
  - `ProductDetailDrawer`
  - `FeatureCheckmark`
  - `ExternalLinkButton` (affiliate link placeholder)
- [ ] 5.7 Mock data: 8-10 products per comparator type

---

### **Phase 6: Markets Dashboard** (Days 14-15)

- [ ] 6.1 Markets page (`/markets`) - widget layout
- [ ] 6.2 Quote cards:
  - Currency pairs (USD/COP, EUR/COP)
  - Stock indices (COLCAP, S&P 500)
  - Commodities (gold, oil)
- [ ] 6.3 Components:
  - `MarketQuoteCard` (price, change %, sparkline placeholder)
  - `MarketSectionHeader` ("Divisas", "Índices", "Commodities")
  - `UpdatedTimestamp` (critical for financial data)
- [ ] 6.4 Mock data with simulated "last updated" timestamps

---

### **Phase 7: Restricted Recommendations UI (Placeholders)** (Day 16)

- [ ] 7.1 Create `/recommendations` route (gated UI)
- [ ] 7.2 Placeholder components:
  - `AuthGate` (shows "Login required" message)
  - `RiskProfileForm` (mock form, not functional)
  - `ConsentManager` (checkboxes for data usage, recording consent)
  - `PersonalizedDashboard` (placeholder cards)
  - `AuditTrailTable` (mock table showing "recommendation history")
- [ ] 7.3 Design clearly distinguishes public vs. restricted areas
- [ ] 7.4 Add banner: "Esta sección requiere perfil de riesgo. Disponible próximamente."

---

### **Phase 8: SEO, Performance & Polish** (Days 17-18)

- [ ] 8.1 Metadata API for all routes (title, description, OG images)
- [ ] 8.2 JSON-LD structured data:
  - Organization schema (company info)
  - Article schema (blog/news)
  - FAQPage schema (if FAQ section added)
- [ ] 8.3 Generate `sitemap.xml` dynamically
- [ ] 8.4 Add `robots.txt`
- [ ] 8.5 Image optimization (next/image for all images)
- [ ] 8.6 Performance audit:
  - Lazy load non-critical components
  - Code splitting for comparator filters
  - Font optimization
- [ ] 8.7 Playwright smoke tests:
  - Home page loads
  - Navigation works
  - Comparator filters render
  - Legal pages load
  - Forms render (no submission logic yet)

---

### **Phase 9: Analytics Stubs & Final Review** (Day 19)

- [ ] 9.1 Create `lib/analytics.ts` with event functions:
  - `trackPageView()`
  - `trackComparatorFilter()`
  - `trackNewsletterSignup()`
  - `trackExternalLinkClick()`
- [ ] 9.2 Add placeholder calls throughout components
- [ ] 9.3 Code review checklist:
  - TypeScript strict mode (no `any`)
  - All forms have consent checkboxes where required
  - Legal links in footer work
  - Company identity displayed in footer
  - Disclaimers present on financial pages
- [ ] 9.4 Deploy to Vercel preview environment

---

## 2. FOLDER STRUCTURE

```
finanzas-app/
├── app/
│   ├── layout.tsx                  # Root layout with Navbar + Footer
│   ├── page.tsx                    # Home page
│   ├── error.tsx                   # Global error boundary
│   ├── not-found.tsx               # 404 page
│   ├── globals.css                 # Tailwind imports + custom CSS
│   │
│   ├── company/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   ├── products/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   │
│   ├── comparators/
│   │   ├── page.tsx                # Comparators hub
│   │   ├── layout.tsx              # Shared comparator layout (breadcrumbs)
│   │   ├── accounts/
│   │   │   └── page.tsx
│   │   ├── cards/
│   │   │   └── page.tsx
│   │   ├── loans/
│   │   │   └── page.tsx
│   │   └── brokers/
│   │       └── page.tsx
│   │
│   ├── markets/
│   │   └── page.tsx
│   │
│   ├── blog/
│   │   ├── page.tsx                # Blog list
│   │   ├── [slug]/
│   │   │   └── page.tsx            # Blog detail (SSG)
│   │   └── category/
│   │       └── [slug]/
│   │           └── page.tsx
│   │
│   ├── news/
│   │   ├── page.tsx                # News list
│   │   └── [slug]/
│   │       └── page.tsx            # News detail (ISR)
│   │
│   ├── guides/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── legal/
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── disclaimer/
│   │       └── page.tsx
│   │
│   ├── recommendations/            # Future: gated section
│   │   └── page.tsx                # Placeholder UI only
│   │
│   ├── sitemap.ts                  # Dynamic sitemap
│   ├── robots.ts                   # robots.txt
│   └── opengraph-image.tsx         # OG image (optional)
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── drawer.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Breadcrumbs.tsx
│   │
│   ├── compliance/
│   │   ├── DisclaimerBanner.tsx
│   │   ├── CompanyIdentityCard.tsx
│   │   ├── UpdatedTimestamp.tsx
│   │   ├── MethodologyNote.tsx
│   │   └── ConsentCheckbox.tsx
│   │
│   ├── cards/
│   │   ├── ServiceCard.tsx
│   │   ├── ProductPlanCard.tsx
│   │   ├── ArticleCard.tsx        # Blog + News
│   │   ├── MarketQuoteCard.tsx
│   │   └── FeatureCard.tsx
│   │
│   ├── comparators/
│   │   ├── FilterSidebar.tsx
│   │   ├── SortControls.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── ProductDetailDrawer.tsx
│   │   └── FeatureCheckmark.tsx
│   │
│   ├── forms/
│   │   ├── NewsletterForm.tsx
│   │   ├── ContactForm.tsx
│   │   └── RiskProfileForm.tsx    # Placeholder
│   │
│   └── content/
│       ├── AuthorBio.tsx
│       ├── CategoryBadge.tsx
│       ├── ShareButtons.tsx
│       ├── TableOfContents.tsx
│       └── RelatedArticles.tsx
│
├── lib/
│   ├── utils.ts                    # cn() + helpers
│   ├── analytics.ts                # Event tracking stubs
│   ├── formatting.ts               # Currency (COP), dates (es-CO), percentages
│   ├── seo.ts                      # Metadata generators, JSON-LD helpers
│   └── constants.ts                # Brand colors, company info
│
├── data/
│   ├── company-identity.ts         # Legal info, NIT, address
│   ├── services.ts                 # Mock services
│   ├── products.ts                 # Mock product plans
│   ├── blog-posts.ts               # Mock blog posts
│   ├── news-articles.ts            # Mock news
│   ├── guides.ts                   # Mock guides
│   ├── comparators/
│   │   ├── accounts.ts
│   │   ├── cards.ts
│   │   ├── loans.ts
│   │   └── brokers.ts
│   └── markets.ts                  # Mock quotes
│
├── schemas/
│   ├── company.ts                  # CompanyIdentity schema
│   ├── content.ts                  # BlogPost, NewsArticle, Author, Category
│   ├── products.ts                 # Service, ProductPackage
│   ├── comparators.ts              # BaseProduct, AccountProduct, etc.
│   ├── markets.ts                  # MarketInstrument, MarketQuote
│   └── recommendations.ts          # RiskProfile, Consent (placeholder)
│
├── styles/
│   └── (optional custom CSS if needed)
│
├── tests/
│   └── smoke.spec.ts               # Playwright smoke tests
│
├── public/
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── .env.local                      # Future: API keys (not used yet)
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── playwright.config.ts
└── package.json
```

---

## 3. COMPLETE ROUTE MAP

| Route                   | Purpose                         | Render Strategy   | SEO Priority |
| ----------------------- | ------------------------------- | ----------------- | ------------ |
| `/`                     | Home page                       | SSG               | High         |
| `/company`              | Company identity & transparency | SSG               | High         |
| `/services`             | Services overview               | SSG               | Medium       |
| `/products`             | Pricing plans                   | SSG               | Medium       |
| `/comparators`          | Comparators hub                 | SSG               | High         |
| `/comparators/accounts` | Savings accounts                | SSG               | High         |
| `/comparators/cards`    | Credit cards                    | SSG               | High         |
| `/comparators/loans`    | Loans                           | SSG               | High         |
| `/comparators/brokers`  | Brokers                         | SSG               | High         |
| `/markets`              | Markets dashboard               | ISR (60s)         | Medium       |
| `/blog`                 | Blog list                       | SSG               | High         |
| `/blog/[slug]`          | Blog detail                     | SSG               | High         |
| `/blog/category/[slug]` | Category archive                | SSG               | Medium       |
| `/news`                 | News list                       | ISR (300s)        | Medium       |
| `/news/[slug]`          | News detail                     | ISR (300s)        | Medium       |
| `/guides`               | Guides hub                      | SSG               | High         |
| `/guides/[slug]`        | Guide detail                    | SSG               | High         |
| `/contact`              | Contact form                    | SSG               | Low          |
| `/legal/terms`          | Terms & Conditions              | SSG               | Medium       |
| `/legal/privacy`        | Privacy Policy                  | SSG               | Medium       |
| `/legal/disclaimer`     | Financial Disclaimer            | SSG               | High         |
| `/recommendations`      | Personalized (gated)            | CSR (placeholder) | No-index     |

**Notes**:

- **SSG** (Static Site Generation): For pages that rarely change (company, legal, blog posts).
- **ISR** (Incremental Static Regeneration): For markets/news (revalidate every X seconds).
- **CSR** (Client-Side Rendering): For restricted sections (future auth).

---

## 4. DATA MODELS (TypeScript + Zod)

### **4.1 Company Identity**

```typescript
// schemas/company.ts
import { z } from "zod";

export const CompanyIdentitySchema = z.object({
  legalName: z.string(),
  tradeName: z.string(),
  country: z.literal("Colombia"),
  nit: z.string(), // Colombian tax ID
  address: z.object({
    street: z.string(),
    city: z.string(),
    department: z.string(),
    postalCode: z.string().optional(),
  }),
  contactChannels: z.object({
    phone: z.string(),
    email: z.string().email(),
    whatsapp: z.string().optional(),
  }),
  regulatoryInfo: z.object({
    regulator: z.string(), // e.g., "Superintendencia Financiera de Colombia"
    registrationNumber: z.string().optional(),
    complianceStatement: z.string(), // e.g., "No somos asesores financieros..."
  }),
  socialMedia: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      facebook: z.string().url().optional(),
    })
    .optional(),
});

export type CompanyIdentity = z.infer<typeof CompanyIdentitySchema>;
```

### **4.2 Services & Products**

```typescript
// schemas/products.ts
import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(), // icon name or path
  features: z.array(z.string()),
  ctaText: z.string(),
  ctaHref: z.string(),
});

export const ProductPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string().optional(),
  price: z.object({
    amount: z.number(),
    currency: z.literal("COP"),
    billingPeriod: z.enum(["monthly", "yearly", "one-time"]),
  }),
  features: z.array(z.string()),
  highlighted: z.boolean().default(false),
  ctaText: z.string(),
  ctaHref: z.string(),
});

export type Service = z.infer<typeof ServiceSchema>;
export type ProductPackage = z.infer<typeof ProductPackageSchema>;
```

### **4.3 Blog & News**

```typescript
// schemas/content.ts
import { z } from "zod";

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  twitter: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(), // Markdown or HTML
  author: AuthorSchema,
  category: CategorySchema,
  tags: z.array(z.string()),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  coverImage: z.string().url().optional(),
  readingTimeMinutes: z.number(),
  featured: z.boolean().default(false),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});

export const NewsArticleSchema = BlogPostSchema.extend({
  source: z.string().optional(), // e.g., "Reuters", "Bloomberg"
  externalUrl: z.string().url().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type NewsArticle = z.infer<typeof NewsArticleSchema>;
```

### **4.4 Comparator Products**

```typescript
// schemas/comparators.ts
import { z } from "zod";

export const BaseComparatorProductSchema = z.object({
  id: z.string(),
  providerName: z.string(), // Bank, fintech, broker name
  providerLogo: z.string().url().optional(),
  productName: z.string(),
  description: z.string(),
  affiliateLink: z.string().url().optional(), // Future: affiliate tracking
  lastUpdated: z.string().datetime(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  rating: z.number().min(0).max(5).optional(), // Internal rating
});

export const AccountProductSchema = BaseComparatorProductSchema.extend({
  type: z.literal("account"),
  accountType: z.enum(["savings", "checking", "high-yield"]),
  interestRate: z.number(), // Annual % (e.g., 4.5)
  minimumBalance: z.number(), // COP
  monthlyFee: z.number(), // COP (0 if free)
  features: z.array(z.string()), // e.g., "Sin cuota de manejo", "Retiros ilimitados"
});

export const CardProductSchema = BaseComparatorProductSchema.extend({
  type: z.literal("card"),
  cardType: z.enum(["credit", "debit"]),
  annualFee: z.number(), // COP
  interestRate: z.number().optional(), // For credit cards
  cashbackRate: z.number().optional(), // % cashback
  benefits: z.array(z.string()),
});

export const LoanProductSchema = BaseComparatorProductSchema.extend({
  type: z.literal("loan"),
  loanType: z.enum(["personal", "home", "car", "business"]),
  minAmount: z.number(), // COP
  maxAmount: z.number(), // COP
  minInterestRate: z.number(), // Annual %
  maxInterestRate: z.number(),
  maxTermMonths: z.number(),
  requirements: z.array(z.string()),
});

export const BrokerProductSchema = BaseComparatorProductSchema.extend({
  type: z.literal("broker"),
  regulated: z.boolean(),
  regulator: z.string().optional(), // e.g., "SFC"
  tradingFee: z.string(), // e.g., "0.1% por operación"
  minimumDeposit: z.number(), // COP
  availableMarkets: z.array(z.string()), // e.g., ["Colombia", "USA", "Europa"]
  platforms: z.array(z.string()), // e.g., ["Web", "iOS", "Android"]
});

export type BaseComparatorProduct = z.infer<typeof BaseComparatorProductSchema>;
export type AccountProduct = z.infer<typeof AccountProductSchema>;
export type CardProduct = z.infer<typeof CardProductSchema>;
export type LoanProduct = z.infer<typeof LoanProductSchema>;
export type BrokerProduct = z.infer<typeof BrokerProductSchema>;
```

### **4.5 Markets**

```typescript
// schemas/markets.ts
import { z } from "zod";

export const MarketInstrumentSchema = z.object({
  id: z.string(),
  symbol: z.string(), // e.g., "USD/COP", "COLCAP", "GLD"
  name: z.string(),
  category: z.enum(["currency", "index", "commodity", "stock"]),
});

export const MarketQuoteSchema = z.object({
  instrument: MarketInstrumentSchema,
  price: z.number(),
  change: z.number(), // Absolute change
  changePercent: z.number(),
  lastUpdated: z.string().datetime(),
  sparklineData: z.array(z.number()).optional(), // 7-day mini chart
});

export type MarketInstrument = z.infer<typeof MarketInstrumentSchema>;
export type MarketQuote = z.infer<typeof MarketQuoteSchema>;
```

### **4.6 Recommendations (Placeholder)**

```typescript
// schemas/recommendations.ts
import { z } from "zod";

export const RiskProfileSchema = z.object({
  userId: z.string(),
  riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
  investmentGoals: z.array(z.string()),
  timeHorizon: z.enum(["short", "medium", "long"]), // <1yr, 1-5yr, 5yr+
  consentGiven: z.boolean(),
  consentDate: z.string().datetime().optional(),
});

export const RecommendationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productType: z.string(),
  productId: z.string(),
  rationale: z.string(),
  createdAt: z.string().datetime(),
  advisorName: z.string().optional(), // Future: human advisor
});

export type RiskProfile = z.infer<typeof RiskProfileSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
```

---

## 5. MOCK DATA STRATEGY

### **5.1 Storage Location**

- Store in `data/` directory as TypeScript files (not JSON).
- Export arrays/objects with proper types.
- Validate with Zod schemas at build time (optional: validate in `next.config.ts`).

### **5.2 Loading Patterns**

**Server Components (default)**:

```typescript
// app/blog/page.tsx
import { blogPosts } from '@/data/blog-posts';

export default function BlogPage() {
  return (
    <div>
      {blogPosts.map(post => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Client Components** (when interactivity needed):

```typescript
// components/comparators/ComparisonTable.tsx
"use client";
import { useState } from "react";
import { accountProducts } from "@/data/comparators/accounts";

export function ComparisonTable() {
  const [filtered, setFiltered] = useState(accountProducts);
  // ... filtering logic
}
```

**API Routes** (for future-proofing):

```typescript
// app/api/products/accounts/route.ts
import { NextResponse } from "next/server";
import { accountProducts } from "@/data/comparators/accounts";

export async function GET() {
  return NextResponse.json(accountProducts);
}
```

_Use this pattern sparingly; prefer direct imports for UI phase._

### **5.3 Swappability for Future APIs**

Create an abstraction layer:

```typescript
// lib/data-loaders.ts
import { blogPosts } from "@/data/blog-posts";

export async function getBlogPosts() {
  // UI phase: return mock data
  return blogPosts;

  // Future: replace with API call
  // const res = await fetch('https://api.example.com/blog');
  // return res.json();
}
```

Use `getBlogPosts()` everywhere instead of direct imports. When APIs are ready, update one file.

---

## 6. COMPONENT BREAKDOWN

### **6.1 Global Layout Components**

**Navbar** (`components/layout/Navbar.tsx`):

- Logo (left)
- Main nav links: Inicio, Comparadores, Mercados, Noticias, Blog, Guías, Nosotros
- Search icon (opens modal or /search page placeholder)
- CTA button: "Contáctanos"
- Mobile: hamburger menu → drawer

**Footer** (`components/layout/Footer.tsx`):

- 4 columns:
  1. **Empresa**: Nosotros, Servicios, Productos, Contacto
  2. **Recursos**: Blog, Noticias, Guías, Comparadores
  3. **Legal**: Términos, Privacidad, **Disclaimer Financiero** (bold + highlighted)
  4. **Identidad Corporativa**: NIT, Legal name, Address, Email, Phone
- Bottom row: Social icons + © 2026 Finanzas sin Ruido
- Disclaimers: "No somos asesores financieros. Consulte un profesional."

**DisclaimerBanner** (`components/compliance/DisclaimerBanner.tsx`):

- Top bar (yellow/green background), dismissible
- Text: "Este sitio ofrece información educativa, no asesoría financiera personalizada."
- Stores dismissal in localStorage (client-side only)

---

### **6.2 Card Components**

**ServiceCard**:

- Icon (SVG or lucide-react icon)
- Title + description
- "Leer más" button

**ProductPlanCard**:

- Badge: "Más popular" (if highlighted)
- Plan name + tagline
- Price: "$XX.XXX COP/mes"
- Feature list (checkmarks)
- CTA button

**ArticleCard** (blog/news):

- Cover image (next/image)
- Category badge + date
- Title + summary
- Author avatar + name
- Reading time

**MarketQuoteCard**:

- Instrument name + symbol
- Current price (large font)
- Change % (green/red with arrow)
- Mini sparkline (optional: use Recharts or CSS)
- "Actualizado hace X min" badge

---

### **6.3 Comparator Components**

**FilterSidebar** (`components/comparators/FilterSidebar.tsx`):

- shadcn/ui Select, Slider, Checkbox components
- Sections: Provider (multi-select), Interest rate (range), Fees (checkboxes)
- "Limpiar filtros" button
- Mobile: opens in drawer

**SortControls**:

- Dropdown: "Ordenar por"
- Options: Interest rate (high to low), Fees (low to high), Rating

**ComparisonTable**:

- shadcn/ui Table component
- Columns: Provider, Product, Interest Rate, Min. Balance, Monthly Fee, Rating
- Row expand button → shows full details
- "Ver detalles" button → opens drawer
- Mobile: card layout instead of table

**ProductDetailDrawer** (`components/comparators/ProductDetailDrawer.tsx`):

- shadcn/ui Sheet component
- Product header: logo + name
- Tabs: Overview, Features, Pros/Cons, Requirements
- "Visitar sitio oficial" button (affiliate link placeholder)
- Disclaimer: "Información sujeta a cambios. Verificar en sitio oficial."

---

### **6.4 Form Components**

**NewsletterForm** (`components/forms/NewsletterForm.tsx`):

- Email input
- Consent checkbox: "Acepto recibir emails según la política de privacidad"
- Submit button
- Success/error messages (toast notifications using shadcn/ui Toast)

**ContactForm**:

- Fields: Name, Email, Subject, Message
- Consent checkbox: "Acepto el tratamiento de mis datos personales (Ley 1581 de 2012)"
- Submit → mock success (no backend yet)

---

### **6.5 Compliance Components**

**CompanyIdentityCard** (`components/compliance/CompanyIdentityCard.tsx`):

- Display in footer or dedicated /company page
- Fields: Legal name, NIT, Address, Contact
- Regulatory statement (bold text)

**UpdatedTimestamp**:

- Format: "Actualizado: 13 feb 2026, 14:35" or "hace 5 minutos"
- Use `date-fns` with es-CO locale
- Props: `timestamp` (ISO string)

**MethodologyNote**:

- Collapsible section in comparators
- Explains how products are selected/ranked
- "Metodología de comparación" heading

**ConsentCheckbox**:

- Reusable checkbox with label
- Props: `label`, `required`, `onChange`
- Validates in parent form

---

## 7. SEO + PERFORMANCE CHECKLIST

### **7.1 Metadata API**

**Root Layout** (`app/layout.tsx`):

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Finanzas sin Ruido - Información Financiera Clara",
    template: "%s | Finanzas sin Ruido",
  },
  description:
    "Comparadores, noticias y educación financiera para Colombia. Información clara, sin ruido.",
  keywords: [
    "finanzas colombia",
    "comparador cuentas",
    "noticias financieras",
    "inversión",
  ],
  authors: [{ name: "Finanzas sin Ruido" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://finanzassinruido.com",
    siteName: "Finanzas sin Ruido",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Finanzas sin Ruido",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@finanzassinruido",
  },
};
```

**Page-Specific Metadata** (`app/blog/[slug]/page.tsx`):

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [post.coverImage],
    },
  };
}
```

---

### **7.2 JSON-LD Structured Data**

**Organization Schema** (add to `app/layout.tsx`):

```typescript
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Finanzas sin Ruido',
  url: 'https://finanzassinruido.com',
  logo: 'https://finanzassinruido.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+57-XXX-XXXXXXX',
    contactType: 'customer service',
    areaServed: 'CO',
    availableLanguage: 'Spanish',
  },
  sameAs: [
    'https://twitter.com/finanzassinruido',
    'https://linkedin.com/company/finanzassinruido',
  ],
};

// In layout.tsx return:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>
```

**Article Schema** (blog detail pages):

```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.summary,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  author: {
    "@type": "Person",
    name: post.author.name,
  },
  publisher: {
    "@type": "Organization",
    name: "Finanzas sin Ruido",
    logo: {
      "@type": "ImageObject",
      url: "https://finanzassinruido.com/logo.png",
    },
  },
};
```

---

### **7.3 Sitemap Generation**

**Dynamic Sitemap** (`app/sitemap.ts`):

```typescript
import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { newsArticles } from "@/data/news-articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://finanzassinruido.com";

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const newsUrls = newsArticles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // ... add all static routes
    ...blogUrls,
    ...newsUrls,
  ];
}
```

---

### **7.4 Robots.txt**

**app/robots.ts**:

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/recommendations/", "/api/"],
      },
    ],
    sitemap: "https://finanzassinruido.com/sitemap.xml",
  };
}
```

---

### **7.5 Rendering Strategies**

| Page Type            | Strategy                        | Rationale                            |
| -------------------- | ------------------------------- | ------------------------------------ |
| Home, Company, Legal | SSG                             | Rarely changes, best Core Web Vitals |
| Comparators          | SSG                             | Product data is mock/static for now  |
| Blog detail          | SSG with `generateStaticParams` | Pre-render all posts                 |
| News detail          | ISR (revalidate: 300)           | Simulate "updated" news              |
| Markets              | ISR (revalidate: 60) or CSR     | Show "last updated" timestamps       |

**Example ISR**:

```typescript
// app/markets/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default function MarketsPage() {
  // ...
}
```

---

### **7.6 Performance Optimizations**

- **Images**: Use `next/image` with `width`, `height`, `alt`, and `priority` (above fold only).
- **Fonts**: Use `next/font` for local fonts (Geist, Inter, or similar).
- **Code Splitting**: Dynamic imports for heavy components:
  ```typescript
  const FilterSidebar = dynamic(() => import('@/components/comparators/FilterSidebar'), {
    loading: () => <Skeleton />,
  });
  ```
- **Lazy Load**: Use React `Suspense` for below-fold content.
- **Bundle Analysis**: Add `@next/bundle-analyzer` in `next.config.ts`.

---

## 8. HTML TO REACT CONVERSION PLAN

### **8.1 Mapping Approach**

1. **Audit Existing HTML**: List all pages + components.
2. **Identify Patterns**: Group similar elements (headers, cards, forms).
3. **Create Component Hierarchy**: Start with layout (Header, Footer), then page-specific components.
4. **Extract Styles**: Move inline styles to Tailwind classes. Use `@apply` for repetitive patterns in `globals.css`.
5. **Dynamic Data**: Replace hardcoded content with props. Use TypeScript interfaces for all props.

### **8.2 Step-by-Step Conversion**

**Example: Converting a Service Card**

**Original HTML**:

```html
<div class="service-card">
  <img src="/icons/service1.svg" alt="Service 1" />
  <h3>Comparadores Inteligentes</h3>
  <p>Compara cuentas, tarjetas y más.</p>
  <a href="/comparators" class="btn">Explorar</a>
</div>
```

**React Component** (`components/cards/ServiceCard.tsx`):

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Service } from '@/schemas/products';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <Image
          src={service.icon}
          alt={service.title}
          width={64}
          height={64}
          className="mb-4"
        />
        <CardTitle className="text-xl">{service.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{service.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={service.ctaHref}>{service.ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

**Usage**:

```typescript
// app/services/page.tsx
import { services } from '@/data/services';
import { ServiceCard } from '@/components/cards/ServiceCard';

export default function ServicesPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

---

### **8.3 Common Pitfalls to Avoid**

1. **Hardcoded Text**: Always extract to props or mock data.
2. **Missing `key` Props**: Add unique keys in lists.
3. **Inline Styles**: Use Tailwind. Only use `style={}` for dynamic values (e.g., progress bars).
4. **Accessibility Issues**:
   - Add `alt` to all images.
   - Use semantic HTML (`<nav>`, `<main>`, `<article>`).
   - Ensure buttons are keyboard-accessible (shadcn/ui handles this).
5. **SEO Mistakes**:
   - Replace `<a href>` with `<Link>` for internal links.
   - Replace `<img>` with `<Image>`.
   - Add metadata to every page.
6. **Client vs. Server Components**:
   - Default to server components.
   - Only add `'use client'` when using hooks (`useState`, `useEffect`) or event handlers (`onClick`).
7. **CSS Classes**: Don't mix custom CSS classes with Tailwind. Stick to Tailwind + shadcn/ui.

---

### **8.4 Reusability Checklist**

When converting HTML to React, ask:

- Can this be reused in 2+ places? → Component.
- Does it have repeated logic? → Custom hook.
- Does it need configuration? → Props with TypeScript interface.
- Does it need styling variants? → Add Tailwind variants or shadcn/ui variants.

---

## 9. TAILWIND CONFIGURATION (Brand Colors)

**tailwind.config.ts**:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3B",
        "dark-grey": "#2E2E2E",
        "sober-green": "#4CAF91",
        // shadcn/ui color system (customize as needed)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0B1F3B", // Navy
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#4CAF91", // Sober green
          foreground: "#FFFFFF",
        },
        // ... rest of shadcn/ui colors
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 10. TESTING STRATEGY (Playwright)

**Why Playwright**: Full-page smoke tests, simulates real user flows, can test SEO elements (meta tags), works well for comparator filtering.

**playwright.config.ts**:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**tests/smoke.spec.ts**:

```typescript
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Finanzas sin Ruido/);
  await expect(page.locator("nav")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

test("comparators page renders filters", async ({ page }) => {
  await page.goto("/comparators/accounts");
  await expect(page.locator("text=Filtrar por")).toBeVisible();
  await expect(page.locator("table")).toBeVisible();
});

test("legal disclaimer link works", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Aviso Legal");
  await expect(page).toHaveURL(/\/legal\/disclaimer/);
  await expect(page.locator("h1")).toContainText("Aviso Legal");
});

test("blog post has structured data", async ({ page }) => {
  await page.goto("/blog/como-elegir-cuenta-ahorros");
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(jsonLd).toContain("Article");
  expect(jsonLd).toContain("headline");
});
```

Run tests:

```bash
npx playwright test
npx playwright show-report
```

---

## 11. ANALYTICS STUBS

**lib/analytics.ts**:

```typescript
// Placeholder analytics library
// Future: replace with Google Analytics 4, Plausible, or custom backend

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

export function trackPageView(url: string) {
  console.log("[Analytics] Page view:", url);
  // Future: window.gtag('event', 'page_view', { page_path: url });
}

export function trackEvent({ name, properties }: AnalyticsEvent) {
  console.log("[Analytics] Event:", name, properties);
  // Future: window.gtag('event', name, properties);
}

export function trackComparatorFilter(filterType: string, value: string) {
  trackEvent({
    name: "comparator_filter",
    properties: { filter_type: filterType, value },
  });
}

export function trackNewsletterSignup(email: string) {
  trackEvent({
    name: "newsletter_signup",
    properties: { email },
  });
}

export function trackExternalLinkClick(url: string, productName: string) {
  trackEvent({
    name: "external_link_click",
    properties: { url, product_name: productName },
  });
}
```

**Usage in component**:

```typescript
'use client';
import { trackExternalLinkClick } from '@/lib/analytics';

export function ProductDetailDrawer({ product }) {
  const handleLinkClick = () => {
    trackExternalLinkClick(product.affiliateLink, product.productName);
  };

  return (
    <Button onClick={handleLinkClick}>
      Visitar sitio oficial
    </Button>
  );
}
```

---

## 12. HTML TO REACT EXTENDED EXAMPLE: NAVBAR

**Original HTML**:

```html
<header class="header">
  <div class="container">
    <a href="/" class="logo">
      <img src="/logo.svg" alt="Finanzas sin Ruido" />
    </a>
    <nav>
      <a href="/">Inicio</a>
      <a href="/comparators">Comparadores</a>
      <a href="/markets">Mercados</a>
      <a href="/news">Noticias</a>
      <a href="/blog">Blog</a>
      <a href="/company">Nosotros</a>
    </nav>
    <button class="search-btn">
      <svg><!-- search icon --></svg>
    </button>
    <a href="/contact" class="cta-btn">Contáctanos</a>
  </div>
</header>
```

**React Component** (`components/layout/Navbar.tsx`):

```typescript
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/comparators', label: 'Comparadores' },
  { href: '/markets', label: 'Mercados' },
  { href: '/news', label: 'Noticias' },
  { href: '/blog', label: 'Blog' },
  { href: '/company', label: 'Nosotros' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Finanzas sin Ruido"
            width={180}
            height={40}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy hover:text-sober-green transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button asChild className="hidden md:flex bg-sober-green hover:bg-sober-green/90">
            <Link href="/contact">Contáctanos</Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu links={navLinks} onClose={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}
```

**MobileMenu Component** (`components/layout/MobileMenu.tsx`):

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  links: Array<{ href: string; label: string }>;
  onClose: () => void;
}

export function MobileMenu({ links, onClose }: MobileMenuProps) {
  return (
    <div className="md:hidden border-t bg-white">
      <nav className="flex flex-col space-y-4 p-4">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-base font-medium text-navy hover:text-sober-green"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
        <Button asChild className="w-full bg-sober-green hover:bg-sober-green/90">
          <Link href="/contact">Contáctanos</Link>
        </Button>
      </nav>
    </div>
  );
}
```

---

## 13. MOCK DATA EXAMPLE

**data/comparators/accounts.ts**:

```typescript
import { AccountProduct } from "@/schemas/comparators";

export const accountProducts: AccountProduct[] = [
  {
    id: "acc-1",
    type: "account",
    providerName: "Banco de Bogotá",
    providerLogo: "/logos/bancobogota.png",
    productName: "Cuenta de Ahorros Digital",
    description: "Cuenta 100% digital sin cuota de manejo.",
    affiliateLink: "https://example.com/bancobogota",
    lastUpdated: "2026-02-13T10:00:00Z",
    pros: ["Sin cuota de manejo", "App móvil excelente", "Retiros ilimitados"],
    cons: ["Requiere saldo mínimo de $500.000", "Tasa de interés baja"],
    rating: 4.2,
    accountType: "savings",
    interestRate: 3.5,
    minimumBalance: 500000,
    monthlyFee: 0,
    features: [
      "Transferencias gratuitas",
      "Débito automático",
      "Banca móvil",
      "Corresponsales bancarios",
    ],
  },
  {
    id: "acc-2",
    type: "account",
    providerName: "Nequi",
    providerLogo: "/logos/nequi.png",
    productName: "Cuenta Nequi",
    description: "Cuenta digital con alta tasa de interés y sin cuota.",
    affiliateLink: "https://example.com/nequi",
    lastUpdated: "2026-02-13T10:00:00Z",
    pros: [
      "Tasa de interés competitiva",
      "Sin saldo mínimo",
      "Retiro en efectivo fácil",
    ],
    cons: ["Límites diarios más bajos", "Sin tarjeta física"],
    rating: 4.6,
    accountType: "high-yield",
    interestRate: 8.5,
    minimumBalance: 0,
    monthlyFee: 0,
    features: [
      "Gana intereses diarios",
      "Colchones (metas de ahorro)",
      "Retiros en cajeros Bancolombia",
      "Transferencias instantáneas",
    ],
  },
  // Add 8-10 more products...
];
```

**data/company-identity.ts**:

```typescript
import { CompanyIdentity } from "@/schemas/company";

export const companyIdentity: CompanyIdentity = {
  legalName: "Finanzas sin Ruido S.A.S.",
  tradeName: "Finanzas sin Ruido",
  country: "Colombia",
  nit: "901.234.567-8",
  address: {
    street: "Calle 100 # 19-61",
    city: "Bogotá",
    department: "Cundinamarca",
    postalCode: "110111",
  },
  contactChannels: {
    phone: "+57 1 234 5678",
    email: "contacto@finanzassinruido.com",
    whatsapp: "+57 300 123 4567",
  },
  regulatoryInfo: {
    regulator: "Superintendencia Financiera de Colombia",
    registrationNumber: undefined, // Not regulated as advisor (informational only)
    complianceStatement:
      "Finanzas sin Ruido NO es una entidad vigilada por la Superintendencia Financiera. " +
      "No ofrecemos asesoría financiera personalizada. Nuestra plataforma proporciona " +
      "información educativa y comparadores de productos financieros. Para recomendaciones " +
      "personalizadas, consulte con un asesor financiero certificado.",
  },
  socialMedia: {
    twitter: "https://twitter.com/finanzassinruido",
    linkedin: "https://linkedin.com/company/finanzassinruido",
    facebook: "https://facebook.com/finanzassinruido",
  },
};
```

---

## 14. SEO HELPER FUNCTIONS

**lib/seo.ts**:

```typescript
import { Metadata } from "next";

export function generateArticleMetadata({
  title,
  description,
  publishedTime,
  modifiedTime,
  author,
  image,
  slug,
  section,
}: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  image?: string;
  slug: string;
  section: string;
}): Metadata {
  const baseUrl = "https://finanzassinruido.com";
  const url = `${baseUrl}/${section}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [author],
      section,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finanzas sin Ruido",
    url: "https://finanzassinruido.com",
    logo: "https://finanzassinruido.com/logo.png",
    description: "Información financiera clara para Colombia",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 100 # 19-61",
      addressLocality: "Bogotá",
      addressRegion: "Cundinamarca",
      postalCode: "110111",
      addressCountry: "CO",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+57-1-234-5678",
      contactType: "customer service",
      email: "contacto@finanzassinruido.com",
      areaServed: "CO",
      availableLanguage: ["Spanish"],
    },
    sameAs: [
      "https://twitter.com/finanzassinruido",
      "https://linkedin.com/company/finanzassinruido",
      "https://facebook.com/finanzassinruido",
    ],
  };
}

export function generateArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: image || "https://finanzassinruido.com/default-og.png",
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Finanzas sin Ruido",
      logo: {
        "@type": "ImageObject",
        url: "https://finanzassinruido.com/logo.png",
      },
    },
  };
}
```

---

## 15. NEXT STEPS CHECKLIST (Start Immediately)

### **Week 1: Setup + Core Layout**

- [ ] **Day 1**: Initialize Next.js project with TypeScript + Tailwind.
  - `npx create-next-app@latest finanzas-app --typescript --tailwind --app --eslint`
  - Install shadcn/ui: `npx shadcn-ui@latest init`
  - Install Zod: `npm install zod`
  - Setup Prettier + ESLint config.
- [ ] **Day 2**: Create folder structure (components, lib, data, schemas).
  - Add Tailwind brand colors to config.
  - Create root layout with basic Navbar + Footer placeholders.
- [ ] **Day 3**: Build Navbar component (desktop + mobile).
  - Install lucide-react for icons.
  - Add shadcn/ui Button, Sheet components.
- [ ] **Day 4**: Build Footer component.
  - Add company identity data.
  - Create CompanyIdentityCard component.
  - Add legal links.
- [ ] **Day 5**: Create DisclaimerBanner + UpdatedTimestamp components.
  - Add to root layout.

### **Week 2: Corporate Pages + Schemas**

- [ ] **Day 6**: Define all Zod schemas (company, content, comparators, markets).
- [ ] **Day 7**: Create mock data for company identity, services, products.
- [ ] **Day 8**: Build Home page with hero + sections.
- [ ] **Day 9**: Build Company, Services, Products pages.
- [ ] **Day 10**: Build all Legal pages (Terms, Privacy, Disclaimer).
  - Add metadata to each page.

### **Week 3: Blog + News**

- [ ] **Day 11**: Create mock blog posts (10 posts).
- [ ] **Day 12**: Build BlogCard component + Blog list page.
- [ ] **Day 13**: Build Blog detail page with metadata + JSON-LD.
- [ ] **Day 14**: Create mock news articles (10 articles).
- [ ] **Day 15**: Build News list + detail pages.
  - Implement ISR with 5-minute revalidation.

### **Week 4: Comparators**

- [ ] **Day 16**: Create mock data for all comparator types (accounts, cards, loans, brokers).
- [ ] **Day 17**: Build Comparators hub page.
- [ ] **Day 18**: Build FilterSidebar + SortControls components.
- [ ] **Day 19**: Build ComparisonTable component.
- [ ] **Day 20**: Build ProductDetailDrawer component.
- [ ] **Day 21**: Complete all 4 comparator pages.

### **Week 5: Markets + Forms + Testing**

- [ ] **Day 22**: Create mock market data.
- [ ] **Day 23**: Build MarketQuoteCard + Markets page.
- [ ] **Day 24**: Build ContactForm + NewsletterForm.
  - Install react-hook-form + zod validation.
- [ ] **Day 25**: Setup Playwright + write smoke tests.
- [ ] **Day 26**: Run tests, fix issues.

### **Week 6: SEO + Analytics + Polish**

- [ ] **Day 27**: Add metadata to all pages.
- [ ] **Day 28**: Add JSON-LD structured data.
- [ ] **Day 29**: Generate sitemap + robots.txt.
- [ ] **Day 30**: Create analytics stub functions.
  - Add tracking calls to key components.
- [ ] **Day 31**: Performance audit (Lighthouse).
  - Optimize images.
  - Add lazy loading.
- [ ] **Day 32**: Deploy to Vercel.
  - Test preview deployment.
  - Configure environment variables (if any).

### **Week 7: Recommendations UI + Review**

- [ ] **Day 33**: Build /recommendations placeholder page.
  - Add AuthGate component.
  - Add "Coming Soon" banner.
- [ ] **Day 34**: Build RiskProfileForm (non-functional, UI only).
- [ ] **Day 35**: Code review.
  - Check TypeScript strict mode compliance.
  - Verify all legal disclaimers present.
  - Test all links.
- [ ] **Day 36**: Final QA.
  - Test on mobile devices.
  - Accessibility audit (Lighthouse, axe DevTools).
- [ ] **Day 37**: Deploy to production.
  - Configure custom domain.
  - Set up monitoring (Vercel Analytics).

---

## 16. KEY COLOMBIAN COMPLIANCE NOTES

### **Legal Requirements**

1. **Company Identity**: Display NIT, legal name, address prominently (footer + /company page).
2. **Data Privacy**: Reference "Ley 1581 de 2012" in Privacy Policy + consent forms.
3. **Financial Disclaimer**: Bold, highly visible warning that you are NOT a regulated financial advisor.
4. **Accessibility**: Follow WCAG 2.1 AA (Ley 1618 de 2013).

### **Best Practices**

- **Language**: Use Colombian Spanish (e.g., "cuenta de ahorros" not "cuenta de banco").
- **Currency**: Always format as "COP" or "$XXX.XXX" (thousand separators are periods).
- **Date Format**: DD/MM/YYYY or "13 de febrero de 2026".
- **Tone**: Professional but approachable. Avoid jargon. Explain financial terms.
- **Transparency**: Show methodology for comparators. Display "Last Updated" timestamps.

---

## 17. DEPLOYMENT (VERCEL)

### **Setup**

1. Connect GitHub repo to Vercel.
2. Configure environment variables (none needed for UI phase).
3. Set up custom domain (e.g., finanzassinruido.com).
4. Enable Vercel Analytics (optional).

### **Build Settings**

- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`

### **Production Checklist**

- [ ] All environment variables set (if any).
- [ ] Custom domain configured + SSL.
- [ ] Sitemap accessible at `/sitemap.xml`.
- [ ] Robots.txt accessible at `/robots.txt`.
- [ ] Lighthouse score: Performance 90+, SEO 100, Accessibility 95+.
- [ ] Test all pages on mobile.
- [ ] Legal pages load correctly.
- [ ] Footer displays company identity.

---

## 18. FUTURE API INTEGRATION NOTES

When connecting to real APIs:

1. **Replace Mock Data Loaders**: Update `lib/data-loaders.ts` to fetch from APIs.
2. **Caching Strategy**: Use Next.js fetch with `revalidate` or React Query for client-side caching.
3. **Error Handling**: Add error boundaries for API failures.
4. **Loading States**: Replace mock instant loads with Suspense + Skeleton loaders.
5. **Authentication**: Add NextAuth.js for /recommendations section.
6. **Rate Limiting**: Implement API rate limits (Redis + Upstash).
7. **Analytics**: Replace stubs with Google Analytics 4 or Plausible.
8. **Forms**: Connect to backend (Next.js API routes + database).
9. **CMS Integration**: Consider Contentful/Sanity for blog/news if needed.
10. **Affiliate Links**: Add UTM parameters + conversion tracking.

---

## 19. TOOLS & LIBRARIES SUMMARY

| Category        | Tool                    | Purpose                          |
| --------------- | ----------------------- | -------------------------------- |
| Framework       | Next.js 15 (App Router) | React meta-framework             |
| Language        | TypeScript              | Type safety                      |
| Styling         | Tailwind CSS            | Utility-first CSS                |
| Components      | shadcn/ui + Radix UI    | Accessible component primitives  |
| Validation      | Zod                     | Schema validation                |
| Icons           | lucide-react            | Icon library                     |
| Forms           | react-hook-form + zod   | Form handling + validation       |
| Testing         | Playwright              | End-to-end testing               |
| Date Formatting | date-fns                | Date manipulation (es-CO locale) |
| Code Quality    | ESLint + Prettier       | Linting + formatting             |
| Deployment      | Vercel                  | Hosting + CI/CD                  |

---

## 20. FINAL RECOMMENDATIONS

### **Architecture Decisions**

- **Use Server Components by default**: Faster initial loads, better SEO.
- **shadcn/ui over custom components**: Saves time, ensures accessibility, easy to customize.
- **Strict TypeScript**: No `any` types. Use Zod for runtime validation.
- **Mock data in TypeScript files**: Easier to type, no JSON parsing issues.
- **ISR for "live" data**: Markets/news get revalidated without rebuilding.

### **Colombian-Specific Tips**

- **Over-communicate legal disclaimers**: Colombian regulators are strict. Make it crystal clear you're not providing personalized advice.
- **Mobile-first**: Colombia has high mobile usage. Test on real devices.
- **WhatsApp integration**: Add WhatsApp contact button (ubiquitous in Colombia).
- **Local payment methods**: When adding e-commerce later, support PSE, Nequi, etc.

### **Avoid These Mistakes**

- Don't mix client/server components incorrectly (causes hydration errors).
- Don't skip accessibility (keyboard nav, ARIA labels).
- Don't hardcode URLs (use `process.env.NEXT_PUBLIC_SITE_URL`).
- Don't forget `alt` tags on images (SEO + accessibility).
- Don't skip mobile testing (use Vercel preview on real devices).

---

## CONCLUSION

This plan provides a complete roadmap for building **Finanzas sin Ruido** as a UI-first, SEO-optimized, Colombian-compliant finance platform. By following the phased approach, you'll have a production-ready interface with mock data, ready to integrate APIs in Phase 2.

**Estimated Timeline**: 6-7 weeks (1 developer, full-time).

**Next Action**: Start with Day 1 of the checklist. Initialize the Next.js project and set up shadcn/ui.

**Questions?** Refer back to this document. Each section is self-contained and can be implemented independently.

---

**Document Version**: 1.0  
**Last Updated**: February 13, 2026  
**Author**: Senior Web Architect + FinTech Web Master
