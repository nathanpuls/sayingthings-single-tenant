import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Database } from "../lib/database.types";
import AudioPlayer from "../components/AudioPlayer";

type Demo = Database['public']['Tables']['demos']['Row'];
type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

export default function EmbedPlayer() {
    const { uid } = useParams();
    const [demos, setDemos] = useState<Demo[]>([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!uid) return;

            // Fetch Demos
            const { data: demosData } = await supabase
                .from('demos')
                .select('*')
                .eq('user_id', uid)
                .order('order', { ascending: true });

            if (demosData) setDemos(demosData);

            // Fetch Settings (for theme color & fonts)
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('*')
                .eq('user_id', uid)
                .single();

            if (settingsData) {
                setSettings(settingsData);
            }

            setLoading(false);
        };

        fetchData();
    }, [uid]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-transparent">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[var(--theme-primary)] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (demos.length === 0) {
        return <div className="text-center p-4 text-slate-500 text-sm">No demos found.</div>;
    }

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
            <style>{`
                :root {
                    --theme-primary: ${settings?.theme_color || '#6366f1'};
                }
                body {
                    background: transparent;
                }
            `}</style>
            <div className="w-full max-w-md">
                <AudioPlayer
                    tracks={demos}
                    ownerName={settings?.site_name || "Voice Over Artist"}
                />
            </div>
        </div>
    );
}
