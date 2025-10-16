class Loader {
  constructor(main, temp, device) {
    this.main = main;
    this.counter = 0;
    this.index = 0;
    this.temp = { init: temp, pop: temp };
    this.device = device;
  }
  async create() {
    document.querySelector('body').insertAdjacentHTML('afterbegin', this.temp.init);

    this.DOM = {
      el: document.querySelector('.loader'),
    };

    this.DOM.bg = this.DOM.el.querySelector('.loader_bg');
    this.DOM.cnt = this.DOM.el.querySelector('.loader_cnt');
    this.DOM.n = this.DOM.el.querySelector('.loader_tp');

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
        0
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
        2.2
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

  skip() {
    if (!this.DOM?.el) {
      return;
    }
    this.DOM.el.remove();
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
