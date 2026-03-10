/**
 * MarketWidgets
 *
 * Renders the three European market indicator cards on the home page.
 * Delegates to EuropeanIndicatorsWidget (Client Component) which polls
 * /api/indicators/european every 60 seconds and shows a refresh indicator.
 */

export { EuropeanIndicatorsWidget as MarketWidgets } from "@/components/charts/EuropeanIndicatorsWidget";
