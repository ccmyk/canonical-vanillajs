// Libraries loaded via ES modules and exposed globally
import Lenis from 'lenis';
//Basic
import Nav from '@/components/Nav.js';
import Loader from '@/components/Loader.js';

import gl from '../gl/gl.js'; // Re-enabled for proper WebGL operation

import { IS_DEV } from '@/utils/env.js';

//Mouse
import Mouse from '@/components/Mouse.js';

import { createViews } from './view.js';

import { onPopState, onRequest, onChange, newView, resetLinks } from './pop.js';

import { addEvents, onResize } from './events.js';

import { writeFn, writeCt } from './anims.js';

class App {
  constructor(info) {
    console.log('[App] Constructor started with:', {
      hasInfo0: !!info[0],
      hasInfo1: !!info[1],
      hasTexs: info[1] && !!info[1].texs,
      hasTextures: info[1] && !!info[1].textures,
    });

    // Bind methods manually instead of using auto-bind
    this.onPopState = this.onPopState.bind(this);
    this.onRequest = this.onRequest.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.update = this.update.bind(this);

    this.content = document.querySelector('#content');
    this.main = info[0];
    if (info[1]?.textures) {
      this.main.sharedTextures = info[1].textures;
    }
    const fields = info[1]?.fields ?? {};
    const fallbackBaseRaw = typeof fields.base == 'string' ? fields.base : '';
    const trimmedFallback = fallbackBaseRaw.replace(/\/+$/, '');
    const isAbsoluteFallback = /^https?:\/\//.test(trimmedFallback);
    const normalizedFallback = isAbsoluteFallback
      ? trimmedFallback
      : trimmedFallback
        ? trimmedFallback.startsWith('/')
          ? trimmedFallback
          : `/${trimmedFallback}`
        : '';

    const resolvedBase =
      (this.main.base ?? '').replace(/\/+$/, '') ||
      (isAbsoluteFallback ? normalizedFallback : `${window.location.origin}${normalizedFallback}`);

    this.main.base = resolvedBase;
    this.main.pathPrefix = typeof this.main.pathPrefix == 'string' ? this.main.pathPrefix : normalizedFallback;
    this.main.apiRoot = typeof this.main.apiRoot == 'string' ? this.main.apiRoot : normalizedFallback;
    this.main.assetRoot = this.main.pathPrefix || '';
    this.main.origin = window.location.origin;
    this.main.template = this.main.assetRoot || fields.template;

    this.main.screen = {
      w: window.innerWidth,
      h: window.innerHeight,
    };

    this.FR = 1e3 / 60;

    this.speed = 0;
    this.wheeling = 0;
    this.isclick = 0;
    this.searching = 0;
    this.isload = 1;
    this.scry = 0;

    this.resizevar = '';
    this.url = window.location.pathname;

    // Make sure texs exists
    if (info[1] && !info[1].texs && info[1].textures) {
      console.log('[App] Adding texs from textures for backward compatibility');
      info[1].texs = info[1].textures;
    }

    console.log(
      '[App] Initializing with texs:',
      info[1].texs ? Object.keys(info[1].texs).length + ' textures' : 'undefined'
    );
    this.initApp(info[1], info[1].texs);
  }

  async initApp(temps, texs) {
    //Events
    this.addEvents();

    //Lenis
    this.lenis = new Lenis({
      wheelEventsTarget: document.documentElement,
      lerp: 0.04,
      duration: 0.8,
      smoothWheel: !this.main.isTouch,
      smoothTouch: false,
      normalizeWheel: true,
    });

    this.lenis.stop();

    if (this.main.isTouch == 0) {
      this.createScrollBar();
    }

    this.createScrollCheck();
    //Loader
    const hasLoaderTemplate = typeof temps.loader === 'string' && temps.loader.trim().length > 0;
    const shouldRunLoader = hasLoaderTemplate && !this.main.hasSeenLoader;
    this.shouldRunLoader = shouldRunLoader;
    let time = shouldRunLoader ? 1400 : 0;
    if (IS_DEV && shouldRunLoader) {
      time = 1400;
    }
    this.template = this.content.dataset.template;

    console.log('[App] temps.loader:', temps.loader);
    if (hasLoaderTemplate) {
      this.loader = new Loader(this.main, temps.loader, this.main.device);
      await this.loader.create();
      if (shouldRunLoader) {
        this.loader.start();
      } else {
        this.loader.skip();
      }
    } else {
      this.loader = null;
    }

    let firsttemp = undefined;
    if (temps.main) {
      firsttemp = temps.main;
    }

    //PHIDE
    this.pHide = document.createElement('div');
    this.pHide.className = 'pHide';
    document.querySelector('body').appendChild(this.pHide);

    //Pages
    this.createViews();
    if (this.template.includes('lcl')) {
      this.template = this.template.substring(0, this.template.length - 3);
    }

    //Page
    this.page = this.pages.get(this.template);
    await this.page.create(this.content, this.main, firsttemp);

    //Nav
    this.nav = new Nav(this.main);
    this.nav.create(temps.nav);

    //Lets play

    this.update();

    await this.timeout(260);

    let funcgl = '';
    //GL
    if (this.main.webgl == 1) {
      this.gl = new gl(this.main);
      funcgl = this.gl.create(texs);
    }

    if (!this.main.isTouch && typeof Mouse == 'function') {
      this.mouse = new Mouse(this.main);
    }

    await Promise.all([funcgl, this.timeout(time)]);

    if (this.gl) {
      this.gl.createTemp(this.template);
    }

    this.firstView();
  }

  async firstView() {
    //Mouse
    if (this.mouse) {
      this.mouse.create();
      this.mouse.start();
      this.mouse.reset();
    }

    await this.timeout(11);
    if (this.shouldRunLoader && this.loader) {
      await this.loader.hideIntro(this.template);
    }
    if (this.gl && this.gl.loader && this.gl.loader.animstart) {
      this.gl.loader.animstart.play();
    }
    const postLoaderDelay = this.shouldRunLoader ? 820 : 0;
    await this.timeout(postLoaderDelay);

    if (this.gl) {
      this.gl.show();
    }

    if (!this.main.hasSeenLoader) {
      this.main.hasSeenLoader = true;
      const storageKey = this.main.loaderFlagKey || 'ch_loader_seen';
      try {
        window.sessionStorage.setItem(storageKey, '1');
      } catch (error) {
        if (IS_DEV) {
          console.warn('[App] Unable to persist loader flag:', error);
        }
      }
    }

    //State es para diferenciar entre el firstView y un PopState
    this.page.show();
    let state = await this.page.start(0);

    if (this.main.device < 2) {
      this.nav.show();
    } else {
      this.nav.show();
    }

    this.lenis.start();
    this.addControllers();

    this.isload = 0;
  }

  controlScroll(state) {
    if (!this.page) {
      return false;
    }
    if (state == 0) {
      this.lenis.stop();
      this.page.stopScroll();
    } else {
      this.lenis.start();
      this.page.startScroll();
    }
  }

  update(time) {
    if (this.lenis) {
      this.lenis.raf(time);
    }

    if (this.page) {
      this.page.update(this.speed, this.lenis.scroll);
    }

    if (this.nav) {
      this.nav.update(time);
    }

    if (this.mouse) {
      this.mouse.update();
    }
    if (this.gl) {
      this.gl.update(time, this.speed, this.lenis.scroll);
    }

    gsap.updateRoot(time / 1000);

    this.upid = window.requestAnimationFrame(this.update);
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  addControllers() {
    if (this.video) {
      this.video.resetLinks();
    }
    this.resetLinks();
  }

  createScrollCheck() {
    if (this.main.isTouch == 0) {
      this.scrollFn = () => {
        this.speed = this.lenis.velocity;

        if (this.page) {
          this.page.animIosScroll();
        }

        if (Math.abs(this.speed) < 0.3) {
          this.pHide.style.pointerEvents = 'none';
        } else {
          this.pHide.style.pointerEvents = 'all';
        }

        if (this.speed < 0) {
          document.documentElement.classList.add('scroll-up');
        } else if (this.speed > 0) {
          document.documentElement.classList.remove('scroll-up');
        }

        if (this.lenis.targetScroll == 0) {
          document.documentElement.classList.remove('scroll-start');
        } else if (this.lenis.targetScroll > 0) {
          document.documentElement.classList.add('scroll-start');
        }
      };
    } else {
      this.scrollFn = () => {
        this.speed = this.lenis.velocity;
        if (Math.abs(this.speed) < 0.01) {
          this.pHide.style.pointerEvents = 'none';
        } else {
          this.pHide.style.pointerEvents = 'all';
        }

        if (!this.page) {
          return false;
        }

        if (this.page.scroll.target > this.lenis.targetScroll) {
          document.documentElement.classList.add('scroll-up');
        } else if (this.page.scroll.target < this.lenis.targetScroll) {
          document.documentElement.classList.remove('scroll-up');
        }

        if (this.lenis.targetScroll == 0) {
          document.documentElement.classList.remove('scroll-start');
        } else if (this.lenis.targetScroll > 0) {
          document.documentElement.classList.add('scroll-start');
        }

        if (this.page) {
          this.page.scroll.target = this.lenis.targetScroll;

          this.page.animIosScroll();
        }
      };
    }

    this.lenis.on('scroll', this.scrollFn);
  }

  createScrollBar() {}

  getRnd(max) {
    return Math.floor(Math.random() * max);
  }
}
//Start
App.prototype.createViews = createViews;

//Events
App.prototype.addEvents = addEvents;
App.prototype.onResize = onResize;

//Pop
App.prototype.onPopState = onPopState;
App.prototype.onChange = onChange;
App.prototype.onRequest = onRequest;
App.prototype.newView = newView;

App.prototype.resetLinks = resetLinks;

//Anims

App.prototype.writeFn = writeFn;
App.prototype.writeCt = writeCt;

//Rest

export default App;
