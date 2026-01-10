import { ReactNode } from "react";

interface SectionProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
}

export default function Section({ title, icon, children }: SectionProps) {
    return (
        <div className="space-y-3">
            <h3 className="flex items-center gap-3 text-sm font-medium text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                <span className="p-1.5 rounded-lg text-[var(--theme-primary)] bg-[var(--theme-primary)]/10">{icon}</span> {title}
            </h3>
            {children}
        </div>
    );
}
