# Claude.md - AI Assistant Guide

**Version:** 1.1
**Last Updated:** October 15, 2025  
**Project:** Chris Hall Portfolio
**Developer:** Chris Hall

---

## Maintenance & Update Instructions

### AI Update Policy

This file is a **persistent, append-only system context document**.  
It defines both the **project reference architecture** and the **AI assistant’s operational memory** for the Chris Hall Portfolio.  
It should never be replaced, regenerated, or cleared — only expanded and refined.

---

### Update Rules

1. **Never overwrite or regenerate the document.**  
   Always **append** new information or **patch inline**. Preserve full history.

2. **Update the metadata block at the top:**
   - Increment **Version** with each meaningful change (`1.1 → 1.2 → 1.3`, etc.)
   - Update **Last Updated** date

3. **When logging updates:**
   - Append new entries in `## Update Log — YYYY-MM-DD`
   - Include:
     - Change type (bugfix, feature, refactor, doc update)
     - Summary of modifications
     - Affected files or components
     - Testing or verification notes
   - Keep concise (2–10 lines). Avoid verbose per-file breakdowns unless critical.

4. **If creating or updating checklists:**
   - Use `[x]` to mark completion.
   - Archive old items under a “📁 Archived Checklists” subheading.
   - Never delete prior items.

5. **For technical updates (code, shaders, or structure):**
   - Add as a `### Technical Update — <component>` subsection under that day’s log.
   - Use bullet lists and file paths.
   - Summarize the change, reason, and outcome.

6. **Inline corrections:**  
   Use this pattern for small edits or clarifications:

   ```
   Edit (YYYY-MM-DD): Corrected or clarified X
   ```

7. **Verbosity control:**

- Minor config or syntax fixes = short summary.
- Structural, architectural, or behavioral changes = detailed entry.

8. **After each update:**

- Append a new row to the **Version History Table** (see bottom).
- Include version, date, description, and line number range if known.

---

### Example Log Entry

#### Update Log — 2025-10-15

**Change Type:** Shader Conversion  
**Summary:**  
Converted 19 GLSL shader files to **GLSL 300 ES** syntax for full WebGL2 compatibility.  
Removed legacy defines (`#define varying in`, etc.) and replaced with proper ES 3.0 syntax.

**Affected:**  
`src/gl/Bg/*`, `Loader/*`, `Media/*`, `Pg/*`, `Roll/*`, `Slider/*`, `Tt/*`, `TtA/*`, `TtF/*`

**Result:**

- [ ] WebGL compilation errors resolved
- [ ] Consistent GLSL syntax across all components
- [ ] No JavaScript updates required
- [ ] Macro replacement (`#define numTextures PITO`) retained
- [ ] Verified across Chrome, Safari, and Firefox

---

# Context Guide

**Original Source:** `/reference-original/`

---

## Project Overview

This is a high-performance, visually sophisticated portfolio website featuring complex WebGL animations and text effects. Originally built as a WordPress theme, it has been migrated to a static, framework-free architecture while preserving all animations and interactions.

---

### Core Characteristics

- **Multi-page Application**
- **WebGL-powered text rendering** using MSDF (Multi-channel Signed Distance Fields) via OGL library
- **GSAP-driven animations** for smooth transitions and interactions
- **Currently static** — no backend, CMS, or API dependencies (would like to find a free headless CMS service or provider)
- **Performance-optimized** with Vite build system
- **Touch and mouse event handling** with device detection

---

## Technology Stack

### Core Technologies

```json
{
  "runtime": "Vanilla JavaScript (ES6+)",
  "graphics": "OGL",
  "animations": "GSAP",
  "scrolling": "Lenis",
  "text": "SplitType",
  "bundler": "Vite",
  "package_manager": "Bun",
  "styling": "CSS"
}
```

### Key Dependencies

- **ogl** — Minimal WebGL library for 3D graphics
- **gsap** — Industry-standard animation library
- **lenis** — Smooth scrolling with momentum
- **split-type** — Text splitting for character-by-character animation
- **swiper** — Touch slider functionality
- **fontfaceobserver** — Font loading management

---

## Project Architecture

### Directory Structure

```
/
├── claude.md                     # This file
├── index.html                    # Main HTML file
├── index.css                     # Global styles
├── vite.config.js                # Build configuration
├── package.json                  # Dependencies
├── jsconfig.json                 # JS/TS configuration
│
├── content/
│   ├── options.json              # Global UI (navigation, loader, footer)
│   ├── pages/
│   │   ├── 2.json                # Home page content
│   │   ├── 55.json               # Index page content
│   │   ├── 240.json              # About listing
│   │   └── 308.json              # Playground page
│   └── project/
│       └── [id].json             # Individual project data
│
├── public/
│   ├── fonts/                    # WOFF2 font files
│   ├── uploads/                  # Images and videos
│   ├── PPNeueMontreal-Medium.png # MSDF font texture
│   └── PPNeueMontreal-Medium.json# MSDF font data
│
├── src/
│   ├── app.js                                    # Application entry point
│   │
│   ├── start/                                    # Bootstrap & initialization
│   │   ├── constructor.js                        # Main constructor & global setup
│   │   ├── browser.js                            # Device/browser detection
│   │   └── firstload.js                          # Initial content loading
│   │
│   ├── main                                      # Core Animation logic
│   │   ├── anims.js                              # Text Splitting & Animation
│   │   ├── events.js                             # Event handling
│   │   ├── index.js                              # Main entry point
│   │   ├── pop.js                                # Page transitions
│   │   └── view.js                               # View management
│   │
│   ├── components                                # UI components
│   │   ├── Loader.js
│   │   ├── Mouse.js
│   │   └── Nav.js
│   │
│   ├── gl                                        # WebGL configuration
│   │   ├── create.js                             # Builds OGL graphical elements
│   │   ├── els.js                                # Loads assets, defines OGL elements
│   │   ├── events.js                             # Handles canvas interactions, loading
│   │   ├── gl.js                                 # Manages main OGL WebGL context
│   │   ├── ios.js                                # Tracks OGL element visibility, loads
│   │   │                                         # WebGL components
│   │   ├── Bg
│   │   │   ├── base.js
│   │   │   ├── Bg.fragment.main.glsl
│   │   │   ├── Bg.vertex.main.glsl
│   │   │   └── position.js
│   │   ├── Loader
│   │   │   ├── base.js
│   │   │   ├── Loader.fragment.main.glsl
│   │   │   ├── Loader.vertex.main.glsl
│   │   │   └── position.js
│   │   ├── Media
│   │   │   ├── base.js
│   │   │   ├── base.js.backup
│   │   │   ├── Media.fragment.main.glsl
│   │   │   ├── Media.vertex.main.glsl
│   │   │   └── position.js
│   │   ├── Pg                                    # Pg component (Playground page)
│   │   │   ├── base.js
│   │   │   ├── Pg.fragment.main.glsl
│   │   │   ├── Pg.vertex.main.glsl
│   │   │   └── position.js
│   │   ├── Roll                                  # Roll component (Index page)
│   │   │   ├── base.js
│   │   │   ├── position.js
│   │   │   ├── Roll.fragment.single.glsl
│   │   │   └── Roll.vertex.single.glsl
│   │   ├── Slider                                # Slider component (Index page)
│   │   │   ├── base.js
│   │   │   ├── position.js
│   │   │   ├── Slider.fragment.main.glsl
│   │   │   ├── Slider.fragment.parent.glsl
│   │   │   └── Slider.vertex.main.glsl
│   │   ├── Tt                                    # Tt MSDF component
│   │   │   ├── base.js
│   │   │   ├── position.js
│   │   │   ├── Tt.fragment.msdf.glsl
│   │   │   └── Tt.vertex.msdf.glsl
│   │   ├── TtA                                   # TtA (About page) MSDF component
│   │   │   ├── base.js
│   │   │   ├── position.js
│   │   │   ├── TtA.fragment.msdf.glsl
│   │   │   └── TtA.fragment.parent.glsl
│   │   └── TtF                                   # TtF (footer) MSDF component
│   │       ├── base.js
│   │       ├── position.js
│   │       ├── TtF.fragment.msdf.glsl
│   │       └── TtF.fragment.parent.glsl
│   │
│   ├── ios                                       # Lazy loading
│   │   ├── lazyImg.js                            # Lazy loads images on viewport entry
│   │   └── lazyVideo.js                          # Lazy loads & controls video playback
│   │
│   ├── js                                        # Page management scripts
│   │   ├── comps.js
│   │   ├── create.js
│   │   ├── events.js
│   │   ├── ios.js
│   │   ├── loads.js
│   │   ├── pagemain.js
│   │   ├── scroll.js
│   │   └── showhide.js
│   │
│   ├── types                                     # Type definitions
│   │   └── global.d.ts
│   ├── utils                                     # Environment configuration
│   │   └── env.js
│   │
│   └── views                                     # Page-specific view controllers
│       ├── About
│       │   ├── 0Intro
│       │   │   └── index.js
│       │   ├── 1Dual
│       │   │   └── io.js
│       │   └── about.js
│       ├── Error
│       │   ├── 0Intro
│       │   │   └── index.js
│       │   └── error.js
│       ├── Home
│       │   ├── 0Intro
│       │   │   └── index.js
│       │   └── home.js
│       ├── Playground
│       │   ├── 0Intro
│       │   │   └── index.js
│       │   └── playground.js
│       ├── Project
│       │   ├── 0Intro
│       │   │   ├── index.js
│       │   │   ├── io.js
│       │   │   └── ioin.js
│       │   └── project.js
│       └── Projects                             # Index page
│           ├── 0Intro
│           │   └── index.js
│           └── projects.js
│
│
├── reference-original/                       # ⚠️ READ-ONLY original WordPress export
│
│   ├── wp-content/
│   │   ├── themes/
│   │   │   ├── csskiller_wp/
│   │   │   │   ├── index.css
│   │   │   │   └── public/
│   │   │   │       ├── fonts/ → public/fonts/
│   │   │   │       │   ├── montreal.woff2
│   │   │   │       │   └── montrealbook.woff2
│   │   │   │       ├── PPNeueMontreal-Medium.png → public/PPNeueMontreal-Medium.png
│   │   │   │       └── PPNeueMontreal-Medium.json → public/PPNeueMontreal-Medium.json
│   │   │   └── src/ → src/
│   │   │       ├── app.js → src/app.js
│   │   │       ├── components🦾🦾🦾/ → src/components/
│   │   │       │   ├── Loader⏳/index.js → Loader.js
│   │   │       │   ├── Mouse🐭/index.js → Mouse.js
│   │   │       │   └── Nav🌤️/index.js → Nav.js
│   │   │       ├── gl🌊🌊🌊/ → src/gl/
│   │   │       │   ├── ⌛️/ → Loader/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪main.glsl → Loader.fragment.main.glsl
│   │   │       │   │   └── 🩻main.glsl → Loader.vertex.main.glsl
│   │   │       │   ├── 🎞️/ → Slider/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪main.glsl → Slider.fragment.main.glsl
│   │   │       │   │   ├── 🧪parent.glsl → Slider.fragment.parent.glsl
│   │   │       │   │   └── 🩻main.glsl → Slider.vertex.main.glsl
│   │   │       │   ├── 🎢/ → Roll/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪single.glsl → Roll.fragment.single.glsl
│   │   │       │   │   └── 🩻single.glsl → Roll.vertex.single.glsl
│   │   │       │   ├── 🏜️/ → Bg/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪main.glsl → Bg.fragment.main.glsl
│   │   │       │   │   └── 🩻main.glsl → Bg.vertex.main.glsl
│   │   │       │   ├── 🧮/ → Pg/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪main.glsl → Pg.fragment.main.glsl
│   │   │       │   │   └── 🩻main.glsl → Pg.vertex.main.glsl
│   │   │       │   ├── 🖼️/ → Media/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪main.glsl → Media.fragment.main.glsl
│   │   │       │   │   └── 🩻main.glsl → Media.vertex.main.glsl
│   │   │       │   ├── 💬/ → Tt/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪msdf.glsl → Tt.fragment.msdf.glsl
│   │   │       │   │   └── 🩻msdf.glsl → Tt.vertex.msdf.glsl
│   │   │       │   ├── 🔥/ → TtF/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪msdf.glsl → TtF.fragment.msdf.glsl
│   │   │       │   │   └── 🧪parent.glsl → TtF.fragment.parent.glsl
│   │   │       │   ├── 👩‍⚖️/ → TtA/
│   │   │       │   │   ├── base.js → base.js
│   │   │       │   │   ├── position.js → position.js
│   │   │       │   │   ├── 🧪msdf.glsl → TtA.fragment.msdf.glsl
│   │   │       │   │   └── 🧪parent.glsl → TtA.fragment.parent.glsl
│   │   │       │   ├── create.js → create.js
│   │   │       │   ├── els.js → els.js
│   │   │       │   ├── events.js → events.js
│   │   │       │   ├── gl.js → gl.js
│   │   │       │   └── ios.js → ios.js
│   │   │       ├── ios⛓️⛓️⛓️/ → src/ios/
│   │   │       │   ├── lazyImg/index.js → lazyImg.js
│   │   │       │   └── lazyVideo/index.js → lazyVideo.js
│   │   │       ├── js🧠🧠🧠/page👁️/ → src/js/
│   │   │       │   ├── comps.js
│   │   │       │   ├── create.js
│   │   │       │   ├── events.js
│   │   │       │   ├── ios.js
│   │   │       │   ├── loads.js
│   │   │       │   ├── pagemain.js
│   │   │       │   ├── scroll.js
│   │   │       │   └── showhide.js
│   │   │       ├── main🐙🐙🐙/ → src/main/
│   │   │       │   ├── 👁️.js → view.js
│   │   │       │   ├── anims.js
│   │   │       │   ├── events.js
│   │   │       │   ├── index.js
│   │   │       │   └── pop.js
│   │   │       ├── start🏁🏁🏁/ → src/start/
│   │   │       │   ├── browser🕸️.js → browser.js
│   │   │       │   ├── constructor🫀.js → constructor.js
│   │   │       │   └── firstload📊.js → firstload.js
│   │   │       └── views👁️👁️👁️/ → src/views/
│   │   │           ├── ⚪Home/ → Home/
│   │   │           ├── 🟢About/ → About/
│   │   │           ├── 🟡Playground/ → Playground/
│   │   │           ├── 🔵Project/ → Project/
│   │   │           ├── 🔵🔵🔵Projects/ → Projects/
│   │   │           └── 🚫Error/ → Error/
│   │   └── uploads/ → public/uploads/
│   │
│   ├── index.html → index.html
│   ├── about/ → about/
│   │   └── about.html → about.html
│   ├── error/ → error/
│   │   └── error.html → error.html
│   ├── index/ → index/
│   │   └── index.html → index.html
│   ├── playground/ → playground/
│   │   └── playground.html → playground.html
│   ├── project/ → project/
│   │   ├── banjo/ → banjo/
│   │   │   └── index.html → index.html
│   │   ├── … (remaining project pages follow same pattern)
│   └── wp-json/ → content/
│       ├── csskiller/v1/options.json → content/options.json
│       └── wp/v2/
│           ├── pages/ → content/pages/
│           │   ├── 2.json → 2.json
│           │   ├── 55.json → 55.json
│           │   ├── 240.json → 240.json
│           │   └── 308.json → 308.json
│           └── project/ → content/project/
│               ├── 44.json → 44.json
│               ├── 82.json → 82.json
│               └── …
│
│   # Notes:
│   # - csskiller/v1 and wp/v2 subfolders are flattened in content/.
│   # - HTML pages retain identical paths under /about, /project/[slug], etc.
│   # - JS and GLSL mappings preserve file names unless specifically renamed.
│   # End Mapping Summary

```

---

## Application Flow

### 1. Bootstrap Process (`src/start/`)

```javascript
// Initialization order:
1. constructor.js → Browser detection, global setup, design system
2. browser.js → Device capability detection (touch/mouse, WebGL, WebP)
3. firstload.js → Load initial JSON content from /content
4. Main app initialization → Create views and components
```

**Key Global Objects Set:**

```javascript
global = {
  isTouch: 0 | 1,           // Device type (0 = desktop, 1 = touch)
  device: -1 | 0 | 1 | 2 | 3, // Device category
  deviceclass: 'desktop' | 'mobile' | 'tabletL' | 'tabletS',
  webgl: 0 | 1 | 2,          // WebGL version support
  webp: 0 | 1,               // WebP support
  webm: 0 | 1,               // WebM support
  vidauto: 0 | 1,            // Autoplay support
  design: { L: {...}, P: {...} } // Responsive design system
}
```

### 2. Device Detection (`src/start/browser.js`)

**CRITICAL:** Touch detection logic determines mouse vs touch events:

```javascript
const isTouch =
  /Mobi|Andrdoid|Tablet|iPad|iPhone/.test(navigator.userAgent) ||
  ('MacIntel' === navigator.platform && 1 < navigator.maxTouchPoints);
```

**Device Categories:**

- `-1` = Wide desktop (>1780px)
- `0` = Desktop (mouse)
- `1` = Tablet Landscape
- `2` = Tablet Portrait
- `3` = Mobile

### 3. Content Loading System

**JSON Structure:**

- `content/options.json` — Global UI elements (nav, loader, Mbg)
- `content/pages/[id].json` — Page-specific, main class, content
- `content/project/[id].json` — Project page, main class, content

**Loading Process:**

```javascript
src/start/firstload.js → loadRestApi() → fetch JSON → parse → return data
```

### 4. View System (`src/views/`)

Each view extends `Page` class from `src/js/pagemain.js`:

```javascript
class Home extends Page {
  async create(content, main, temp) {
    // Load content into #content div
    // Initialize components
    // Setup intersection observers
  }
  async animIntro() {
    // Entry animations
  }
  async animOut() {
    // Exit animations
  }
}
```

### 5. WebGL Text Rendering (`src/gl/Tt/`)

**MSDF (Multi-channel Signed Distance Field) System:**

1. **Font Assets:**
   - Texture: `/public/PPNeueMontreal-Medium.png`
   - Data: `/public/PPNeueMontreal-Medium.json`

2. **Text Components:**
   - `Tt/` — Standard interactive text with hover effects
   - `TtA/` — Animated text with transitions
   - `TtF/` — Fancy text with special effects

3. **Event Handling:**
   ```javascript
   // CRITICAL: Event binding uses DIRECT PROPERTY ASSIGNMENT
   if (this.touch == 0) {
     this.tt.onmouseenter = (e) => this.inFn(e);
     this.tt.onmousemove = (e) => this.mvFn(e);
     this.tt.onmouseleave = (e) => this.lvFn(e);
   } else {
     this.tt.ontouchstart = (e) => this.inFn(e);
     this.tt.ontouchmove = (e) => this.mvFn(e);
     this.tt.ontouchend = (e) => this.lvFn(e);
   }
   ```

**Character-level Events:**

```javascript
for (const [i, a] of this.chars.entries()) {
  if (this.touch == 0) {
    a.onmouseenter = (e) => this.charFn(e, i);
  } else {
    a.ontouchstart = (e) => this.charFn(e, i);
  }
}
```

---

## Critical Implementation Details

## Event Configuration and Listener Patterns

Event listeners define how the application responds to user actions, custom signals, or system events.  
Using consistent listener patterns improves modularity, performance, and maintainability.

---

### Event Binding Methods

| Method                                                   | Description                                                       | Use Case                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| `element.on<Event> = handler`                            | Assigns a single handler to the DOM event property.               | Simple, single-purpose logic or small scripts.       |
| `element.addEventListener(eventType, handler, options?)` | Adds one or multiple event listeners with optional configuration. | Preferred in all modular, scalable, or complex apps. |

---

### Event Configuration Options

Event listeners accept an optional **configuration object** to refine behavior:

```js
element.addEventListener('scroll', handler, {
  capture: false,
  once: true,
  passive: true,
});
```

### Text Splitting with SplitType

```javascript
// Initialize SplitType on text elements
new window.SplitType(this.tt, { types: 'chars,words' });

// Creates structure:
<div class="word">
  <div class="char">C</div>
  <div class="char">h</div>
  <div class="char">r</div>
  <div class="char">i</div>
  <div class="char">s</div>
</div>;
```

**Common Issue:** Ensure `data-text` attribute matches actual text content to prevent character count mismatches.

### Custom Cursor (`src/components/Mouse.js`)

```javascript
// Activated on desktop only
document.body.onmousemove = (e) => {
  if (this.active == 0) return false;
  this.position[0] = e.clientX;
  this.position[1] = e.clientY;
};
```

---

## Global State & Utilities

### Window-level APIs

```javascript
window.gsap; // GSAP animation engine
window.SplitType; // Text splitting library
window.Lenis; // Smooth scroll instance

// Utility functions (defined in src/start/constructor.js)
window.lerp(p1, p2, t); // Linear interpolation
window.clamp(min, max, num); // Value clamping
window.waiter(ms); // Promise-based delay
```

---

## Development Workflow

### Commands

```bash
bun install            # Install dependencies
bun run dev            # Start dev server (localhost:3000)
bun run dev:debug      # Dev server with debug + sourcemap
bun run dev:verbose    # Dev server with all debug options
bun run build          # Production build
bun run preview        # Preview production build
bun run format         # Format code with Prettier
bun run format:check   # Check formatting
bun run lint           # Lint code with ESLint
```

### File Watching

Vite automatically watches:

- `src/**/*.js` — JavaScript modules
- `src/**/*.glsl` — GLSL shaders
- `*.css` — Stylesheets
- `content/**/*.json` — Content files (via reload)

### Hot Module Replacement (HMR)

- JavaScript changes → Full page reload
- CSS changes → Style injection (no reload)
- JSON content → Manual reload required

---

### Asset Loading

1. **Lazy load images and videos**
2. **Use WebP format when supported** (`global.webp`)
3. **Preload critical fonts** (via FontFaceObserver)
4. **Compress MSDF textures**

---

## Testing Checklist

### Browser Compatibility

- [ ] **Chrome** (latest)
- [ ] **Safari** (latest) - especially for WebGL + MSDF
- [ ] **Firefox** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Mobile Chrome** (Android)

### Device Testing

- [ ] **Desktop** (1920x1080, 1440x900, 2560x1440)
- [ ] **Tablet Landscape** (1024x768)
- [ ] **Tablet Portrait** (768x1024)
- [ ] **Mobile** (390x844, 360x640)
- [ ] **Touch vs Mouse** events correct on each device

### Feature Testing

- [ ] **WebGL** rendering on all browsers
- [ ] **MSDF text** clarity at different zoom levels
- [ ] **Smooth scrolling** with Lenis
- [ ] **Page transitions** and route changes
- [ ] **Custom cursor** on desktop
- [ ] **Touch gestures** on mobile
- [ ] **Responsive layout** at all breakpoints
- [ ] **Font loading** completion before content display

---

## AI Assistant Guidelines

### When Debugging

1. **Always check `/reference-original/`** first for correct implementation
2. **Verify `this.touch` value** - ensure correct device detection
3. **Check WebGL context** - confirm textures and shaders load properly
4. **Test with both WebGL enabled and disabled** - ensure graceful fallbacks

### When Adding Features

1. **Follow existing patterns** from reference implementation
2. **Use vanilla JS** - no frameworks or heavy abstractions
3. **Maintain performance** - 60fps target for animations
4. **Test on mobile, touch and mouse devices** - separate event handlers
5. **Preserve MSDF text rendering** - don't break WebGL text system

### Code Modifications

1. **Preserve existing animations and transitions**
2. **Match the original CSS visual quality**
3. **Test changes immediately** - use `bun run dev` and reload

### Content Updates

1. **Maintain "CHRIS HALL" branding** throughout
2. **Preserve JSON structure**
3. **Verify `data-text` attributes** match actual text content for proper character splitting

---

## Resources

### Documentation

- [OGL Documentation](https://github.com/oframe/ogl) - WebGL library
- [GSAP Documentation](https://greensock.com/docs/) - Animation library
- [Lenis Documentation](https://github.com/studio-freight/lenis) - Smooth scrolling
- [SplitType Documentation](https://github.com/lukePeavey/SplitType) - Text splitting
- [Vite Documentation](https://vitejs.dev/config/) - Build tool

### MSDF Resources

- [MSDF Overview](https://github.com/Chlumsky/msdfgen) - Multi-channel Signed Distance Fields
- [MSDF in WebGL](https://blog.mapbox.com/drawing-text-with-signed-distance-fields-in-mapbox-gl-b0933af6f817)

### Original Project

- **Reference Website:** https://evasanchez.info
- **Local Reference:** `/reference-original/` (read-only)

---

## Recent Updates: Localizing for Non-WordPress

### Changes Made (October 14, 2025)

The project has been updated to work without WordPress dependencies:

1. **`src/start/firstload.js`** - Modified `loadAppData()` function to return simple config object without REST API calls
2. **`src/start/constructor.js`** - Uses the localized `loadAppData` function
3. **`src/js/loads.js`** - Changed `loadRestApi` to `loadAppData` to remove WordPress references while maintaining functionality
4. **`src/js/pagemain.js`** - Already using `loadAppData` in imports and prototypes
5. **`src/views/Home/home.js`** - Already using `this.loadAppData()`
6. **`src/main/index.js`** - Fixed Lenis import issue (importing directly instead of relying on window.Lenis)

### Key Function Changes

The main loading function was renamed from `loadRestApi` to `loadAppData` throughout the codebase to remove WordPress/REST API references. The function now simply returns configuration data:

```javascript
// Old WordPress version
export async function loadRestApi(url, id = '', temp = '') {
  // Made REST API calls to WordPress
}

// New localized version
export async function loadAppData(url, id = '', temp = '') {
  return {
    device: this.main.device,
    webp: this.main.webp,
    webgl: this.main.webgl,
    template: temp,
  };
}
```

---

## 📋 Implementation Roadmap

### Phase 1: Core Features (Week 1-2) 🎯

**Priority: Get to MVP as fast as possible**

#### 1. Homepage + Loader (COMPLETE)

- [ ] Loader animation working
- [ ] Hero section with WebGL text
- [ ] 5/9 WebGL components functional
- [ ] Fixed touch/mouse event bugs
- [ ] Character splitting working correctly
- [ ] Device detection and responsive design implementation working correctly

#### 🔨 2. Index/Projects Listing Page (CURRENT FOCUS)

**File:** `src/views/Projects/` or `src/views/Index/`  
**Content:** `content/pages/240.json` (check slug to confirm)

**Components to Build:**

- [ ] **gl/Roll/** - Horizontal scrolling project carousel
  - Horizontal image/video roll
  - Click to navigate to project detail
  - Smooth WebGL-powered scrolling
- [ ] **gl/Slider/** - Vertical project slider
  - Vertical project display
  - Smooth transitions between projects
  - WebGL effects integration
- [ ] **Project Grid/Listing**
  - Responsive grid layout
  - Mix of images and videos
  - Interactive hover states
  - Links to project detail pages

#### 🔨 3. Project Detail Pages (3 minimum for v1.0)

**Files:** `src/views/Project/project.js`  
**Content:** `content/project/[id].json`

**Must-Have Features:**

- [ ] Individual project layout
- [ ] Image/video galleries
- [ ] Project information display
- [ ] **Infinite scroll transition effect** (signature feature!)
  - Seamless transition from one project to next
  - Feels like one continuous page
  - Smooth GSAP animations between projects

**Projects to Launch With (Pick 3):**

- [ ] Project 1: **\*\***\_\_\_**\*\***
- [ ] Project 2: **\*\***\_\_\_**\*\***
- [ ] Project 3: **\*\***\_\_\_**\*\***

#### 📦 4. Pre-Deployment Prep

- [ ] Choose headless CMS or keep JSON (Recommendation: Keep JSON for v1.0)
- [ ] Verify all internal links use relative paths
- [ ] Test on mobile devices
- [ ] Basic SEO meta tags
- [ ] Update contact email to chris@chrishall.io
- [ ] Remove any debug/console logs

---

### Phase 2: Deployment (Week 3) 🚀

#### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
bun install -g vercel

# Build production version
bun run build

# Deploy to Vercel
vercel deploy --prod
```

**Result:** You get `your-portfolio.vercel.app` URL

#### Step 2: Test Everything

- [ ] All pages load correctly
- [ ] WebGL components work
- [ ] Mobile responsive
- [ ] No broken links
- [ ] All images/videos load
- [ ] Transitions smooth

---

### Phase 3: Domain Migration (Week 4) 🌐

#### Current State:

```
chrisryanhall.com (main) → WordPress on InMotion
chrishall.io → redirects to chrisryanhall.com
chris@chrisryanhall.com → Google Workspace email
```

#### Target State:

```
chrishall.io (MAIN) → New portfolio on Vercel
chrisryanhall.com → redirects to chrishall.io
chris@chrishall.io → Google Workspace email
```

#### Migration Steps:

1. **Connect chrishall.io to Vercel**
   - In Vercel dashboard: Add custom domain `chrishall.io`
   - Copy nameserver settings from Vercel
   - Update nameservers at domain registrar
   - Wait for DNS propagation (24-48 hours max)

2. **Setup chrisryanhall.com Redirect**
   - In Vercel: Add `chrisryanhall.com` as domain
   - Configure 301 redirect to `chrishall.io`

3. **Update Google Workspace Email (Optional)**
   - Go to Google Workspace admin console
   - Add `chrishall.io` as primary domain
   - Create `chris@chrishall.io` alias or mailbox
   - Update MX records for `chrishall.io`
   - Keep paying ~$6-7/month for email

4. **Cancel InMotion Hosting**
   - Export any remaining WordPress data (if needed)
   - Cancel hosting subscription
   - **START SAVING $60/quarter!** 💰

#### Cost Breakdown After Migration:

| Service                  | Before         | After         | Savings           |
| ------------------------ | -------------- | ------------- | ----------------- |
| **Web Hosting**          | $240/year      | **$0/year**   | **$240**          |
| Domain Registration      | $12-15/year    | $12-15/year   | $0                |
| Email (Google Workspace) | $72/year       | $72/year      | $0                |
| **Total Annual**         | **~$324/year** | **~$84/year** | **~$240/year** 💰 |

---

### Phase 4: Polish & Enhancement (Post-Launch) ✨

**After the site is live and saving money, add:**

#### ⏸️ 5. About Page

**File:** `src/views/About/about.js`  
**Content:** `content/pages/55.json` (verify)

**Components:**

- [ ] **gl/TtA/** - Animated text rendering
- [ ] Biography section
- [ ] Experience timeline
- [ ] Awards & press

#### ⏸️ 6. Playground Page

**File:** `src/views/Playground/playground.js`  
**Content:** `content/pages/308.json`

**Components:**

- [ ] **gl/Pg/** - Playground graphics experiments
- [ ] Interactive WebGL demos
- [ ] Experimental features

#### ⏸️ 7. Remaining Project Pages

- [ ] Add 2-5 more projects
- [ ] Perfect infinite scroll transitions
- [ ] Polish animations

#### 🔮 8. Optional Enhancements

- [ ] Add headless CMS (Tina CMS, Sanity, or Forestry)
- [ ] Blog/case studies section
- [ ] Contact form with backend
- [ ] Analytics integration
- [ ] Performance optimization pass
- [ ] Consider migrating to Astro (if needed)

---

## 📊 Success Metrics

**MVP Launch Criteria:**

- 🔨 Homepage working
- 🔨 Loader animation working
- 🔨 Index/Projects listing page complete
- 🔨 3 project detail pages working
- 🔨 Infinite scroll transition effect working
- 🔨 Mobile responsive
- 🔨 All WebGL components functional
- 🔨 Fast load time (<3s FCP)

**When these are done → DEPLOY! Don't wait for perfection.**

---

## 🎯 Current Sprint Focus

**This Week's Goal:** Complete Index page with Roll/Slider components

**Next Steps:**

1. Identify the Index page view file
2. Analyze `gl/Roll/` component structure
3. Analyze `gl/Slider/` component structure
4. Implement project grid/listing layout
5. Connect to project detail pages
6. Test transitions

**Blocked By:** Nothing! Let's go! 🚀

---

# Version History Table

| Version |     Date     |                                                   Description                                                   | Lines Changed |
| :-----: | :----------: | :-------------------------------------------------------------------------------------------------------------: | :-----------: |
| **1.0** | Oct 13, 2025 |                                Initial full architecture + project context guide                                |      N/A      |
| **1.1** | Oct 15, 2025 |           Added maintenance section, condensed shader conversion summary, and version tracking table            |     1–200     |
| **1.2** | Oct 15, 2025 | Fixed Slider.vertex.main.glsl - added missing matrix uniforms (modelViewMatrix, projectionMatrix, normalMatrix) |      N/A      |

> **Note for AI Assistants:**  
> After each modification or addition, append a new row to this table  
> summarizing the update — include estimated affected line range (top to bottom).  
> This ensures full traceability and chronological context continuity.

---

**Note:** This document should be updated whenever:

- Major bugs are fixed
- New features are added
- Architecture changes
- New patterns are established
- Debug strategies evolve

Keep this file current to help future AI assistants (and yourself) understand the project quickly and accurately.
