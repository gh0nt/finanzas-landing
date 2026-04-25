import creditCards from "./creditcards.json";
import loans from "./loans.json";
import savings from "./savings.json";

export type ComparatorType = "savings" | "cards" | "loans";

export interface ComparatorProduct {
  producto: string;
  banco: string;
  tasa: string;
  beneficio?: string;
  score: number;
  url: string;
}

export type ComparatorProductsByType = Record<
  ComparatorType,
  ComparatorProduct[]
>;

export const COMPARATOR_PRODUCTS: ComparatorProductsByType = {
  savings,
  cards: creditCards,
  loans,
};
