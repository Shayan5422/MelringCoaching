# MELRING Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from premium fitness brands (Equinox, Barry's Bootcamp) and luxury sports experiences. This is a transformation-focused coaching service requiring emotional impact and aspirational design.

## Brand Colors (Pre-Defined)
- **Primary Black**: #1D1D1B (dominant background, text)
- **Pure White**: #FFFFFF (text, accents, contrast)
- **Premium Gold**: #CDA756 (CTAs, highlights, luxury accents)

## Typography System
**Font Stack**: 
- **Display/Headers**: Montserrat (900/800 weight) via Google Fonts - bold, powerful, athletic
- **Body/UI**: Inter (400/500/600 weight) - clean, modern, readable

**Hierarchy**:
- Hero headline: 4xl-6xl, Montserrat Black (900), tight tracking
- Section titles: 3xl-4xl, Montserrat ExtraBold (800)
- Subsections: xl-2xl, Montserrat Bold (700)
- Body text: base-lg, Inter Regular (400)
- UI elements: sm-base, Inter Medium (500)

## Layout System
**Spacing Units**: Tailwind 4, 8, 12, 16, 24, 32 (p-4, p-8, py-12, py-16, py-24, py-32)

**Containers**: 
- Full-width sections with max-w-7xl inner containers
- Text content: max-w-4xl for readability

**Section Padding**: py-16 mobile, py-24 desktop

## Page Structure & Sections

### 1. Hero Section (100vh)
- Full-screen immersive experience with large boxing training image (blurred background)
- Centered content overlay with dramatic headline hierarchy
- Primary CTA (blurred background button): "Découvrez l'expérience" + Secondary: "Voir le planning"
- Subtle gold accent line or frame element

### 2. Philosophy Section
- Black background with white text, gold accent elements
- Three-column grid (desktop) showcasing core values: "Dépassement", "Puissance", "Engagement"
- Each column with gold icon accent, headline, descriptive text

### 3. Services Grid
- White background section for contrast
- 2x3 grid layout: HIIT, Cardio, Boxe tous niveaux, Séances à la carte, Évènements, Coaching individuel
- Cards with subtle shadow, gold border on hover
- Icons from Heroicons CDN

### 4. Pricing Tables
- Black background with gold accents
- Three distinct pricing blocks: Cours Collectifs, Forfaits, Coaching Personnalisé
- Gold header bars, white text, clear price display
- Prominent CTAs in gold

### 5. Team-Building Section
- Full-width image background (corporate team boxing session) with dark overlay
- Left-aligned content with benefits list
- Gold bullet points, white text
- CTA: "Demander un devis"

### 6. Booking Information
- White background
- Centered layout explaining Bookyway access
- Email collection form (simple, elegant)
- Gold submit button

### 7. Contact & Social
- Black background footer
- Two-column layout: Contact form (left) + Info/Social (right)
- Instagram/TikTok icons (Heroicons)
- Gold accent dividers

## Component Patterns

**Buttons**:
- Primary: Gold (#CDA756) background, black text, px-8 py-4, rounded-sm
- Secondary: White border, white text, transparent background
- All buttons with blurred backgrounds when over images

**Cards**:
- White background, subtle shadow (shadow-lg)
- 8px border-radius, p-8 padding
- Gold accent border-top (4px) for premium feel

**Forms**:
- Black background inputs with white borders
- Gold focus states (ring-gold-500)
- White placeholder text with reduced opacity

**Navigation**:
- Fixed header with black background, white text
- Gold underline on active states
- Minimal, horizontal layout with social icons right-aligned

## Images
- **Hero**: Large, dynamic boxing training shot (coach with client, gloves, ring) - full-bleed, dark overlay
- **Team-Building**: Corporate group in boxing gear, energetic atmosphere
- **Services**: Icon-based (no photos needed for services grid)
- All images should convey power, transformation, premium quality

## Animations
**Minimal, Strategic Use**:
- Fade-in on scroll for section entries (subtle, once)
- Gold accent line draws on hero load
- Button hover: slight scale (1.02)
- NO complex scroll-triggered animations

## Visual Treatments
- High contrast black/gold throughout
- Generous whitespace (never cramped)
- Gold accent lines as section dividers (1px, centered, w-24)
- Subtle gradient overlays on images (black to transparent)
- Shadow usage: elevation for cards, depth for floating elements

## Mobile Responsive
- Single column stacking for all grids
- Hero: 70vh on mobile, maintained impact
- Navigation: hamburger menu (black bg, gold accent)
- Pricing tables: stacked vertically with full-width cards

This creates a luxurious, powerful brand experience that positions MELRING as premium transformation coaching.