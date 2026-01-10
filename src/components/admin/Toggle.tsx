import { motion } from "framer-motion";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/20 ${checked ? 'bg-[var(--theme-primary)]' : 'bg-slate-200'}`}
        >
            <motion.div
                animate={{ x: checked ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
            />
        </button>
    );
}
