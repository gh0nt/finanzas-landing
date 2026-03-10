/**
 * CategoryNav
 *
 * Left-column navigation for the comparator page.
 * Selected state is driven by the `selected` prop (controlled by parent).
 */

import type { AssetCategory } from "@/lib/comparator/types";

interface CategoryItem {
  id: AssetCategory;
  label: string;
  icon: string;
  count: number;
}

const CATEGORIES: CategoryItem[] = [
  { id: "energy", label: "Energía", icon: "bolt", count: 4 },
  { id: "metals", label: "Metales", icon: "diamond", count: 3 },
  { id: "agriculture", label: "Agricultura", icon: "grass", count: 4 },
  { id: "fx", label: "Divisas (FX)", icon: "currency_exchange", count: 4 },
  { id: "crypto", label: "Criptoactivos", icon: "currency_bitcoin", count: 5 },
  {
    id: "indicators",
    label: "Indicadores Europa",
    icon: "bar_chart",
    count: 6,
  },
];

interface Props {
  selected: AssetCategory;
  onChange: (cat: AssetCategory) => void;
}

export function CategoryNav({ selected, onChange }: Props) {
  return (
    <nav aria-label="Categorías de activos">
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === selected;
          return (
            <li key={cat.id}>
              <button
                onClick={() => onChange(cat.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: isActive ? "var(--navy)" : "transparent",
                  color: isActive ? "var(--white)" : "var(--navy)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "1.1rem" }}
                  aria-hidden="true"
                >
                  {cat.icon}
                </span>
                <span style={{ flex: 1 }}>{cat.label}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "var(--muted-light)",
                    color: isActive ? "var(--white)" : "var(--muted)",
                    borderRadius: "999px",
                    padding: "0.1rem 0.45rem",
                    fontWeight: 600,
                  }}
                >
                  {cat.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
