const styles: Record<string, { bg: string; border: string; text: string; sub: string }> = {
  brand: { bg: "bg-white", border: "border-line", text: "text-ink", sub: "text-brand-600" },
  organik: { bg: "bg-brand-50/40", border: "border-brand-200", text: "text-organik", sub: "text-organik" },
  anorganik: { bg: "bg-amber-50/40", border: "border-amber-200", text: "text-anorganik", sub: "text-anorganik/70" },
  b3: { bg: "bg-red-50/40", border: "border-red-200", text: "text-b3", sub: "text-b3/70" },
  residu: { bg: "bg-gray-50/40", border: "border-gray-200", text: "text-residu", sub: "text-residu/70" },
  gray: { bg: "bg-white", border: "border-line", text: "text-ink", sub: "text-ink/50" },
};

export default function StatCard({
  label,
  value,
  sub,
  accent = "gray",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "brand" | "organik" | "anorganik" | "b3" | "residu" | "gray";
}) {
  const s = styles[accent];
  return (
    <div className={`card p-4 ${s.bg} ${s.border !== "border-line" ? s.border : ""}`}>
      <span className={`text-xs font-semibold ${s.text !== "text-ink" ? s.text : "text-ink/60"}`}>
        {label}
      </span>
      <div className={`font-display text-2xl font-bold ${s.text} mt-1`}>{value}</div>
      {sub && <span className={`text-[11px] font-medium ${s.sub} block mt-1`}>{sub}</span>}
    </div>
  );
}
