import { Mic } from "lucide-react";
import FadeInSection from "../FadeInSection";
import SectionHeader from "./SectionHeader";

interface StudioSectionProps {
    studioGear: any[];
    basePadding?: string;
}

export default function StudioSection({ studioGear, basePadding = "py-6 md:py-10" }: StudioSectionProps) {
    return (
        <section key="studio" id="studio" className={`${basePadding} px-6 scroll-mt-28`}>
            <FadeInSection className="container mx-auto">
                <SectionHeader title="Studio" icon={<Mic />} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {studioGear.map((item) => (
                        <div key={item.id} className="glass-card rounded-xl p-6 flex flex-col items-center gap-4 text-center group bg-white shadow-sm hover:shadow-md transition-all border border-slate-100">
                            <div className="h-32 flex items-center justify-center p-2">
                                <img src={item.url} alt={item.name} className="max-h-full max-w-full object-contain filter transition group-hover:scale-105" />
                            </div>
                            <h3 className="font-semibold text-slate-800">{item.name}</h3>
                        </div>
                    ))}
                </div>
            </FadeInSection>
        </section>
    );
}
