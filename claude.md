# Claude.md - AI Assistant Context Guide

**Last Updated:** October 13, 2025
**Project:** Chris Hall Portfolio
**Developer:** Chris Hall  
**Original Source:** `/reference-original/`

---

## Project Overview

This is a high-performance, visually sophisticated portfolio website featuring complex WebGL animations and text effects. Originally built as a WordPress theme, it has been migrated to a static, framework-free architecture while preserving all animations and interactions.

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
  "styling": "CSS",
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
│   ├── app.js                    # Application entry point
│   ├── start/                    # Bootstrap & initialization
│   │   ├── constructor.js        # Main constructor & global setup
│   │   ├── browser.js            # Device/browser detection
│   │   └── firstload.js          # Initial content loading
│   ├── main/                     # Core application logic & routing
│   ├── views/                    # Page-specific view controllers
│   │   ├── Home/                 # Home page scripts
│   │   ├── About/                # About page scripts
│   │   ├── Projects/             # Index (Projects) page scripts
│   │   ├── Project/              # Project page scripts
│   │   └── Playground/           # Playground page scripts
│   ├── gl/                       # WebGL components
│   │   ├── Bg/                   # Bg component
│   │   ├── Loader/               # Loading component
│   │   ├── Media/                # Media component
│   │   ├── Pg/                   # Pg component (Playground page only)
│   │   ├── Roll/                 # Roll component (Index page only)
│   │   ├── Slider/               # Slider component (Index page only)
│   │   ├── Tt/                   # Tt component (MSDF)
│   │   ├── TtA/                  # TtA component (About page only)
│   │   ├── TtF/                  # TtF component
│   │   ├── create.js             # WebGL Initiation
│   │   ├── els.js                # WebGL elements
│   │   ├── events.js             # Event handling
│   │   ├── gl.js                 # WebGL logic
│   │   └── ios.js                # WebGL Intersection observer
│   ├── components/               # UI components
│   │   ├── Loader.js             # Loader component
│   │   ├── Mouse.js              # Custom component
│   │   └── Nav.ja                # Nav component
│   ├── ios/                      # Lazy
│   │   ├── lazyImg.js            # Lazy image loading
│   │   └── lazyVideo.js          # Lazy video loading
│   ├── js/                       # Shared JavaScript utilities
│   └── utils/                    # Environment configuration
│
├── reference-original/           # ⚠️ READ-ONLY original WordPress theme
│   └── wp-content/themes/src/   # Reference implementation (emoji folders)
│
├── index.html                    # SPA shell
├── index.css                     # Global styles
├── vite.config.js                # Build configuration
├── package.json                  # Dependencies
├── jsconfig.json                 # JS/TS configuration
└── claude.md                     # This file
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
  ("MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints);
```

**Device Categories:**
- `-1` = Wide desktop (>1780px)
- `0` = Desktop (mouse)
- `1` = Tablet Landscape
- `2` = Tablet Portrait
- `3` = Mobile

### 3. Content Loading System

**JSON Structure:**
- `content/options.json` — Global UI elements (loader, nav, footer)
- `content/pages/[id].json` — Page-specific content
- `content/project/[id].json` — Project details

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

### Event Listener Pattern

**⚠️ IMPORTANT:** The codebase uses **direct property assignment** for event handlers, NOT `addEventListener()`:

```javascript
// ✅ CORRECT (matches reference)
element.onmouseenter = (e) => handler(e);

// ❌ WRONG (causes issues)
element.addEventListener('mouseenter', handler);
```

**Why?** The original CSS Killer codebase uses this pattern throughout, and mixing patterns can cause:
- Duplicate event listeners
- Touch events on desktop browsers
- Mouse events on mobile devices

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
</div>
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
window.gsap        // GSAP animation engine
window.SplitType   // Text splitting library
window.Lenis       // Smooth scroll instance

// Utility functions (defined in src/start/constructor.js)
window.lerp(p1, p2, t)          // Linear interpolation
window.clamp(min, max, num)     // Value clamping
window.waiter(ms)               // Promise-based delay
```

### CSS Custom Properties

```css
/* Responsive scaling */
--ck_multiL: /* Landscape multiplier */;
--ck_multiP: /* Portrait multiplier */;

/* Viewport heights */
--ck_hvar: /* Variable height (innerHeight) */;
--ck_hscr: /* Screen height */;
--ck_hmin: /* Minimum height */;

/* Colors */
--ck_accent: #fff;
--ck_other: #050505;
```

### Responsive Design System

```javascript
global.design = {
  L: {                    // Landscape/Desktop
    w: 1440,
    h: 800,
    multi: 0.4,
    ratio: 5.56,
    wide: /* calculated */
  },
  P: {                    // Portrait/Mobile
    w: 390,
    h: 640,
    multi: 0.4
  }
}
```

---

## Reference Implementation

### Original WordPress Theme

Located at `/reference-original/wp-content/themes/src/`

**Folder naming convention:**
- Original uses **emoji folders** (e.g., `gl🌊🌊🌊/`, `💬/`, `components🦾🦾🦾/`)
- Current project uses **English names** (e.g., `gl/`, `Tt/`, `components/`)

**Emoji to English Mapping:**

```
reference-original:                current project:
├── gl🌊🌊🌊/                      ├── gl/
│   ├── 💬/           →           │   ├── Tt/
│   ├── 🎞️/                       │   ├── Media/
│   ├── 🏜️/                       │   ├── Bg/
│   └── ...                       │   └── ...
├── components🦾🦾🦾/              ├── components/
│   ├── Mouse🐭/      →           │   ├── Mouse.js
│   └── ...                       │   └── ...
├── start🏁🏁🏁/                  ├── start/
│   ├── browser🕸️.js →           │   ├── browser.js
│   └── ...                       │   └── ...
└── ...                           └── ...
```

**When debugging:** Always check the reference implementation for correct patterns and behavior.

---

## Recent Bug Fixes

### 1. Touch Events on Desktop (FIXED - Oct 12, 2025)

**Problem:**
- Desktop Safari showed `touchstart`, `touchend`, `touchmove` instead of `mouseenter`, `mouseleave`, `mousemove`
- `.char` elements had BOTH mouse AND touch events attached

**Root Cause:**
- Using `addEventListener()` instead of direct property assignment
- Not checking `this.touch` value before attaching char events

**Solution:**
```javascript
// src/gl/Tt/base.js lines 220-232
if (this.touch == 0) {
  if (this.tt) {
    this.tt.onmouseenter = (e) => this.inFn(e);
    this.tt.onmousemove = (e) => this.mvFn(e);
    this.tt.onmouseleave = (e) => this.lvFn(e);
  }
} else {
  if (this.tt) {
    this.tt.ontouchstart = (e) => this.inFn(e);
    this.tt.ontouchmove = (e) => this.mvFn(e);
    this.tt.ontouchend = (e) => this.lvFn(e);
  }
}

// Character events (lines 244-250)
if (this.chars) {
  for (const [i, a] of this.chars.entries()) {
    if (this.touch == 0) {
      a.onmouseenter = (e) => this.charFn(e, i);
    } else {
      a.ontouchstart = (e) => this.charFn(e, i);
    }
  }
}
```

### 2. Text Character Splitting (FIXED - Oct 12, 2025)

**Problem:**
- "Chris" was being split into 4 characters instead of 5

**Root Cause:**
- `content/pages/2.json` had duplicate "Hall" in both first and last name fields

**Solution:**
- Updated JSON to have correct first/last name values
- SplitType now correctly splits "Chris" into 5 chars and "Hall" into 4 chars

---

## Known Issues & TODO

### Current Issues
✅ Hero text event listeners (FIXED)
✅ Character splitting (FIXED)
⚠️ WebGL canvas sizing on some devices (needs testing)
⚠️ Performance optimization needed for complex animations

### To Do
- [ ] Complete About page implementation
- [ ] Projects grid and detail pages
- [ ] Playground page features
- [ ] Mobile optimization and testing
- [ ] Cross-browser compatibility testing
- [ ] Performance audit (FCP, LCP, WebGL frame rate)
- [ ] SEO meta tags and social sharing
- [ ] Accessibility improvements (keyboard navigation, screen readers)

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

## Debugging Guide

### WebGL Issues

**Check for WebGL support:**
```javascript
// In console:
document.documentElement.classList.contains('AND') // true = WebGL disabled
global.webgl // 0 = disabled, 1 = WebGL1, 2 = WebGL2
```

**Common WebGL Errors:**
1. **Shader compilation errors** → Check console for GLSL syntax
2. **Texture loading failures** → Verify MSDF .png and .json files exist
3. **Context loss** → Check `renderer.gl.getExtension('WEBGL_lose_context')`

**Debug Tools:**
```javascript
// src/gl/Tt/base.js:
console.log('[Tt base.js] this.touch value:', this.touch, 'for element:', this.text);
```

### Device Detection

**Check device type:**
```javascript
// In console:
global.isTouch       // 0 = desktop/mouse, 1 = touch device
global.device        // -1, 0, 1, 2, 3
global.deviceclass   // 'desktop', 'mobile', 'tabletL', 'tabletS'
```

**Browser checks:**
```javascript
navigator.platform          // 'MacIntel', 'Win32', etc.
navigator.maxTouchPoints    // 0 on non-touch, >0 on touch devices
navigator.userAgent         // Full UA string
```

### Content Loading

**Monitor JSON loading:**
```javascript
// Network tab → Filter by 'json'
// Check: content/options.json, content/pages/2.json, etc.
```

**Verify content structure:**
```javascript
// In console after page load:
document.querySelector('#content').dataset.template // 'home', 'about', etc.
document.querySelector('#content').dataset.id       // '2', '55', etc.
```

### Animation Debugging

**GSAP timeline inspection:**
```javascript
// In console:
window.gsap.globalTimeline.getChildren()
window.gsap.utils.toArray('.animated-element').forEach(el => {
  console.log(el, gsap.getProperty(el, 'x'), gsap.getProperty(el, 'opacity'));
});
```

**Lenis scroll state:**
```javascript
// In console:
document.documentElement.classList.contains('lenis-smooth')   // Smooth scroll active
document.documentElement.classList.contains('lenis-stopped')  // Scroll locked
window.lenis.dimensions                                       // Scroll dimensions
```

### Safari-specific Debugging

**Event listeners inspection:**
- Open Safari DevTools → Elements tab
- Click on element in DOM tree
- Look for "Event" badges next to elements
- Click badge to see attached event handlers

---

## Code Style & Conventions

### JavaScript

```javascript
// Class naming: PascalCase
class HomePage extends Page {}

// File naming: camelCase for utilities, PascalCase for components
src/js/pagemain.js
src/views/Home/home.js
src/components/Mouse.js

// Use 'const' for immutable, 'let' for mutable
const config = { ... };
let currentIndex = 0;

// Arrow functions for callbacks
element.onclick = (e) => this.handler(e);

// Template literals for strings with variables
console.log(`Loading page: ${id}`);

// Object property shorthand
return { isTouch, device, webgl };

// Async/await for promises
async create() {
  const data = await this.loadContent();
}
```

### CSS

```css
/* BEM-like naming */
.home_hero {}
.home_hero-title {}
.cnt_hold {}

/* Custom properties for theming */
:root {
  --ck_accent: #fff;
  --ck_other: #050505;
}

/* Responsive with custom properties */
font-size: calc(var(--ck_multiL) * 1rem);
```

### GLSL

```glsl
// Shader files: .glsl, .vs, .fs extensions
// Imported via vite-plugin-glsl

// Vertex shader
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = /* ... */;
}

// Fragment shader
precision highp float;
uniform sampler2D tMap;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tMap, vUv);
}
```

---

## Performance Best Practices

### WebGL Optimization

1. **Reuse geometries and materials**
   ```javascript
   // ✅ Good
   const geometry = new Plane(gl);
   const material = new Program(gl, { ... });
   
   // ❌ Bad - creating new geometry for each instance
   ```

2. **Batch render calls**
   ```javascript
   // Render once per frame in update loop
   if (this.stopt === 0) {
     this.renderer.render({ scene: this.scene, camera: this.camera });
   }
   ```

3. **Dispose unused resources**
   ```javascript
   removeEvents() {
     this.renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
     this.canvas?.remove();
   }
   ```

### Animation Performance

1. **Use GSAP's quickTo for frequent updates**
   ```javascript
   this.lightX = gsap.quickTo('.mouse', 'x', { duration: 0.05 });
   // Update without creating new tweens
   this.lightX(targetX);
   ```

2. **Pause timelines when not visible**
   ```javascript
   this.animin?.pause();
   this.animout?.pause();
   ```

3. **Use `will-change` sparingly**
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

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
2. **Compare event listener patterns** - use direct property assignment, not `addEventListener()`
3. **Verify `this.touch` value** - ensure correct device detection
4. **Check WebGL context** - confirm textures and shaders load properly
5. **Test with both WebGL enabled and disabled** - ensure graceful fallbacks

### When Adding Features

1. **Follow existing patterns** from reference implementation
2. **Use vanilla JS** - no frameworks or heavy abstractions
3. **Maintain performance** - 60fps target for animations
4. **Test on touch and mouse devices** - separate event handlers
5. **Preserve MSDF text rendering** - don't break WebGL text system

### Code Modifications

1. **Read the relevant SKILL.md** if working with specific file types
2. **Preserve existing animations and transitions**
3. **Match the original CSS Killer visual quality**
4. **Keep code readable** - add comments for complex WebGL/animation logic
5. **Test changes immediately** - use `bun run dev` and reload

### Content Updates

1. **⚠️ DO NOT regenerate `content/options.json`** unless absolutely necessary
2. **Keep relative URLs** - all paths use `/index/`, `/about/`, etc. (not absolute URLs)
3. **Maintain "CHRIS HALL" branding** throughout
4. **Preserve JSON structure**
5. **Verify `data-text` attributes** match actual text content for proper character splitting

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

## Project Status

**Current Phase:** Fast-track to deployment - Save $240/year!  
**Last Major Update:** Oct 12, 2025 - Fixed event listener bugs, created deployment roadmap  
**Next Milestone:** Deploy v1.0 within 2-3 weeks

---

## 🚀 Fast-Track Deployment Strategy

### Motivation
**Current Cost:** $60/quarter ($240/year) for InMotion hosting + WordPress  
**Target Cost:** $0/year (Vercel free tier)  
**Savings:** $240/year starting immediately after deployment!

### Timeline Overview

```
Week 1-2: Build core pages (Index + 3 Projects)
   ↓
Week 3: Deploy to Vercel (FREE hosting)
   ↓
Week 4: Migrate domains, cancel InMotion hosting
   ↓
Result: SAVE $240/year! 🎉
```

---

## 📋 Implementation Roadmap

### Phase 1: Core Features (Week 1-2) 🎯

**Priority: Get to MVP as fast as possible**

#### ✅ 1. Homepage + Loader (COMPLETE)
- [x] Loader animation working
- [x] Hero section with WebGL text
- [x] 5/9 WebGL components functional
- [x] Fixed touch/mouse event bugs
- [x] Character splitting working correctly

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
- [ ] Project 1: _______________
- [ ] Project 2: _______________
- [ ] Project 3: _______________

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

| Service | Before | After | Savings |
|---------|--------|-------|----------|
| **Web Hosting** | $240/year | **$0/year** | **$240** |
| Domain Registration | $12-15/year | $12-15/year | $0 |
| Email (Google Workspace) | $72/year | $72/year | $0 |
| **Total Annual** | **~$324/year** | **~$84/year** | **~$240/year** 💰 |

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
- ✅ Homepage working
- ✅ Loader animation working
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

**Note:** This document should be updated whenever:
- Major bugs are fixed
- New features are added
- Architecture changes
- New patterns are established
- Debug strategies evolve

Keep this file current to help future AI assistants (and yourself) understand the project quickly and accurately.
