import browser from './browser.js';
import loadAppData from './firstload.js';
import App from '../main/index.js';
import FontFaceObserver from 'fontfaceobserver';
import gsap from 'gsap';
import SplitType from 'split-type';

if (window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual';
}

async function bootstrap() {
  document.documentElement.style.setProperty('--ck_hvar', window.innerHeight + 'px');
  document.documentElement.classList.add('lenis-stopped');

  if (import.meta.env.DEV == true) {
    document.documentElement.classList.add('dev');
  }

  function normalizePath(pathname) {
    if (pathname === '' || pathname === '/') return '/';
    return pathname.endsWith('/') ? pathname : pathname + '/';
  }

  function isKnownInitialRoute(pathname, content) {
    if (!content) return false;
    const template = content.dataset?.template;
    const normalized = normalizePath(pathname);

    const baseRoutes = new Map([
      ['home', ['/']],
      ['projects', ['/index/']],
      ['about', ['/about/']],
      ['playground', ['/playground/']],
      ['error', ['/error/', '/404/', '/404.html']],
    ]);

    if (template === 'project') {
      return normalized.startsWith('/project/');
    }

    if (baseRoutes.has(template)) {
      return baseRoutes.get(template).includes(normalized);
    }

    return false;
  }

  async function loadErrorContent() {
    try {
      const response = await fetch('/error/index.html', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      if (!response.ok) {
        console.warn('[constructor] Error fallback fetch failed:', response.status);
        return null;
      }
      const wrapper = document.createElement('div');
      wrapper.innerHTML = await response.text();
      const errorContent = wrapper.querySelector('#content');
      if (!errorContent) {
        return null;
      }
      const root = document.querySelector('#content');
      if (root) {
        root.replaceWith(errorContent);
      } else {
        document.body.appendChild(errorContent);
      }
      errorContent.dataset.template = 'error';
      errorContent.dataset.id = errorContent.dataset.id || '1';
      return errorContent;
    } catch (error) {
      console.error('[constructor] Failed to load error fallback:', error);
      return null;
    }
  }

  const global = browser.browserCheck();
  if (browser.glCheck() == false) {
    global.webgl = 0;
    document.documentElement.classList.add('AND');
  } else {
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
      global.webgl = 0;
      document.documentElement.classList.add('AND');
    } else {
      global.webgl = 1;
    }
  }

  window.gsap = gsap;
  gsap.ticker.remove(gsap.updateRoot);

  window.SplitType = SplitType;

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

  global.design.L.total = (global.design.L.w / window.innerWidth) * 10;
  global.design.L.total = 10 - (10 - global.design.L.total) * global.design.L.multi;
  global.design.L.total = Math.min(10, global.design.L.total);

  global.design.P.total = (global.design.P.w / window.innerWidth) * 10;
  global.design.P.total = 10 - (10 - global.design.P.total) * global.design.P.multi;
  global.design.P.total = Math.min(10, global.design.P.total);

  document.documentElement.style.setProperty('--ck_multiL', global.design.L.total);
  document.documentElement.style.setProperty('--ck_multiP', global.design.P.total);
  document.documentElement.style.setProperty('--ck_accent', '#fff');
  document.documentElement.style.setProperty('--ck_other', '#050505');

  if (global.isTouch == 1) {
    document.documentElement.style.setProperty('--ck_hscr', window.screen.height + 'px');
    document.documentElement.style.setProperty('--ck_hvar', window.innerHeight + 'px');
    document.documentElement.style.setProperty('--ck_hmin', document.documentElement.clientHeight + 'px');
  } else {
    document.documentElement.style.setProperty('--ck_hscr', window.innerHeight + 'px');
    document.documentElement.style.setProperty('--ck_hvar', window.innerHeight + 'px');
    document.documentElement.style.setProperty('--ck_hmin', window.innerHeight + 'px');
  }

  const LOADER_FLAG_KEY = 'ch_loader_seen';
  try {
    global.loaderFlagKey = LOADER_FLAG_KEY;
    global.hasSeenLoader = window.sessionStorage.getItem(LOADER_FLAG_KEY) === '1';
  } catch (error) {
    global.loaderFlagKey = LOADER_FLAG_KEY;
    global.hasSeenLoader = false;
  }

  let content = document.querySelector('#content');
  if (!isKnownInitialRoute(window.location.pathname, content)) {
    const fallback = await loadErrorContent();
    if (fallback) {
      content = fallback;
    } else {
      content.dataset.template = 'error';
      content.dataset.id = content.dataset.id || '1';
    }
  }

  Promise.all([
    loadAppData.loadAppData({
      device: global.device,
      webp: global.webp,
      id: content.dataset.id,
      template: content.dataset.template,
      webgl: global.webgl,
    }),
    new FontFaceObserver('montrealbook').load(),
    new FontFaceObserver('montreal').load(),
  ]).then((loaded) => {
    const M = new App([global, loaded[0]]);
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
}

bootstrap();
