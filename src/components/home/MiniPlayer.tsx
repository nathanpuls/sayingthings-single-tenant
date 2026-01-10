import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronDown, Mic, Video, Settings } from "lucide-react";

interface MiniPlayerProps {
    showMiniPlayer: boolean;
    currentAudioTrack: any;
    activeVideo: any;
    isPlayingVideo: boolean;
    isAudioPlaying: boolean;
    onTogglePlay: () => void;
    demos: any[];
    videos: any[];
    currentAudioIndex: number;
    onSelectAudio: (index: number) => void;
    onSelectVideo: (video: any) => void;
}

export default function MiniPlayer({
    showMiniPlayer,
    currentAudioTrack,
    activeVideo,
    isPlayingVideo,
    isAudioPlaying,
    onTogglePlay,
    demos,
    videos,
    currentAudioIndex,
    onSelectAudio,
    onSelectVideo
}: MiniPlayerProps) {
    const [miniPlayerOpen, setMiniPlayerOpen] = useState(false);
    const miniPlayerRef = useRef<HTMLDivElement>(null);

    // Close mini player dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (miniPlayerRef.current && !miniPlayerRef.current.contains(event.target as Node)) {
                setMiniPlayerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const currentlyPlayingTitle = isPlayingVideo && activeVideo ? activeVideo.title : currentAudioTrack?.name || "Select media";
    const currentlyPlayingType = isPlayingVideo ? "Project" : "Demo";

    return (
        <AnimatePresence>
            {showMiniPlayer && (currentAudioTrack || activeVideo) && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl"
                >
                    <div className="container mx-auto px-6 py-4">
                        <div ref={miniPlayerRef} className="flex items-center justify-between gap-4">
                            {/* Left: Play/Pause Button */}
                            <button
                                onClick={onTogglePlay}
                                className="p-3 bg-[var(--theme-primary)] rounded-full text-white hover:brightness-110 shadow-lg transition-all active:scale-95 flex-shrink-0"
                                aria-label={isAudioPlaying || isPlayingVideo ? "Pause" : "Play"}
                            >
                                {(isAudioPlaying && !isPlayingVideo) || isPlayingVideo ? (
                                    <Pause size={20} fill="currentColor" />
                                ) : (
                                    <Play size={20} fill="currentColor" className="ml-0.5" />
                                )}
                            </button>

                            {/* Right: Track Info & Dropdown */}
                            <div className="flex-1 relative">
                                <button
                                    onClick={() => setMiniPlayerOpen(!miniPlayerOpen)}
                                    className="w-full flex items-center gap-2 text-left group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-slate-800 truncate flex items-center gap-2">
                                            <span className="truncate">{currentlyPlayingTitle}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`flex-shrink-0 transition-transform duration-200 ${miniPlayerOpen ? "rotate-180 text-[var(--theme-primary)]" : "text-slate-400 group-hover:text-[var(--theme-primary)]"}`}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {currentlyPlayingType}
                                        </div>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {miniPlayerOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-xl shadow-xl border border-slate-100 py-2 max-h-[600px] overflow-y-auto"
                                        >
                                            {/* Audio Demos Section */}
                                            {demos.length > 0 && (
                                                <>
                                                    <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Demos</div>
                                                    {demos.map((demo, i) => (
                                                        <button
                                                            key={demo.id}
                                                            onClick={() => {
                                                                onSelectAudio(i);
                                                                setMiniPlayerOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${i === currentAudioIndex && isAudioPlaying && !isPlayingVideo ? "text-[var(--theme-primary)] font-medium bg-[var(--theme-primary)]/5" : "text-slate-600"}`}
                                                        >
                                                            <Mic size={16} className="flex-shrink-0" />
                                                            <span className="truncate flex-1">{demo.name}</span>
                                                        </button>
                                                    ))}
                                                </>
                                            )}

                                            {/* Videos Section */}
                                            {videos.length > 0 && (
                                                <>
                                                    <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2 border-t border-slate-100">Projects</div>
                                                    {videos.map((vid) => (
                                                        <button
                                                            key={vid.id}
                                                            onClick={() => {
                                                                onSelectVideo(vid);
                                                                setMiniPlayerOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${activeVideo?.id === vid.id && isPlayingVideo ? "text-[var(--theme-primary)] font-medium bg-[var(--theme-primary)]/5" : "text-slate-600"}`}
                                                        >
                                                            <Video size={16} className="flex-shrink-0" />
                                                            <span className="truncate flex-1">{vid.title}</span>
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Far Right: Admin Settings */}
                            <a href="/admin" className="p-2 text-slate-400 hover:text-[var(--theme-primary)] transition-colors flex-shrink-0" title="Admin Settings">
                                <Settings size={20} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
