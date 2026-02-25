# UI_SPEC.md — Landing Page (Skinstric)
Version: v1 (Landing Page Only)
Stack: Next.js (App Router), Tailwind CSS, GSAP
Project Type: Frontend only
Design Source: Figma screenshots + exported icons/assets + manually extracted values

---

## 1) Scope

This spec is ONLY for the **Landing Page / Hero section** shown in the Figma frame (1920x960 reference).

### Included
- Header / top navigation
- Hero headline
- Left and right icon/text action controls
- Bottom-left supporting caption text
- Decorative dashed guide rectangles (left/right)
- GSAP entrance animations for hero UI

### Excluded (for now)
- Additional sections below the fold
- Product cards
- Sliders/carousels
- Forms
- API integrations
- Backend logic

---

## 2) Tech Requirements

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animation:** GSAP
- **Icons:** Exported from Figma as SVGs (preferred)
- **Fonts:** Roobert TRIAL (or fallback if unavailable)
- **Architecture:** Reusable React components (Header, Hero, NavButton, IconButton, etc.)

---

## 3) Design Intent

The landing page should feel:
- minimal
- premium
- editorial
- soft / clean
- high-end skincare branding
- motion-driven but restrained (GSAP should feel elegant, not flashy)

---

## 4) Artboard Reference (from Figma)

- Reference frame size: **1920 x 960**
- Background: **#FCFCFC**
- Main content centered with large whitespace
- Hero headline centered vertically and horizontally
- Header pinned top
- Supporting caption at bottom-left
- CTA/icon controls aligned left and right around hero center line
- Decorative dashed rectangles partially off-canvas on both sides

> Note: Figma exported CSS uses absolute positioning. In production, use flex/grid + responsive layout while preserving the visual composition.

---

## 5) Design Tokens (Extracted from Figma)

### Colors
- **Background / Surface:** `#FCFCFC`
- **Primary Text / Stroke:** `#1A1B1C`
- **Decorative Dashed Border:** `#A0A4AB`
- **Muted text opacity usage:** ~`0.6` to `0.7` (prefer Tailwind opacity utilities)

### Typography
#### Font Family
- Primary: `"Roobert TRIAL"`
- Fallbacks: `Inter, ui-sans-serif, system-ui, sans-serif`

#### Hero Heading (desktop reference / 1920)
- Weight: `300`
- Size: `128px`
- Line-height: `120px`
- Letter-spacing: `-0.07em`
- Align: `center`
- Color: `#1A1B1C`

#### Button / Label Text (desktop)
- Weight: `600`
- Size: `14px`
- Line-height: `16px`
- Letter-spacing: `-0.02em`
- Transform: `uppercase`

#### Small Button Text (inside dark button, exported as 1024 variant in Figma)
- Weight: `600`
- Size: `10px`
- Line-height: `16px`
- Letter-spacing: `-0.02em`
- Transform: `uppercase`

#### Caption Text (bottom-left)
- Weight: `400`
- Size: `14px`
- Line-height: `24px`
- Transform: `uppercase`
- Color: `#1A1B1C`

### Borders / Shapes
- Standard dark stroke: `1px solid #1A1B1C`
- Decorative border: `2px dashed #A0A4AB`
- Small pill/bar radius: `2px`
- Icon button shape: square (44x44) with inner decorative lines/dashes

---

## 6) Layout Structure (Production-Friendly)

Use this structure instead of raw absolute positioning.

### Page Wrapper
- Full viewport hero section (min `100svh`)
- Background `#FCFCFC`
- Relative container for decorative elements and overlays
- Overflow hidden (for off-canvas dashed rectangles)

### Header (top, full width)
- Height: `64px`
- Content:
  - Left: brand name (`SKINSTRIC`)
  - Mid-left: location/section marker (`INTRO`) with bracket-like bars
  - Right: dark button CTA (`ENTER CODE` or final label from design)
- Horizontal padding: `32px` desktop
- Vertically centered items

### Main Hero Content (center)
- Centered large headline:
  - “Sophisticated skincare”
- Width cap around ~680px on large screens
- Text centered

### Side CTA Controls (aligned to hero midline)
- Left side:
  - icon button + label (e.g., previous/back control)
- Right side:
  - label + icon button (e.g., next/scroll control)
- Both aligned near vertical center of hero area
- Hidden or repositioned on mobile/tablet if needed

### Bottom-left Caption
- Small uppercase supporting text
- Width ~316px on desktop
- Anchored near lower-left with safe padding

### Decorative Dashed Rectangles
- Two large dashed boxes (~602x602 reference)
- Positioned partially off-canvas left/right
- Decorative only (aria-hidden)
- Fade in subtly with GSAP

---

## 7) Responsive Behavior Rules

### Breakpoints (Tailwind defaults)
- `sm` 640+
- `md` 768+
- `lg` 1024+
- `xl` 1280+
- `2xl` 1536+

### Desktop (xl / 2xl)
- Preserve the Figma composition closely
- Hero headline remains centered
- Side controls visible left and right
- Decorative dashed rectangles visible

### Tablet (md / lg)
- Reduce hero headline size
- Side controls can move inward
- Decorative rectangles may scale down or fade more
- Caption can move slightly upward

### Mobile (sm and below)
- Header remains usable and simplified
- Hero headline wraps naturally and scales down significantly
- Side controls should stack, shrink, or become bottom controls
- Decorative dashed rectangles hidden or heavily reduced
- Caption width becomes fluid and readable

### Responsive Typography Targets (recommended)
- Hero heading:
  - mobile: `text-4xl` to `text-5xl`
  - tablet: `text-6xl`
  - desktop: custom clamp
- Use `clamp()` for hero headline in CSS/Tailwind arbitrary values if needed:
  - Example intent: scale between ~40px and 128px

---

## 8) Component Breakdown (React)

### `LandingHeader`
**Responsibilities**
- Brand label
- Intro/location marker
- Right-side dark CTA button

**Notes**
- Use semantic `<header>`
- Use uppercase styles consistently
- Keep spacing tight and premium

### `HeroHeadline`
**Responsibilities**
- Main headline text
- Center alignment
- Responsive typography

### `HeroSideControl`
Reusable component for left/right controls.
**Props**
- `side: 'left' | 'right'`
- `label: string`
- `direction: 'prev' | 'next'`
- `onClick?: () => void`
- `ariaLabel: string`

**Composition**
- Label + icon button (order reverses by side)

### `IconFrameButton`
**Responsibilities**
- 44x44 square button
- Outer stroke
- Optional inner dashed border
- Triangle arrow icon (from Figma SVG preferred)
- Hover animation states (GSAP or CSS)

### `HeroCaption`
**Responsibilities**
- Supporting uppercase description at bottom-left
- Controlled width and line-height

### `DecorativeDashedFrame`
**Responsibilities**
- Render large dashed square
- Position left/right partially off-canvas
- Hidden on small screens
- `aria-hidden="true"`

---

## 9) Figma-to-Code Conversion Rules (Important)

### Do NOT copy directly from Figma CSS:
- `position: absolute` for every element
- `left/top` exact values for layout
- fixed width/height for text wrappers unless truly needed

### DO use Figma CSS for:
- colors
- font sizes / weights
- line-height
- letter-spacing
- border styles
- button dimensions
- icon sizes

### Layout conversion principle
Figma gives the **visual target**. Tailwind/Next should provide the **responsive system**.

---

## 10) Animation Spec (GSAP)

Animations should feel smooth, premium, and slightly delayed in sequence.

### Initial Load Timeline (Hero)
1. Header fades/slides in from top
2. Decorative dashed rectangles fade in (subtle)
3. Hero headline lines/words rise in with soft opacity
4. Side controls fade/slide in from left/right
5. Bottom caption fades in last

### Motion style
- Easing: smooth, premium (e.g., `power3.out`)
- Duration: moderate (not too snappy)
- Stagger on headline if splitting text
- Avoid over-rotations or flashy effects

### Hover interactions
- Icon button border/inner dash opacity change
- Arrow icon slight x-translation
- Label opacity from 0.7 → 1.0

### Accessibility
- Respect `prefers-reduced-motion`
- Disable or simplify timelines for reduced motion users

---

## 11) Accessibility Requirements

- Semantic structure: `<header>`, `<main>`, `<section>`
- Buttons must have `aria-label`
- Decorative elements `aria-hidden="true"`
- Maintain sufficient contrast (dark text on light background is good)
- Focus states visible on all interactive elements
- Motion reduced for users with reduced-motion preference

---

## 12) Asset Handling (Figma Icons)

### Preferred
- Export icons from Figma as **SVG**
- Store in `/public/icons/...`
- Use descriptive file names:
  - `arrow-left-triangle.svg`
  - `arrow-right-triangle.svg`
  - `intro-bracket-left.svg` (if exporting)
  - `intro-bracket-right.svg`

### If icons are simple
- Recreate with CSS or inline SVG for cleaner control and animation

---

## 13) Content (Current Text)

### Brand
- `SKINSTRIC`

### Section Marker
- `INTRO`

### Hero Headline
- `Sophisticated skincare`

### Caption
- `Skinstric developed an A.I. that creates a highly-personalised routine tailored to what your skin needs.`

> Keep exact capitalization/punctuation aligned with final approved design copy.

---

## 14) Tailwind Implementation Notes

### Recommended approach
- Use a `max-w-screen-2xl` style wrapper (or custom max width)
- Use `relative min-h-screen overflow-hidden bg-[#FCFCFC]`
- Use flex/grid for major alignment
- Use arbitrary values only when necessary (e.g., exact tracking/line-height)

### Example token mapping ideas (not final code)
- bg: `bg-[#FCFCFC]`
- text: `text-[#1A1B1C]`
- dashed deco: `border-[#A0A4AB]`
- tracking for buttons: `tracking-[-0.02em]`
- hero tracking: `tracking-[-0.07em]`

---

## 15) Build Priority (Implementation Order)

1. Static page layout (header + headline + caption)
2. Add side controls and decorative frames
3. Add responsive behavior
4. Add Figma icon assets
5. Add GSAP intro animations
6. Add hover interactions
7. Accessibility + reduced motion pass
8. Final polish (spacing/typography parity with screenshot)

---

## 16) Definition of Done (Landing Page)

The landing page is considered done when:
- Visual match is close to Figma on desktop
- Layout remains clean and usable on tablet/mobile
- Icons are from Figma assets (or faithful SVG recreation)
- GSAP animations feel premium and not distracting
- No layout built entirely with absolute positioning
- Accessible buttons / focus states are present
- Clean component structure in Next.js

---

## 17) Open Questions / To Confirm Later

- Final CTA button text in header
- Exact icon SVG exports from Figma
- Mobile Figma version (if available)
- Final font license / fallback if Roobert TRIAL is unavailable
- Exact hover/interaction behavior from design