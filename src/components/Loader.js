class Loader {
  constructor(main, temp, device) {
    console.log('[Loader] constructor', { 
      main: typeof main === 'undefined' ? 'undefined' : 'defined',
      tempType: typeof temp,
      tempValue: typeof temp === 'string' ? temp.substring(0, 50) + '...' : 
                 typeof temp === 'object' ? JSON.stringify(temp).substring(0, 50) + '...' : 
                 'unknown type',
      device 
    });
    
    if (!main) {
      console.error('[Loader] main object is undefined!');
    }
    
    if (!main?.events?.anim) {
      console.error('[Loader] main.events.anim is missing!');
      // Create a dummy event if missing to prevent errors
      main.events = main.events || {};
      main.events.anim = main.events.anim || { detail: { state: 0, el: null } };
    }
    
    this.main = main;
    this.counter = 0;
    this.index = 0;

    const extractHtml = (t) => {
      console.log('[Loader] extractHtml input type:', typeof t);
      if (!t) {
        console.warn('[Loader] template is empty or null!');
        return '';
      }
      if (typeof t === 'string') return t;
      if (typeof t === 'object') {
        // Common keys that may contain HTML
        const result = t.html || t.template || t.loader || t.init || '';
        console.log('[Loader] extracted HTML from object, length:', result.length);
        return result;
      }
      console.warn('[Loader] Unknown template format:', typeof t);
      return '';
    };

    this.temp = { 
      init: extractHtml(temp), 
      pop: extractHtml(temp) 
    };
    
    console.log('[Loader] temp.init length:', this.temp.init.length);
    this.device = device;
  }

  async create() {
    if (!this.temp.init || this.temp.init.length === 0) {
      console.error('[Loader] No loader HTML available to inject!');
      // Create a minimal loader element to prevent failures
      this.temp.init = `<div class="loader">
        <div class="loader_bg"></div>
        <div class="c-vw loader_cnt">
          <div class="loader_tp">000</div>
          <div class="loader_bp">
            <h1 class="Awrite" data-params="0.8">chris hall</h1>
            <h2 class="Awrite" data-params="0.8">interactive designer_portfolio</h2>
          </div>
        </div>
      </div>`;
    }
    
    console.log('[Loader] Loader HTML to inject:', this.temp.init.substring(0, 100) + '...');
    document.querySelector('body').insertAdjacentHTML('afterbegin', this.temp.init);

    this.DOM = {
      el: document.documentElement.querySelector('.loader'),
    };
    console.log('[Loader] create: loader HTML in DOM?', !!this.DOM.el, this.DOM.el);

    if (this.DOM.el) {
      this.DOM.bg = this.DOM.el.querySelector('.loader_bg');
      this.DOM.cnt = this.DOM.el.querySelector('.loader_cnt');
      this.DOM.n = this.DOM.el.querySelector('.loader_tp');
    } else {
      console.error('[Loader] .loader element not found in DOM!');
      // Create an emergency loader element
      const loaderEl = document.createElement('div');
      loaderEl.className = 'loader';
      loaderEl.innerHTML = `
        <div class="loader_bg"></div>
        <div class="c-vw loader_cnt">
          <div class="loader_tp">000</div>
          <div class="loader_bp">
            <h1 class="Awrite">chris hall</h1>
            <h2 class="Awrite">interactive designer_portfolio</h2>
          </div>
        </div>
      `;
      document.body.insertAdjacentElement('afterbegin', loaderEl);
      this.DOM = {
        el: loaderEl,
        bg: loaderEl.querySelector('.loader_bg'),
        cnt: loaderEl.querySelector('.loader_cnt'),
        n: loaderEl.querySelector('.loader_tp')
      };
    }

    this.createAnim();
  }

  createAnim() {
    this.obj = {
      num: 0,
    };
    this.anim = gsap
      .timeline({ paused: true })
      .fromTo(
        this.obj,
        { num: 0 },
        {
          num: 42,
          ease: 'none',
          duration: 2,
          onUpdate: () => {
            let num = this.obj.num.toFixed(0);
            this.calcNum(num);
          },
        },
        0,
      )
      .to(
        this.obj,
        {
          num: 90,
          ease: 'power2.inOut',
          duration: 8,
          onUpdate: () => {
            let num = this.obj.num.toFixed(0);
            this.calcNum(num);
          },
        },
        2.2,
      );

    let aw = this.DOM.el.querySelectorAll('.Awrite');

    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = aw[0];
    document.dispatchEvent(this.main.events.anim);

    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = aw[1];
    document.dispatchEvent(this.main.events.anim);
  }

  calcNum(num) {
    if (num < 10) {
      num = '00' + num;
    } else if (num < 100) {
      num = '0' + num;
    }

    this.DOM.n.innerHTML = num;
  }

  async hide() {}
  async show() {}
  async start() {
    let aw = this.DOM.el.querySelectorAll('.Awrite');

    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = aw[0];
    document.dispatchEvent(this.main.events.anim);

    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = aw[1];
    document.dispatchEvent(this.main.events.anim);
    this.anim.play();
  }

  async showPop() {
    if (this.device > 1) {
    }
  }

  async hidePop() {
    if (this.device > 1) {
      this.DOM.el.remove();
    }
  }

  async hideIntro(template = '') {
    this.anim.pause();

    gsap.to(this.obj, {
      num: 100,
      ease: 'power2.inOut',
      duration: 0.49,
      onUpdate: () => {
        let num = this.obj.num.toFixed(0);
        this.calcNum(num);
      },
    });

    gsap.to(this.DOM.el, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        this.DOM.el.remove();
      },
    });
  }
}

export default Loader;
