import { X, Copy } from "lucide-react";

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl shadow-black/10 transition-all animate-in slide-in-from-top-5 fade-in duration-300 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
            <span className="font-medium">{message}</span>
            {type === 'error' && (
                <button
                    onClick={() => navigator.clipboard.writeText(message)}
                    className="p-1 hover:bg-white/20 rounded-md transition-colors opacity-80 hover:opacity-100"
                    title="Copy error to clipboard"
                >
                    <Copy size={16} />
                </button>
            )}
            <button onClick={onClose} className="opacity-80 hover:opacity-100"><X size={18} /></button>
        </div>
    );
}
