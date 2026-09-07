export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-slate-400 transition hover:text-slate-700">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
