import { Users } from "lucide-react";
import FadeInSection from "../FadeInSection";
import SectionHeader from "./SectionHeader";

interface ClientsSectionProps {
    clients: any[];
    siteContent: any;
    basePadding?: string;
}

export default function ClientsSection({ clients, siteContent, basePadding = "py-6 md:py-10" }: ClientsSectionProps) {
    return (
        <section key="clients" id="clients" className={`${basePadding} px-6 scroll-mt-28`}>
            <FadeInSection className="container mx-auto">
                <SectionHeader title="Clients" icon={<Users />} />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto items-center">
                    {clients.map((client) => (
                        <div key={client.id} className="bg-white rounded-lg p-4 h-24 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-md border border-slate-100">
                            <img
                                src={client.url}
                                alt="Client Logo"
                                className={`max-h-full max-w-full object-contain transition-all ${siteContent.clientsGrayscale
                                    ? "grayscale hover:grayscale-0 opacity-80 hover:opacity-100"
                                    : "grayscale-0 opacity-100"
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            </FadeInSection>
        </section>
    );
}
