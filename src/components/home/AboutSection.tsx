import { User } from "lucide-react";
import FadeInSection from "../FadeInSection";
import SectionHeader from "./SectionHeader";

interface AboutSectionProps {
    siteContent: any;
    basePadding?: string;
}

export default function AboutSection({ siteContent, basePadding = "py-6 md:py-10" }: AboutSectionProps) {
    return (
        <section key="about" id="about" className={`${basePadding} px-6 scroll-mt-28`}>
            <FadeInSection className="container mx-auto max-w-4xl">
                <SectionHeader title="About" icon={<User />} />
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <img src={siteContent.profileImage} alt={siteContent.siteName} className="rounded-2xl shadow-xl border border-slate-200 w-full" />
                    </div>
                    <div className="w-full md:w-1/2 text-lg text-slate-600 leading-relaxed">
                        <p className="mb-6 font-semibold text-xl text-slate-800">{siteContent.aboutTitle}</p>
                        <p className="whitespace-pre-line">
                            {siteContent.aboutText}
                        </p>
                    </div>
                </div>
            </FadeInSection>
        </section>
    );
}
