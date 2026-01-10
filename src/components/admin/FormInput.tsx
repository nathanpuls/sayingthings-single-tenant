interface FormInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    textarea?: boolean;
    type?: string;
    containerClass?: string;
}

export default function FormInput({ label, value, onChange, placeholder, textarea, containerClass = "" }: FormInputProps) {
    return (
        <div className={containerClass}>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 uppercase tracking-tight">{label}</label>
            {textarea ? (
                <textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white outline-none transition-all h-20 text-sm" />
            ) : (
                <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white outline-none transition-all text-sm" />
            )}
        </div>
    )
}
