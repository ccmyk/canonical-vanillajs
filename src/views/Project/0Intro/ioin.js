export default class {
  constructor(obj, device) {
    this.el = obj.el;

    this.pos = obj.pos;
    this.device = device;
    this.isupdate = 2;

    this.DOM = {
      el: obj.el,
      scr: document.querySelector('.backto'),
    };

    this.active = 0;
    this.postit = 0;
    this.isstarted = 0;
    this.h = window.innerHeight;

    this.ctr = {
      actual: 0,
      current: 0,
      limit: 0,
      start: 0,
      prog: 0,
      progt: 0,
      stop: 0,
    };

    this.create();
  }

  async create() {
    this.anim = gsap
      .timeline({ paused: true, onComplete: () => {} })
      .to(this.DOM.scr, { y: 5 + 'vh', opacity: 0, duration: 0.4 }, 0);
  }

  check(entry, pos) {
    let vis = false;

    if (entry.isIntersecting != null) {
      if (entry.isIntersecting == true) {
        vis = true;
        this.start();
      } else {
        this.stop(entry);
      }
    }
    return vis;
  }

  start() {
    if (this.active == 1) {
      return false;
    }
    this.active = 1;
  }

  stop(entry) {
    if (this.active == 0) {
      return false;
    }
    if (entry.boundingClientRect.y < 12) {
      this.anim.play();
    } else {
    }
    this.active = 0;
  }

  initEvents() {}
  removeEvents() {}

  update(speed, pos = 0) {
    this.ctr.current = pos;

    this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current);

    this.ctr.progt = this.ctr.current / this.ctr.limit;
    this.ctr.prog = window.lerp(this.ctr.prog, this.ctr.progt, 0.1);
    this.anim.progress(this.ctr.prog.toFixed(4));
  }

  onResize(pos) {
    this.h = window.innerHeight;
    let bound = this.DOM.el.getBoundingClientRect();
    this.ctr.start = 0;
    this.ctr.limit = bound.height;
  }
}
