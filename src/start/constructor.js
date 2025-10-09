import browser from './browser.js';
// Use debug version for enhanced logging
import {
  loadBootstrapData
} from './firstload.debug.js';

import App from '@/main/index.js';
import FontFaceObserver from 'fontfaceobserver';

import gsap from 'gsap';
import SplitType from 'split-type';

import Lenis from 'lenis';

console.log('Constructor.js loaded');

if (window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual';
}

document.documentElement.style.setProperty('--ck_hvar', window.innerHeight + 'px');
document.documentElement.classList.add('lenis-stopped');

if (import.meta.env.DEV == true) {
  document.documentElement.classList.add('dev');
}

const global = browser.browserCheck();
if (browser.glCheck() == false) {
  global.webgl = 0;
  document.documentElement.classList.add('AND');
} 
else {
  if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
    global.webgl = 0;
    document.documentElement.classList.add('AND');
  } 
  else {
    global.webgl = 1;
  }
}

window.gsap = gsap;
gsap.ticker.remove(gsap.updateRoot);

window.SplitType = SplitType;
window.Lenis = Lenis;

global.design = {
  L: {
    w: 1440,
    h: 800,
    multi: 0.4,
    total: 0,
    ratio: 5.56,
    wide: ((window.innerHeight * 10) / window.innerWidth).toFixed(2),
  },
  P: {
    w: 390,
    h: 640,
    multi: 0.4,
    total: 0,
  },
};

// The MULTI: if we don't want the elements to grow, it should be 1
// if we want the rem to grow naturally, it should be set to 0

global.design.L.total = (global.design.L.w / window.innerWidth) * 10;
// Take the difference between both values and apply the multiplier
global.design.L.total = 10 - (10 - global.design.L.total) * global.design.L.multi;
// Use Math.min so the reduction doesn't go too far and maintains the natural rem effect
global.design.L.total = Math.min(10, global.design.L.total);

global.design.P.total = (global.design.P.w / window.innerWidth) * 10;
// Take the difference between both values and apply the multiplier
global.design.P.total = 10 - (10 - global.design.P.total) * global.design.P.multi;
// Use Math.min so the reduction doesn't go too far and maintains the natural rem effect
global.design.P.total = Math.min(10, global.design.P.total);

// MULTI FOR WIDE
// global.design.L.total *= Math.min(1, (global.design.L.wide / global.design.L.ratio) * 1.05);

document.documentElement.style.setProperty('--ck_multiL', global.design.L.total);
document.documentElement.style.setProperty('--ck_multiP', global.design.P.total);

document.documentElement.style.setProperty('--ck_accent', '#fff');
document.documentElement.style.setProperty('--ck_other', '#050505');

if (global.isTouch == 1) {

  document.documentElement.style.setProperty('--ck_hscr', window.screen.height + 'px');
  document.documentElement.style.setProperty('--ck_hvar', window.innerHeight + 'px');
  document.documentElement.style.setProperty(
    '--ck_hmin',
    document.documentElement.clientHeight + 'px',
  );

} 
else {

  document.documentElement.style.setProperty('--ck_hscr', window.innerHeight + 'px');
  document.documentElement.style.setProperty('--ck_hvar', window.innerHeight + 'px');
  document.documentElement.style.setProperty('--ck_hmin', window.innerHeight + 'px');
}

let content = document.querySelector('#content');

console.log('Starting bootstrap process');

// First, load MSDF texture to ensure it's ready before shader initialization
const preloadMSDFTexture = () => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('MSDF texture preloaded successfully');
      resolve(true);
    };
    img.onerror = () => {
      console.warn('Failed to preload MSDF texture, continuing anyway');
      resolve(false);
    };
    img.src = '/PPNeueMontreal-Medium.png';
  });
};

// Load fonts first, then load content
Promise.all([
  preloadMSDFTexture(),
  new FontFaceObserver('montrealbook').load().catch(err => {
    console.warn('Font loading issue (montrealbook):', err);
    return null;
  }),
  new FontFaceObserver('montreal').load().catch(err => {
    console.warn('Font loading issue (montreal):', err);
    return null;
  }),
]).then(() => {
  // Only proceed with bootstrap data after fonts and textures are loaded
  return loadBootstrapData({
    id: content.dataset.id,
    template: content.dataset.template,
  }).catch(err => {
    console.error('Error loading bootstrap data:', err);
    return {}; // Return empty object to avoid breaking the app
  });
}).then((loaded) => {
  console.log('All bootstrap promises resolved');
  console.log('Data loaded:', loaded);
  const M = new App([global, loaded]);
}).catch(err => {
  console.error('Fatal bootstrap error:', err);
});

window.lerp = function (p1, p2, t) {
  return p1 + (p2 - p1) * t;
};

window.clamp = function (min, max, num) {
  return Math.min(Math.max(num, min), max);
};

window.waiter = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
