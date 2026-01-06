export const fonts = [
    { name: 'Outfit', value: 'Outfit' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Raleway', value: 'Raleway' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Merriweather', value: 'Merriweather' },
];

export const applyFont = (fontName: string) => {
    if (!fontName) return;

    const font = fonts.find(f => f.name === fontName) || fonts[0];

    // 1. Update CSS Variable
    document.documentElement.style.setProperty('--font-primary', `"${font.value}", sans-serif`);

    // 2. Load Google Font
    const linkId = 'dynamic-font-link';
    let link = document.getElementById(linkId) as HTMLLinkElement;

    if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // Handle weights (standard set)
    const weights = '300;400;500;600;700';
    link.href = `https://fonts.googleapis.com/css2?family=${font.value.replace(/\s+/g, '+')}:wght@${weights}&display=swap`;
};

export const loadAllFonts = () => {
    const linkId = 'all-fonts-preview';
    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const weights = '400;700';
    const families = fonts.map(f => `family=${f.value.replace(/\s+/g, '+')}:wght@${weights}`).join('&');
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

