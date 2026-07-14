Make 4 homepage sections (Hero, Collections, Behind the Canvas, Instagram) admin-editable (images + text), following the existing seed → localStorage → useCatalog → AdminPanel pattern.

1. New src/data/content.ts: seeds + interfaces (ShowcaseItem, CollectionItem, BTSImage, InstagramPost) mirroring current hardcoded content.
2. useCatalog.ts: add 4 state slices (showcase/collections/behindScenes/instagram) with localStorage persist + merge-on-load; return arrays + setters.
3. Collections.tsx & BehindTheScenes.tsx: accept optional items/images props (seed fallback). ShowcaseCarousel.tsx & InstagramFeed.tsx unchanged (already built).
4. page.tsx: swap <Hero/> for <ShowcaseCarousel items={showcaseItems}/>, pass items to Collections & BehindTheScenes, replace inline IG grid with <InstagramFeed posts/>, wire all data+setters into <AdminPanel>.
5. AdminPanel.tsx: fix prop-sync bug for showcase/instagram local state, add Collections + Behind the Canvas tabs (modeled on showcase tab), overflow-x-auto tab bar (now 5 tabs).
6. Verify with npm run build + npm run lint, then describe manual persistence check.