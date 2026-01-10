import { ReactNode } from "react";

interface SectionHeaderProps {
    title: string;
    icon: ReactNode;
}

export default function SectionHeader({ title, icon }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-center gap-3 mb-12">
            <span className="p-3 bg-slate-100 rounded-full text-[var(--theme-primary)] shadow-sm">{icon}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
        </div>
    )
}
