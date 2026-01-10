import { useState, ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface FileUploaderProps {
    onUploadComplete: (url: string) => void;
    folder?: string;
    accept?: string;
}

export default function FileUploader({ onUploadComplete, folder = "misc", accept = "*" }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filePath);

            onUploadComplete(publicUrl);
        } catch (error: any) {
            console.error("Upload error:", error);
            alert("Upload failed: " + error.message + "\n\nMake sure you have a public 'uploads' bucket in Supabase Storage with proper policies.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <label className="cursor-pointer flex items-center justify-center gap-2 p-3 text-slate-500 hover:text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/5 rounded-xl transition-all border border-dashed border-slate-300 hover:border-[var(--theme-primary)] h-[46px]">
            {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[var(--theme-primary)] border-t-transparent"></div>
            ) : (
                <UploadCloud size={20} />
            )}
            <span className="text-sm font-semibold">{uploading ? "Uploading..." : "Upload File"}</span>
            <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} accept={accept} />
        </label>
    );
}
