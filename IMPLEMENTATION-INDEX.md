# Index Page Implementation Guide

**Status:** Components Ready - HTML Integration Required  
**Date:** October 14, 2025

---

## Components Status

### ✅ WebGL Components (Complete)
- **Roll Component** - [src/gl/Roll/](src/gl/Roll/) - Horizontal scrolling carousel 
- **Slider Component** - [src/gl/Slider/](src/gl/Slider/) - Vertical project slider
- **Both integrated** in [src/gl/els.js:459-640](src/gl/els.js#L459-L640)

### ✅ View Controller (Complete)  
- **Projects View** - [src/views/Projects/projects.js](src/views/Projects/projects.js)
- Handles accordion/list toggle
- Manages project animations

### ⏸️ HTML Structure (Needs Verification)
- **Index HTML** - [index/index.html](index/index.html) - Points to `data-id="55"`
- **Content JSON** - [content/pages/55.json](content/pages/55.json) - Contains textures + HTML

---

## Roll Component (`data-temp="roll"`)

### Purpose
Horizontal scrolling carousel for project thumbnails

### HTML Structure Required
```html
<div class="cRoll">
  <!-- Parent container for the canvas -->
  <div class="cRoll_inner">
    <!-- Media elements that Roll will load as textures -->
    <img data-src="/path/to/image.jpg" />
    <video data-src="/path/to/video.mp4"></video>
    <!-- ... more media -->
  </div>
</div>

<!-- The trigger element with Roll config -->
<div class="Oi" data-temp="roll" data-oi="0"></div>
```

### Implementation ([src/gl/els.js:459-538](src/gl/els.js#L459-L538))
1. Finds `.cRoll` parent container
2. Creates WebGL renderer with `glRoll` canvas class
3. Uses **Triangle geometry** (fullscreen quad)
4. Loads all `video` and `img` elements as textures
5. Creates shader program with dual texture support for crossfade
6. Returns `Roll` instance

### Key Features
- Horizontal scroll-based navigation
- Smooth transitions between project images/videos
- Touch and mouse interaction support

---

## Slider Component (`data-temp="slider"`)

### Purpose  
Vertical sliding effect for individual project slides

### HTML Structure Required
```html
<div class="Oi Oi-slider" data-temp="slider" data-oi="X">
  <div class="cCover">
    <!-- Canvas will be appended here -->
  </div>
  <!-- Media elements -->
  <img data-src="/path/to/image.jpg" />
  <video data-src="/path/to/video.mp4"></video>
</div>
```

### Implementation ([src/gl/els.js:541-640](src/gl/els.js#L541-L640))
1. Creates renderer sized to element
2. Adds `glSlider` canvas class
3. Appends canvas to `.cCover` element
4. Uses **Plane geometry** for each slide
5. Creates multiple meshes (one per media element)
6. Supports both parent and individual shader modes
7. Returns `Slider` instance

### Key Features
- Vertical sliding animations
- Multiple slides per element
- Scroll-triggered transitions
- Supports images and videos

---

## Projects View Logic

### Toggle System ([src/views/Projects/projects.js:48-74](src/views/Projects/projects.js#L48-L74))

Two display modes:
1. **Accordion Mode** (`.toAc`) - Uses **Slider** component (state = 0)
2. **List Mode** (`.toLs`) - Uses **Roll** component (state = 1)

```javascript
// Switching to List Mode (Roll)
this.components.list.onclick = () => {
  this.components.accordion.classList.remove('act');
  
  this.main.events.anim.detail.state = 1; // Switch to Roll
  this.main.events.anim.detail.style = 1;
  document.dispatchEvent(this.main.events.anim);
  
  this.components.list.classList.add('act');
};

// Switching to Accordion Mode (Slider)
this.components.accordion.onclick = () => {
  this.components.list.classList.remove('act');
  
  this.main.events.anim.detail.state = 0; // Switch to Slider
  this.main.events.anim.detail.style = 1;
  document.dispatchEvent(this.main.events.anim);
  
  this.components.accordion.classList.add('act');
};
```

### Change Slides Handler ([src/gl/gl.js:92-95](src/gl/gl.js#L92-L95))

```javascript
if(a.name == 'Roll'){
  a.changeState(st) // st = 0 or 1
}
```

---

## Integration Checklist

### ✅ Step 1: Verify HTML Structure
Check [content/pages/55.json](content/pages/55.json) contains:
- `.cRoll` container for horizontal carousel
- `.toAc` and `.toLs` toggle buttons
- Multiple `.Oi` elements with `data-temp="slider"`
- Proper media elements (`<img>`, `<video>`) with `data-src` attributes

### ✅ Step 2: Verify View Registration  
Check [src/main/view.js](src/main/view.js) includes:
```javascript
import Projects from '@/views/Projects/projects.js'

export function createViews() {
  this.pages = new Map()
  // ...
  this.pages.set('projects', new Projects(this.main))
}
```

### ✅ Step 3: Test Navigation
1. Navigate to `/index/` 
2. Check browser console for:
   - `[Roll] Attempting to load media: ...`
   - `[Slider] Creating slider for element ...`
3. Verify WebGL canvases render:
   - `.glRoll` canvas in `.cRoll`
   - `.glSlider` canvases in `.Oi-slider` elements

### ✅ Step 4: Test Interactions
- Click `.toAc` button → Should show Slider (accordion mode)
- Click `.toLs` button → Should show Roll (list mode)
- Scroll page → Both components should update based on scroll position
- Hover/click projects → Should navigate to project detail pages

---

## Debugging Tips

### Roll Not Showing
1. Check `.cRoll` exists in DOM
2. Verify `data-temp="roll"` on trigger element
3. Check media elements have valid `data-src` attributes
4. Look for texture loading errors in console

### Slider Not Showing
1. Check `.Oi` elements have `data-temp="slider"`
2. Verify `.cCover` exists as child
3. Check media elements load correctly
4. Verify shader compilation (check WebGL errors)

### Toggle Not Working
1. Check `.toAc` and `.toLs` buttons exist
2. Verify `this.main.events.anim` is defined
3. Check `changeSlides()` is called in gl.js
4. Look for JavaScript errors in Projects view

---

## File Reference Map

### Core Implementation Files
```
src/
├── gl/
│   ├── Roll/
│   │   ├── base.js              # Roll component logic
│   │   ├── position.js          # Scroll positioning
│   │   ├── Roll.fragment.single.glsl  # Fragment shader
│   │   └── Roll.vertex.single.glsl    # Vertex shader
│   ├── Slider/
│   │   ├── base.js              # Slider component logic
│   │   ├── position.js          # Slide positioning
│   │   ├── Slider.fragment.main.glsl    # Main fragment shader
│   │   ├── Slider.fragment.parent.glsl  # Parent fragment shader
│   │   └── Slider.vertex.main.glsl      # Vertex shader
│   ├── els.js                   # Component creation (lines 459-640)
│   ├── gl.js                    # Main GL controller with changeSlides()
│   └── ios.js                   # Intersection observer setup
│
├── views/Projects/
│   ├── projects.js              # Projects view controller
│   └── 0Intro/index.js         # Intro animation
│
└── main/
    ├── index.js                 # App initialization
    ├── events.js                # Event handling
    └── view.js                  # View registration

content/
└── pages/
    └── 55.json                  # Index page content + textures

index/
└── index.html                   # Entry point (data-id="55", data-template="projects")
```

### Reference Files (Read-Only)
```
reference-original/wp-content/themes/src/
├── gl🌊🌊🌊/
│   ├── 🎢/                      # Original Roll implementation
│   ├── 🎞️/                      # Original Slider implementation
│   └── els.js                  # Original component creation
│
└── views👁️👁️👁️/
    └── 🔵🔵🔵Projects/          # Original Projects view
```

---

## Next Steps

1. **Verify HTML Structure** - Check that [content/pages/55.json](content/pages/55.json) has the correct HTML with `.cRoll`, `.toAc`, `.toLs`, and slider elements

2. **Test in Browser** - Navigate to `/index/` and check:
   - DevTools console for loading messages
   - WebGL canvases render correctly  
   - Toggle buttons switch between modes

3. **Debug Issues** - If components don't appear:
   - Use browser DevTools to inspect DOM structure
   - Check console for WebGL/shader errors
   - Verify texture loading completes

4. **Polish Animations** - Once basic functionality works:
   - Adjust transition timing
   - Fine-tune scroll thresholds
   - Test on mobile devices

---

## Questions?

- Review [claude.md](claude.md) for project architecture
- Compare with original files in `reference-original/`
- Check console logs for detailed loading information

