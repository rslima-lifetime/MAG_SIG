import { renderDimensionExpandedCard, renderDimensionSummaryCard } from '../src/components/Cards.js';

try {
  console.log("Testing renderDimensionSummaryCard...");
  const summaryHtml = renderDimensionSummaryCard("Resultado", "Resultados do Negócio", "blue", 90);
  console.log("Summary HTML generated successfully. Length:", summaryHtml.length);

  console.log("Testing renderDimensionExpandedCard...");
  const mockIndicators = [
    { id: 4, nome: "Resultado de vendas", valor: "R$ 28,4 MM", status: "success" },
    { id: 13, nome: "Metas individuais", valor: "92%", status: "success" }
  ];
  const expandedHtml = renderDimensionExpandedCard("Resultado", "Resultados do Negócio", "blue", mockIndicators, 90, true);
  console.log("Expanded HTML generated successfully. Length:", expandedHtml.length);
  
  console.log("ALL TESTS PASSED SUCCESSFULLY!");
} catch (e) {
  console.error("ERROR ENCOUNTERED:");
  console.error(e);
}
