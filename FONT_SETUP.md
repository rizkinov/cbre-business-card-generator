# CBRE Font Setup Guide

The CBRE business card generator is designed to use custom CBRE brand fonts for professional appearance. This guide explains how to add the official CBRE fonts to your deployment.

## Current Font Configuration

The application currently uses **Google Fonts fallbacks** that provide good visual approximation:

- **Financier Display** → **Playfair Display** (serif fallback)
- **Calibre** → **Inter** (sans-serif fallback)

## Adding Custom CBRE Fonts

### Step 1: Obtain CBRE Brand Fonts

You'll need these official CBRE font files:

**Financier Display:**
- `financier-display-web-regular.woff2`
- `financier-display-web-regular.woff`
- `financier-display-web-medium.woff2`
- `financier-display-web-medium.woff`

**Calibre:**
- `calibre-web-light.woff2`
- `calibre-web-light.woff`
- `calibre-web-regular.woff2`
- `calibre-web-regular.woff`

### Step 2: Add Fonts to Project

1. Create the font directory structure:
```
public/fonts/
├── financier_display/
│   ├── financier-display-web-regular.woff2
│   ├── financier-display-web-regular.woff
│   ├── financier-display-web-medium.woff2
│   └── financier-display-web-medium.woff
└── calibre/
    ├── calibre-web-light.woff2
    ├── calibre-web-light.woff
    ├── calibre-web-regular.woff2
    └── calibre-web-regular.woff
```

2. Copy your font files to the respective directories.

### Step 3: Deploy

Once fonts are added to the `public/fonts/` directory:

1. Commit the changes:
```bash
git add public/fonts/
git commit -m "Add official CBRE brand fonts"
git push origin main
```

2. Deploy to Vercel:
```bash
vercel --prod
```

## Font Loading Behavior

The application uses a **graceful fallback system**:

1. **First**: Attempts to load custom CBRE fonts from `/fonts/` directory
2. **Second**: Falls back to Google Fonts (Playfair Display, Inter)
3. **Third**: Falls back to system fonts (Georgia, Arial, etc.)

This ensures the business cards always generate successfully, even without custom fonts.

## Verification

After adding custom fonts, generate a business card and verify:

- [ ] Name uses **Financier Display** (serif appearance)
- [ ] Body text uses **Calibre** (clean sans-serif)
- [ ] Fonts appear crisp and professional
- [ ] No fallback fonts are being used

## Font Licensing

**Important**: Ensure you have proper licensing for CBRE brand fonts:
- Only use fonts obtained through official CBRE brand guidelines
- Respect any usage restrictions or licensing terms
- Do not redistribute font files without proper authorization

## Troubleshooting

### Fonts Not Loading
- Verify font files are in correct directory structure
- Check file names match exactly (case-sensitive)
- Ensure both `.woff2` and `.woff` formats are present
- Test deployment in production environment

### Font Rendering Issues
- Clear browser cache
- Test in different browsers
- Check Vercel deployment logs for font loading errors

## Technical Details

The font loading is handled in `lib/pdf/html-generator.ts` with:
- `@font-face` declarations for custom fonts
- `font-display: swap` for better performance
- `document.fonts.ready` to ensure fonts load before PDF generation
- Comprehensive fallback font stacks

For technical support, check the application logs or contact the development team. 