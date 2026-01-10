interface FieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    textarea?: boolean;
}

export default function Field({ label, value, onChange, textarea }: FieldProps) {
    return (
        <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 uppercase tracking-tight">{label}</label>
            {textarea ? (
                <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[var(--theme-primary)]/10 focus:border-[var(--theme-primary)] outline-none transition-all h-40 leading-relaxed text-sm" />
            ) : (
                <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[var(--theme-primary)]/10 focus:border-[var(--theme-primary)] outline-none transition-all text-sm" />
            )}
        </div>
    );
}
