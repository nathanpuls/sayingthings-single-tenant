export const getPlayableUrl = (url: string) => {
    if (!url) return "";

    // Google Drive
    const driveMatch = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^\&]+)/);
    if (driveMatch && (url.includes("drive.google.com") || url.includes("docs.google.com"))) {
        return `https://docs.google.com/uc?id=${driveMatch[1]}`;
    }

    // Dropbox
    if (url.includes("dropbox.com") && url.includes("dl=0")) {
        return url.replace("dl=0", "raw=1");
    }

    // Base64
    if (url.startsWith('data:audio')) return url;

    // Firebase / Supabase / Direct
    return url;
};
