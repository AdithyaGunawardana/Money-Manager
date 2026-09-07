export default function StatCard({ label, value, colorClass = 'text-gray-900' }) {
  return (
    <div className="surface p-5 shadow-soft">
      <p className="eyebrow">{label}</p>
      <p className={`mt-3 font-display text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  )
}
