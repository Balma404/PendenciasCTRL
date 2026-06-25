export function getStatus(count) {
  if (count >= 8) {
    return {
      level: "critico",
      label: "Crítico",
      card: "border-red-500/60 bg-red-950/40 shadow-red-900/30",
      badge: "bg-red-500/20 text-red-300 border border-red-500/30",
      ring: "ring-red-500/50",
      counter: "text-red-400",
      glow: "shadow-[0_0_30px_rgba(239,68,68,0.15)]",
      dot: "bg-red-400",
    };
  }
  if (count >= 4) {
    return {
      level: "medio",
      label: "Médio",
      card: "border-amber-500/60 bg-amber-950/40 shadow-amber-900/30",
      badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
      ring: "ring-amber-500/50",
      counter: "text-amber-400",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
      dot: "bg-amber-400",
    };
  }
  return {
    level: "baixo",
    label: "Baixo",
    card: "border-emerald-500/60 bg-emerald-950/40 shadow-emerald-900/30",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    ring: "ring-emerald-500/50",
    counter: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    dot: "bg-emerald-400",
  };
}
