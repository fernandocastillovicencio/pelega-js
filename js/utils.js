// utils.js

// Formata número decimal para ter sempre 2 casas decimais (corrigindo NaN se necessário)
export function formatarNumero(numero) {
  if (isNaN(numero)) return "0.00";
  return Number(numero).toFixed(2);
}
