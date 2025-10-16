import { Camera, Plane, Triangle, Mesh, Geometry, Texture, Text, Renderer, Transform, Program, Post, Vec2 } from 'ogl';

import Loader from './Loader/base.js';
import LoaderF from './Loader/Loader.fragment.main.glsl?raw';
import LoaderV from './Loader/Loader.vertex.main.glsl?raw';

import Base from './Media/base.js';
import fractalF from './Media/Media.fragment.main.glsl?raw';
import fractalV from './Media/Media.vertex.main.glsl?raw';

import Bg from './Bg/base.js';
import BgF from './Bg/Bg.fragment.main.glsl?raw';
import BgV from './Bg/Bg.vertex.main.glsl?raw';

import Tt from './Tt/base.js';
import textF from './Tt/Tt.fragment.msdf.glsl?raw';
import textV from './Tt/Tt.vertex.msdf.glsl?raw';

import TtF from './TtF/base.js';
import textFF from './TtF/TtF.fragment.msdf.glsl?raw';
import textpF from './TtF/TtF.fragment.parent.glsl?raw';

import TtA from './TtA/base.js';
import textFA from './TtA/TtA.fragment.msdf.glsl?raw';
import textpA from './TtA/TtA.fragment.parent.glsl?raw';

import Sl from './Slider/base.js';
import SlF from './Slider/Slider.fragment.main.glsl?raw';
import SlV from './Slider/Slider.vertex.main.glsl?raw';
import SlPF from './Slider/Slider.fragment.parent.glsl?raw';

import Roll from './Roll/base.js';
import SlSF from './Roll/Roll.fragment.single.glsl?raw';
import SlVF from './Roll/Roll.vertex.single.glsl?raw';

import PG from './Pg/base.js';
import PGs from './Pg/Pg.fragment.main.glsl?raw';
import PGv from './Pg/Pg.vertex.main.glsl?raw';

export async function createMSDF() {
  const assetRoot = this.main.assetRoot || '';
  const mapTexSrc = assetRoot ? `${assetRoot}/PPNeueMontreal-Medium.png` : '/PPNeueMontreal-Medium.png';
  const jsonTexSrc = assetRoot ? `${assetRoot}/PPNeueMontreal-Medium.json` : '/PPNeueMontreal-Medium.json';

  let rt = [];

  let fJson = await (await fetch(jsonTexSrc)).json();

  rt.push(fJson);

  return rt;
}

export async function createAssets(texs) {
  const fntAss = await this.createMSDF();

  this.fontMSDF = fntAss[0];

  const assetRoot = this.main.assetRoot || '';
  const mapTexSrc = assetRoot ? `${assetRoot}/PPNeueMontreal-Medium.png` : '/PPNeueMontreal-Medium.png';
  this.fontTex = await this.loadImage(mapTexSrc);

  const video = document.createElement('video');
  video.isPlaying = false;
  video.style.display = 'none';
  video.autoplay = true;
  video.setAttribute('webkit-playsinline', 'webkit-playsinline');
  video.setAttribute('playsinline', 'playsinline');
  video.muted = true;
  video.loop = true;
  video.dataset.auto = true;
  video.preload = 'auto'; // Ensure video preloading

  // Helper function to safely load a video with fallback
  const safeLoadVideo = async (vidElement, src) => {
    if (!src || typeof src != 'string') {
      console.warn('safeLoadVideo: a valid video source was not provided.');
      return this.loadImage('/public/favicon.svg'); // Fallback to a static image
    }
    try {
      console.log('[safeLoadVideo] Attempting to load video:', src);
      const response = await fetch(src, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(`Video source not found or not accessible: ${src}`);
        return this.loadImage('/public/favicon.svg'); // Fallback to a static image
      }
      return this.loadVideo(vidElement, src);
    } catch (e) {
      console.warn(`Error loading video ${src}:`, e);
      return this.loadImage('/public/favicon.svg'); // Fallback to a static image
    }
  };

  let promiseswait = [];
  let lnt = Object.values(texs).length - 1;

  for (let a in texs) {
    if (Array.isArray(texs[a])) {
      for (let [b, u] of texs[a].entries()) {
        if (texs[a][b].i) {
          promiseswait.push(this.loadImage(texs[a][b].i));
        } else if (texs[a][b].v) {
          let vidclone = video.cloneNode();
          promiseswait.push(safeLoadVideo(vidclone, texs[a][b].v));
        }
      }
    } else {
      if (texs[a].i) {
        promiseswait.push(this.loadImage(texs[a].i));
      } else if (texs[a].v) {
        let vidclone = video.cloneNode();
        promiseswait.push(safeLoadVideo(vidclone, texs[a].v));
      }
    }
  }

  this.texs = [];
  for (let [i, a] of promiseswait.entries()) {
    this.texs.push(await Promise.resolve(a));
  }
}

export async function createTex(el = null, video = null) {}

export async function createEls(el = null) {
  const temp = el.dataset.temp || 'base';
  const pos = el.dataset.oi;

  if (temp == 'tt' || temp == 'foot' || temp == 'about') {
    const canvasContainer = el.parentNode.querySelector('.cCover');

    const containerBounds = canvasContainer.getBoundingClientRect();

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(Math.max(window.devicePixelRatio, 1), 2),
      width: containerBounds.width,
      height: containerBounds.height,
    });
    const { gl } = renderer;

    gl.canvas.classList.add('glF');
    canvasContainer.appendChild(gl.canvas);

    const cam = this.createCamera(gl);

    let text = '';
    let siz = el.dataset.m;

    if (temp == 'foot') {
      text = new Text({
        font: this.fontMSDF,
        text: el.dataset.text,
        align: 'center',
        letterSpacing: el.dataset.l,
        size: siz,
        lineHeight: 1,
      });
    } else if (temp == 'about') {
      let br = ' ';
      let br2 = ' ';
      let w = (6.2 * el.dataset.m) / 0.6;
      let ls = el.dataset.l;
      let l = 0.995;
      if (this.main.device < 2) {
        br = '\n';
        br2 = '\n';
        w = 13.1;
        l = 1.035;
      }
      if (this.main.device == 2) {
        w = 7.5;
        l = 1.01;
        ls = -0.015;
        siz *= 0.77;
      }
      text = new Text({
        font: this.fontMSDF,
        text:
          'Enthusiastic about graphic design, typography, and the dynamic areas of motion and web-based animations.' +
          br +
          'Specialized in translating brands into unique and immersive digital' +
          br2 +
          'user experiences.',

        width: w,
        align: 'center',
        letterSpacing: ls,
        size: siz,
        lineHeight: l,
      });
    } else {
      text = new Text({
        font: this.fontMSDF,
        text: el.dataset.text,
        align: 'center',
        letterSpacing: el.dataset.l,
        size: siz,
        lineHeight: 1,
      });
    }

    //📐📐📐📐📐📐📐

    const geometry = new Geometry(gl, {
      position: { size: 3, data: text.buffers.position },
      uv: { size: 2, data: text.buffers.uv },
      id: { size: 1, data: text.buffers.id },
      index: { data: text.buffers.index },
    });
    geometry.computeBoundingBox();

    //📺📺📺📺📺📺📺
    const texTx = new Texture(gl, {
      generateMipmaps: false,
    });

    texTx.image = this.fontTex;

    let program = '';

    if (temp == 'foot') {
      // Get the innerHTML length with a safer approach
      const oielElement = el.parentNode.querySelector('.Oiel');
      const charCount = oielElement ? oielElement.innerHTML.length : 10; // Fallback to 10 if element not found

      // Ensure we have a valid character count
      const safeCharCount = Math.max(1, charCount);

      let shaderMod = textFF;
      // Replace the placeholder with the character count
      shaderMod = shaderMod.replaceAll('PITO', safeCharCount);

      console.log(`Initializing foot shader with ${safeCharCount} characters`);

      program = new Program(gl, {
        vertex: textV,
        fragment: shaderMod,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: 0 },
          tMap: { value: texTx },
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
      });
    } else if (temp == 'about') {
      // Get the innerHTML length with a safer approach
      const oielElement = el.parentNode.querySelector('.Oiel');
      const charCount = oielElement ? oielElement.innerHTML.length : 10; // Fallback to 10 if element not found

      // Ensure we have a valid character count
      const safeCharCount = Math.max(1, charCount);

      let shaderMod = textFA;
      // Replace the placeholder with the character count
      shaderMod = shaderMod.replaceAll('PITO', safeCharCount);

      console.log(`Initializing about shader with ${safeCharCount} characters`);

      program = new Program(gl, {
        vertex: textV,
        fragment: shaderMod,
        uniforms: {
          uTime: { value: 0 },
          uStart: { value: 1 },
          uColor: { value: 0 },
          tMap: { value: texTx },
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
      });
    } else {
      const oielElement = el.parentNode.querySelector('.Oiel');
      const charCount = oielElement ? oielElement.innerHTML.length : 10; // Fallback to 10 if element not found

      const safeCharCount = Math.max(1, charCount);

      let shaderMod = textF;

      shaderMod = shaderMod.replaceAll('PITO', safeCharCount);

      console.log(`Initializing title shader with ${safeCharCount} characters`);

      program = new Program(gl, {
        vertex: textV,
        fragment: shaderMod,
        uniforms: {
          uTime: { value: 0 },
          uKey: { value: -2 },
          uPower: { value: 1 },
          uPowers: { value: [] },
          uWidth: { value: [] },
          uHeight: { value: [] },
          uCols: { value: 1.5 },
          uStart: { value: 1 },
          uColor: { value: 0 },
          tMap: { value: texTx },
          uMouse: { value: new Vec2(0, 0) },
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
      });
    }

    const mesh = new Mesh(gl, { geometry, program });

    const scene = new Transform();
    mesh.setParent(scene);

    let post = '';
    if (temp == 'foot') {
      mesh.position.y = text.height * 0.58;

      post = new Post(gl);
      post.addPass({
        fragment: textpF,
        uniforms: {
          uTime: { value: 0 },
          uStart: { value: 0 },
          uMouseT: { value: 0 },
          uMouse: { value: 0 },
          uOut: { value: 1 },
        },
      });
    } else if (temp == 'about') {
      mesh.position.y = text.height * 0.58;

      post = new Post(gl);
      post.addPass({
        fragment: textpA,
        uniforms: {
          uTime: { value: 0.4 },
          uStart: { value: -1 },
          uMouseT: { value: 0.4 },
          uMouse: { value: -1 },
        },
      });
    } else {
      mesh.position.y = text.height * 0.58;
    }

    // Determine text color based on background
    // Check if page has black background (Bg component exists)
    const hasBgComponent = document.querySelector('.Oi[data-temp="bg"]') !== null;

    if (el.dataset.white) {
      // If data-white is set, use white (1) when there's a black background
      // Otherwise use black (0) for default light background
      program.uniforms.uColor.value = hasBgComponent ? 1 : 0;
    }

    const obj = {
      el,
      pos,
      renderer,
      mesh,
      text,
      post,
      scene,
      cam,
      touch: this.main.isTouch,
      canvas: gl.canvas,
    };

    if (temp == 'foot') {
      return new TtF(obj);
    } else if (temp == 'about') {
      return new TtA(obj);
    } else {
      return new Tt(obj);
    }
  } else if (temp == 'bg' || temp == 'loader') {
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const { gl } = renderer;
    const geometry = new Triangle(gl);

    if (temp == 'loader') {
      gl.canvas.id = 'glLoader';

      document.body.appendChild(gl.canvas);

      const program = new Program(gl, {
        vertex: LoaderV,
        fragment: LoaderF,
        uniforms: {
          uTime: { value: 0 },
          uStart1: { value: 0.5 },
          uStart0: { value: 1 },
          uStart2: { value: 1 },
          uStartX: { value: 0 },
          uStartY: { value: 0.1 },
          uMultiX: { value: -0.4 },
          uMultiY: { value: 0.45 },
          uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        },
      });

      const mesh = new Mesh(gl, { geometry, program: program });

      const obj = {
        el,
        pos,
        renderer,
        mesh,
        canvas: gl.canvas,
      };

      return new Loader(obj);
    } else {
      gl.canvas.id = 'glBg';
      const mbgElement = document.querySelector('.Mbg');

      mbgElement.parentNode.insertBefore(gl.canvas, mbgElement.nextSibling);

      const mbgBounds = mbgElement.getBoundingClientRect();
      renderer.setSize(mbgBounds.width, mbgBounds.height);

      const program = new Program(gl, {
        vertex: BgV,
        fragment: BgF,
        uniforms: {
          uTime: { value: 0 },
          uStart1: { value: 0.5 },
          uStart0: { value: 1 },
          uStart2: { value: 1 },
          uStartX: { value: 0 },
          uStartY: { value: 0.1 },
          uMultiX: { value: -0.4 },
          uMultiY: { value: 0.45 },
          uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });

      const obj = {
        el,
        pos,
        renderer,
        mesh,
        canvas: gl.canvas,
      };

      return new Bg(obj);
    }
  } else if (temp == 'roll') {
    const parent = document.querySelector('.cRoll');
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: parent.offsetWidth,
      height: parent.offsetHeight,
    });
    const { gl } = renderer;
    //Slider
    const scene = new Transform();

    gl.canvas.classList.add('glRoll');
    parent.appendChild(gl.canvas);

    //📐📐📐📐📐📐📐

    const geometry = new Triangle(gl);

    const textures = [];
    let medias = parent.parentNode.querySelectorAll('video,img');

    for (let [i, a] of medias.entries()) {
      let texture = new Texture(gl, {
        generateMipmaps: false,
      });

      let url = a.dataset.src || a.dataset.oi;
      console.log(`[Roll] Attempting to load media: ${url}`);
      if (!url || typeof url != 'string') {
        console.warn('No valid source found for element:', a);
        continue; // Skip this iteration if the url is invalid
      }

      let exists = this.texs.find((element) => element.src == url);

      if (url.includes('.mp4')) {
        if (exists) {
          texture.image = exists;
        } else {
          texture.image = await this.loadVideo(a, url);
        }
      } else {
        if (exists) {
          texture.image = exists;
        } else {
          texture.image = await this.loadImage(url);
        }
      }

      textures.push(texture);
    }

    const program = new Program(gl, {
      vertex: SlVF,
      fragment: SlSF,
      uniforms: {
        uStart: { value: 0 },
        uEnd: { value: 0 },
        uPos: { value: 0 },
        uChange: { value: 0 },
        tMap: { value: textures[0] },
        tMap2: { value: textures[0] },
        uCover: { value: new Vec2(0, 0) },
        uTextureSize: { value: new Vec2(0, 0) },
        uTextureSize2: { value: new Vec2(0, 0) },
      },
    });
    let mesh = new Mesh(gl, { geometry, program });

    const obj = {
      el,
      pos,
      renderer,
      mesh,
      medias,
      textures,
      canvas: gl.canvas,
    };

    return new Roll(obj);
  } else if (temp == 'slider') {
    //SliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSlider

    //Inits

    // Get the canvas container (.cCover) for proper sizing
    const canvasContainer = el.parentNode.querySelector('.cCover');
    const containerBounds = canvasContainer.getBoundingClientRect();

    // Set up responsive canvas sizing for slider
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(Math.max(window.devicePixelRatio, 1.5), 2),
      // Ensure the canvas size matches the container size for proper rendering
      width: containerBounds.width || el.offsetWidth,
      height: containerBounds.height || el.offsetHeight,
    });

    const { gl } = renderer;

    const scene = new Transform();

    gl.canvas.classList.add('glSlider');
    canvasContainer.appendChild(gl.canvas);

    const cam = this.createCamera(gl);

    const geometry = new Plane(gl, {
      heightSegments: 1,
      widthSegments: 1,
    });

    //👓👓👓👓👓👓👓

    const textures = [];
    const meshes = [];

    let medias = el.parentNode.querySelectorAll('video,img');

    for (let [i, a] of medias.entries()) {
      let texture = new Texture(gl, {
        generateMipmaps: false,
      });

      let url = a.dataset.src || a.dataset.oi;
      console.log(`[Slider] Attempting to load media: ${url}`);
      if (!url || typeof url != 'string') {
        console.warn('No valid source found for element:', a);
        continue; // Skip this iteration if the url is invalid
      }

      let exists = this.texs.find((element) => element.src == url);

      if (url.includes('.mp4')) {
        if (exists) {
          texture.image = exists;
        } else {
          texture.image = await this.loadVideo(a, url);
        }
      } else {
        if (exists) {
          texture.image = exists;
        } else {
          texture.image = await this.loadImage(url);
        }
      }

      textures.push(texture);
      const program = new Program(gl, {
        vertex: SlV,
        fragment: SlF,
        uniforms: {
          uStart: { value: 0 },
          uTime: { value: 0 },
          tMap: { value: texture },
          uCover: { value: new Vec2(0, 0) },
          uTextureSize: { value: new Vec2(0, 0) },
        },
      });
      let mesh = new Mesh(gl, { geometry, program });

      mesh.setParent(scene);
      meshes.push(mesh);
    }
    let post = null;
    if (1 == 1) {
      post = new Post(gl);
      post.addPass({
        fragment: SlPF,
        uniforms: {
          uTime: { value: 0 },
          uStart: { value: 0 },
          uHover: { value: 0 },
        },
      });
    }
    //Single

    const obj = {
      el,
      pos,
      renderer,
      scene,
      meshes,
      medias,
      textures,
      post,
      cam,
      canvas: gl.canvas,
      dev: this.main.device,
    };
    return new Sl(obj);
  } else if (temp == 'pg') {
    //PgPgPgPgPgPg

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: window.innerWidth,
      height: el.innerHeight,
    });
    //📐📐📐📐📐📐📐

    const { gl } = renderer;

    gl.canvas.classList.add('glPlay');
    document.body.appendChild(gl.canvas);
    //📽️📽️📽️📽️📽️📽️📽️📽️
    const cam = this.createCamera(gl);
    const scene = new Transform();

    const geometry = new Plane(gl, {
      heightSegments: 1,
      widthSegments: 1,
    });

    //📺📺📺📺📺📺📺
    const texture = new Texture(gl, {
      generateMipmaps: false,
    });

    const obj = {
      el,
      pos,
      cam,
      renderer,
      texture,
      scene,
      geometry,
      canvas: gl.canvas,
      touch: this.main.isTouch,
      device: this.main.device,
      rev: this.main.events.anim,
    };

    return new PG(obj);
  } else if (temp == 'pgel') {
    const obj = {
      el,
      pgid: el.dataset.pg,
      pos: document.querySelector('.Oi-pg').dataset.oi,
    };
    return obj;
  } else {
    //MediaMediaMediaMediaMediaMedia

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: el.offsetWidth,
      height: el.offsetHeight,
    });
    //📐📐📐📐📐📐📐

    const { gl } = renderer;

    gl.canvas.classList.add('glMedia');
    el.parentNode.appendChild(gl.canvas);

    const geometry = new Triangle(gl, {
      heightSegments: 1,
      widthSegments: 1,
    });

    //📺📺📺📺📺📺📺
    const texture = new Texture(gl, {
      generateMipmaps: false,
    });

    let url = el.dataset.src;
    console.log(`[Media] Attempting to load media: ${url}`);
    if (!url || typeof url != 'string') {
      console.warn('No valid source found for element:', el);
      // Create a placeholder texture to avoid a crash
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      texture.image = canvas;
    } else {
      let exists = this.texs.find((element) => element.src == url);

      if (url.includes('.mp4')) {
        if (exists) {
          texture.image = exists;
        } else {
          texture.image = await this.loadVideo(el.parentNode.querySelector('video'), url);
        }
      } else {
        if (exists) {
          texture.image = exists;
        } else {
          texture.image = await this.loadImage(url);
        }
      }
    }

    const program = new Program(gl, {
      vertex: fractalV,
      fragment: fractalF,
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uStart1: { value: 0.5 },
        tMap: { value: texture },
        uCover: { value: new Vec2(0, 0) },
        uTextureSize: { value: new Vec2(texture.image.naturalWidth, texture.image.naturalHeight) },
        uMouse: { value: new Vec2(0, 0) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const obj = {
      el,
      pos,
      mesh,
      renderer,
      texture,
      canvas: gl.canvas,
      touch: this.main.isTouch,
    };

    return new Base(obj);
  }
}
