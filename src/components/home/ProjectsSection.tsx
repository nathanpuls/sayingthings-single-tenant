import { Video, Play, Pause } from "lucide-react";
import FadeInSection from "../FadeInSection";
import SectionHeader from "./SectionHeader";

interface ProjectsSectionProps {
    activeVideo: any;
    videos: any[];
    isPlayingVideo: boolean;
    handleVideoToggle: (video: any) => void;
    basePadding?: string;
    videoRef: React.RefObject<HTMLIFrameElement>;
}

export default function ProjectsSection({
    activeVideo,
    videos,
    isPlayingVideo,
    handleVideoToggle,
    basePadding = "py-6 md:py-10",
    videoRef
}: ProjectsSectionProps) {
    return (
        <section key="projects" id="projects" className={`${basePadding} px-6 scroll-mt-28`}>
            <FadeInSection className="container mx-auto">
                <SectionHeader title="Projects" icon={<Video />} />
                {activeVideo && (
                    <div className="mb-2 max-w-6xl mx-auto">
                        <h3 className="text-2xl font-bold text-slate-800">{activeVideo.title}</h3>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Main Player */}
                    <div className="flex-1">
                        {activeVideo ? (
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-black aspect-video">
                                <iframe
                                    ref={videoRef}
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?rel=0&autoplay=${isPlayingVideo ? 1 : 0}&enablejsapi=1`}
                                    title={activeVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                                Select a video
                            </div>
                        )}
                    </div>

                    {/* Playlist Sidebar */}
                    <div className="lg:w-1/3 flex flex-col gap-3 h-[500px] overflow-y-auto pr-2">
                        {videos.map((vid) => (
                            <button
                                key={vid.id}
                                onClick={() => handleVideoToggle(vid)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all text-left border ${activeVideo?.id === vid.id && isPlayingVideo
                                    ? "bg-[var(--theme-primary)]/10 border-slate-100"
                                    : "bg-white border-slate-100 hover:border-[var(--theme-primary)]/50 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="relative w-24 aspect-video rounded-md overflow-hidden flex-shrink-0 bg-slate-200 group-hover:opacity-90 transition">
                                    <img
                                        src={`https://img.youtube.com/vi/${vid.youtube_id}/mqdefault.jpg`}
                                        alt={vid.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-semibold truncate ${activeVideo?.id === vid.id && isPlayingVideo ? "text-[var(--theme-primary)]" : "text-slate-700"}`}>
                                        {vid.title}
                                    </h4>
                                </div>
                                <div className={`p-2 rounded-full ${activeVideo?.id === vid.id && isPlayingVideo ? "bg-[var(--theme-primary)] text-white" : "text-slate-400 group-hover:text-[var(--theme-primary)]"}`}>
                                    {activeVideo?.id === vid.id && isPlayingVideo ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </FadeInSection>
        </section>
    );
}
