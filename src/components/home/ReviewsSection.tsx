import { MessageSquare } from "lucide-react";
import FadeInSection from "../FadeInSection";
import SectionHeader from "./SectionHeader";

interface ReviewsSectionProps {
    reviews: any[];
    basePadding?: string;
}

export default function ReviewsSection({ reviews, basePadding = "py-6 md:py-10" }: ReviewsSectionProps) {
    return (
        <section key="reviews" id="reviews" className={`${basePadding} px-6 scroll-mt-28`}>
            <FadeInSection className="container mx-auto">
                <SectionHeader title="Reviews" icon={<MessageSquare />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {reviews.map((review) => (
                        <div key={review.id} className="glass-card p-8 rounded-xl relative bg-white border border-slate-100 shadow-sm">
                            <p className="text-lg italic text-slate-600 mb-6 font-serif leading-relaxed">"{review.text}"</p>
                            <div className="text-sm font-semibold text-[var(--theme-primary)]">{review.author}</div>
                        </div>
                    ))}
                </div>
            </FadeInSection>
        </section>
    );
}
