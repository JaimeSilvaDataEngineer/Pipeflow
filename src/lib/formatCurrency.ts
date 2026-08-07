/**
 * Formata valores monetários armazenados em centavos (inteiros).
 * Nunca faça aritmética de ponto flutuante com valores de moeda.
 */
export function formatCurrency(cents: number, locale = "pt-BR", currency = "BRL"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}
