// Regras de negócio para o status de pendências.
// Verde: 0 a 3 (Baixo) | Amarelo: 4 a 7 (Médio) | Vermelho: 8+ (Crítico)
export function getStatus(count) {
  if (count >= 8) {
    return {
      level: "critico",
      label: "Crítico",
      // borda + fundo leve + texto do badge
      card: "border-red-400 bg-red-50",
      badge: "bg-red-100 text-red-700",
      ring: "ring-red-300",
    };
  }
  if (count >= 4) {
    return {
      level: "medio",
      label: "Médio",
      card: "border-amber-400 bg-amber-50",
      badge: "bg-amber-100 text-amber-700",
      ring: "ring-amber-300",
    };
  }
  return {
    level: "baixo",
    label: "Baixo",
    card: "border-emerald-400 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-300",
  };
}
