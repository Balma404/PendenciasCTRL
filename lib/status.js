export function getStatus(count) {
  if (count <= 0) {
    return {
      level: "zerado",
      label: "Zerado",
      card: "border-sky-500 bg-sky-950/40",
      badge: "bg-sky-500/20 text-sky-300 border border-sky-500/40",
      ring: "ring-sky-500",
      counter: "text-sky-400",
      glow: "shadow-[0_0_35px_rgba(14,165,233,0.4)]",
      dot: "bg-sky-400",
    };
  }
  if (count >= 8) {
    return {
      level: "critico",
      label: "Crítico",
      card: "border-red-500 bg-red-950/40",
      badge: "bg-red-500/20 text-red-300 border border-red-500/40",
      ring: "ring-red-500",
      counter: "text-red-400",
      glow: "shadow-[0_0_35px_rgba(239,68,68,0.4)]",
      dot: "bg-red-400",
    };
  }
  if (count >= 4) {
    return {
      level: "medio",
      label: "Médio",
      card: "border-amber-400 bg-amber-950/40",
      badge: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
      ring: "ring-amber-400",
      counter: "text-amber-400",
      glow: "shadow-[0_0_35px_rgba(245,158,11,0.4)]",
      dot: "bg-amber-400",
    };
  }
  return {
    level: "baixo",
    label: "Baixo",
    card: "border-emerald-500 bg-emerald-950/40",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
    ring: "ring-emerald-500",
    counter: "text-emerald-400",
    glow: "shadow-[0_0_35px_rgba(16,185,129,0.4)]",
    dot: "bg-emerald-400",
  };
}
