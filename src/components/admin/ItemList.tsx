import { useState, useRef, useEffect, ReactNode } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { GripVertical, Play, Pause, Save, Edit2, Trash2, X } from "lucide-react";
import Toggle from "./Toggle";
import { getPlayableUrl } from "../../lib/audio";

interface ItemListProps {
    items: any[];
    collName: string;
    onReorder: (newItems: any[]) => void;
    onDelete: (collName: string, id: string) => void;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    editForm: any;
    setEditForm: (form: any) => void;
    onSave: (collName: string, id: string, payload?: any) => void;
    onCancel: () => void;
    fields: { key: string; label: string; type?: string }[];
    extraActions?: (item: any) => ReactNode;
}

export default function ItemList({ items, collName, onReorder, onDelete, editingId, setEditingId, editForm, setEditForm, onSave, onCancel, fields, extraActions }: ItemListProps) {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleAudio = (id: string, url: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = getPlayableUrl(url);
            } else {
                audioRef.current = new Audio(getPlayableUrl(url));
                audioRef.current.onended = () => setPlayingId(null);
            }
            audioRef.current.play();
            setPlayingId(id);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            {items.length === 0 && (
                <div className="p-16 text-center text-slate-400 font-medium">
                    No items found in this section.
                </div>
            )}
            <Reorder.Group axis="y" values={items} onReorder={onReorder}>
                {items.map((item) => (
                    <Reorder.Item key={item.id} value={item} className="bg-white" layout="position">
                        <div className="p-4 flex items-center gap-3 group hover:bg-slate-50/50 transition-colors">
                            <div className="flex flex-col gap-1 border-r border-slate-100 pr-3 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                                <GripVertical size={20} />
                            </div>

                            {/* Preview Column - for videos, studio, clients, and demos */}
                            {(collName === 'videos' || collName === 'studio' || collName === 'clients' || collName === 'demos') && (
                                <div className="w-24 h-16 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                                    {collName === 'videos' && (item.youtubeId || item.youtube_id) && (
                                        <img
                                            src={`https://img.youtube.com/vi/${item.youtubeId || item.youtube_id}/mqdefault.jpg`}
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {collName === 'studio' && item.url && (
                                        <img
                                            src={item.url}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-2"
                                            onError={(e) => { e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs">No preview</div>'; }}
                                        />
                                    )}
                                    {collName === 'clients' && item.url && (
                                        <img
                                            src={item.url}
                                            alt="Client logo"
                                            className="w-full h-full object-contain p-2"
                                            onError={(e) => { e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs">No preview</div>'; }}
                                        />
                                    )}
                                    {collName === 'demos' && item.url && (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 transition-colors">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); toggleAudio(item.id, item.url); }}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-[var(--theme-primary)] hover:scale-110 transition-all border border-slate-100"
                                            >
                                                {playingId === item.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <AnimatePresence mode="wait">
                                    {editingId === item.id ? (
                                        <motion.div
                                            key="edit"
                                            initial={{ opacity: 0, scale: 0.98, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98, y: -4 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4 py-2"
                                        >
                                            {fields.map(f => (
                                                <div key={f.key}>
                                                    <label className="text-[10px] font-medium text-slate-400 uppercase block mb-1">{f.label}</label>
                                                    {f.type === 'boolean' ? (
                                                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 w-fit">
                                                            <span className="text-xs font-medium text-slate-600">On / Off</span>
                                                            <Toggle
                                                                checked={editForm[f.key]}
                                                                onChange={(checked) => setEditForm({ ...editForm, [f.key]: checked })}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={editForm[f.key] || ""}
                                                            onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/20 focus:border-[var(--theme-primary)] text-xs"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="display"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="py-1"
                                        >
                                            {/* Special display for videos - show YouTube title */}
                                            {collName === 'videos' && (item.youtubeId || item.youtube_id) ? (
                                                <div className="font-medium text-slate-800 text-sm">
                                                    {item.title || 'YouTube Video'}
                                                </div>
                                            ) : (
                                                /* Default display for other types */
                                                fields.map((f, i) => {
                                                    if (i > 0) return null;
                                                    let displayValue = item[f.key];
                                                    if (collName === 'clients' && f.key === 'url' && displayValue) {
                                                        let fileName = displayValue.split('/').pop().split('?')[0];
                                                        // Remove timestamp prefix if it follows the pattern 123456789_
                                                        fileName = fileName.replace(/^\d+_/, '');
                                                        // Remove extension
                                                        fileName = fileName.split('.').slice(0, -1).join('.');
                                                        // Replace hyphens and underscores with spaces, then capitalize
                                                        displayValue = fileName.split(/[-_]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                                    }
                                                    return (
                                                        <div key={f.key} className="flex items-center gap-2">
                                                            {f.type === 'boolean' ? (
                                                                <>
                                                                    <Toggle
                                                                        checked={item[f.key]}
                                                                        onChange={(checked) => onSave(collName, item.id, { ...item, [f.key]: checked })}
                                                                    />
                                                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                                                                        {item[f.key] ? "Black & White" : "Original Color"}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <div className="font-medium text-slate-800 text-sm truncate">{displayValue}</div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-1">
                                {extraActions && !editingId && extraActions(item)}
                                {editingId === item.id ? (
                                    <>
                                        <button onClick={() => onSave(collName, item.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"><Save size={20} /></button>
                                        <button onClick={onCancel} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><X size={20} /></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setEditingId(item.id); setEditForm(item); }} className="p-2 text-slate-300 hover:text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Edit2 size={18} /></button>
                                        <button onClick={() => onDelete(collName, item.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    );
}
