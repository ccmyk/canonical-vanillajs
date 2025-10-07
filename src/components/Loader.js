class Loader {
  constructor(main, temp, device) {
    this.main = main;
    this.counter = 0;
    this.index = 0;
    this.temp = { init: temp, pop: temp };
    this.device = device;
  }
  async create() {
    // Fallback loader HTML if template is missing
    const loaderHTML =
      this.temp.init ||
      `
      <div class="loader">
        <div class="loader_bg"></div>
        <div class="loader_cnt">
          <div class="loader_tp">Loading...</div>
        </div>
      </div>
    `;

    document.querySelector('body').insertAdjacentHTML('afterbegin', loaderHTML);

    this.DOM = {
      el: document.documentElement.querySelector('.loader'),
    };

    this.DOM.bg = this.DOM.el.querySelector('.loader_bg');
    this.DOM.cnt = this.DOM.el.querySelector('.loader_cnt');
    this.DOM.n = this.DOM.el.querySelector('.loader_tp');

    // Initialize animation object for number counter
    this.obj = { num: 0 };

    this.createAnim();
  }

  createAnim() {
    this.anim = gsap.timeline({ delay: 0.1, repeat: -1, yoyo: true })
      .to(
        this.DOM.bg,
        {
          scaleX: () => gsap.utils.random(0.8, 1.8),
          scaleY: () => gsap.utils.random(0.8, 1.8),
          duration: () => gsap.utils.random(1.1, 3.8),
          ease: Power1.easeInOut,
        },
        0,
      )
      .to(
        this.DOM.bg,
        {
          rotation: () => gsap.utils.random(-20, 20),
          duration: () => gsap.utils.random(0.8, 2.2),
          ease: Power1.easeInOut,
        },
        2.2,
      );

    let aw = this.DOM.el.querySelectorAll('.Awrite');

    // Safety check - only dispatch events if elements exist
    if (aw && aw.length > 0) {
      this.main.events.anim.detail.state = 0;
      this.main.events.anim.detail.el = aw[0];
      document.dispatchEvent(this.main.events.anim);

      if (aw.length > 1) {
        this.main.events.anim.detail.state = 0;
        this.main.events.anim.detail.el = aw[1];
        document.dispatchEvent(this.main.events.anim);
      }
    }
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

    // Safety check - only dispatch events if elements exist
    if (aw && aw.length > 0) {
      this.main.events.anim.detail.state = 1;
      this.main.events.anim.detail.el = aw[0];
      document.dispatchEvent(this.main.events.anim);

      if (aw.length > 1) {
        this.main.events.anim.detail.state = 1;
        this.main.events.anim.detail.el = aw[1];
        document.dispatchEvent(this.main.events.anim);
      }
    }
    if (this.anim) {
      this.anim.play();
    }
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
    if (this.anim) {
      this.anim.pause();
    }

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
