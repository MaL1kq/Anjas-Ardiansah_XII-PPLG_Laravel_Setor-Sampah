const accentBorder: Record<string, string> = {
  brand: "border-l-brand-500",
  organik: "border-l-organik",
  anorganik: "border-l-anorganik",
  b3: "border-l-b3",
  residu: "border-l-residu",
  gray: "border-l-line",
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
  return (
    <div className={`card p-5 border-l-4 ${accentBorder[accent]}`}>
      <p className="text-xs font-medium text-ink/50 uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl font-semibold text-ink mt-2 font-mono">{value}</p>
      {sub && <p className="text-xs text-ink/50 mt-1.5">{sub}</p>}
    </div>
  );
}
