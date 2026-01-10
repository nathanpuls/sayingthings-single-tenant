import { Sparkles, ChevronRight, LogIn, Zap, Layout, Globe } from "lucide-react";
import FadeInSection from "../FadeInSection";

interface LandingProps {
    handleLogin: () => void;
    currentUser: any;
    isScrolled: boolean;
}

export default function Landing({ handleLogin, currentUser, isScrolled }: LandingProps) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-slate-200" : "bg-transparent py-6"}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                            <Sparkles size={24} fill="currentColor" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">Built</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <a href="/admin" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                                Dashboard <ChevronRight size={18} />
                            </a>
                        ) : (
                            <button onClick={handleLogin} className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition shadow-sm">
                                <LogIn size={18} /> Sign In
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
                <FadeInSection className="container mx-auto text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-8 animate-bounce">
                        <Zap size={16} fill="currentColor" /> Now in Open Beta
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                        The Portfolio Platform <br />
                        <span className="text-indigo-600">for Creatives.</span>
                    </h1>
                    <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Launch your professional portfolio in minutes with dynamic content, custom domains, and blazing fast performance. Designed by creatives, for creatives.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleLogin}
                            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            Get Started for Free <ChevronRight size={22} />
                        </button>
                        <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                            View Showcase
                        </button>
                    </div>
                </FadeInSection>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Layout size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Dynamic CMS</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Easily manage your demos, projects, gallery, and reviews from a powerful admin dashboard. Changes reflect instantly.
                            </p>
                        </div>
                        <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Custom Domains</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Connect your own domain name with free SSL. Build your brand on a foundation that you truly own.
                            </p>
                        </div>
                        <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Blazing Performance</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Optimized for speed and SEO. Your portfolio loads in milliseconds, ensuring you never miss an opportunity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-32 px-6 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-indigo-600 -z-10" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] opacity-10 -z-10" />
                <FadeInSection className="container mx-auto max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                        Ready to elevate <br /> your online presence?
                    </h2>
                    <button
                        onClick={handleLogin}
                        className="px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-2xl shadow-black/20 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto"
                    >
                        Start Building Now
                    </button>
                </FadeInSection>
            </section>

            <footer className="py-12 bg-slate-900 text-slate-500 text-center">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
                        <Sparkles size={20} fill="currentColor" />
                        <span className="text-xl font-bold tracking-tight text-white">Built</span>
                    </div>
                    <p className="text-sm">© {new Date().getFullYear()} Built Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
