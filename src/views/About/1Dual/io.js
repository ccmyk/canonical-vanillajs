export default class {
  constructor(obj, device, touch) {
    this.el = obj.el;

    this.pos = obj.pos;
    this.device = device;
    this.touch = touch;
    this.active = 0;
    this.isupdate = 2;
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
    this.anim = gsap.timeline({ paused: true });

    let spty = new window.SplitType(this.el.parentNode.querySelectorAll('p'), { types: 'lines' });

    for (let [i, a] of spty.lines.entries()) {
      this.anim.fromTo(a, { y: 1.2 + 'rem', opacity: 0 }, { y: 0 + 'rem', opacity: 1, duration: 0.3 }, i * 0.2);
    }
    // this.anim.paused()
    this.onResize();
  }

  createAnim() {}

  check(entry, pos) {
    let vis = false;

    if (entry.isIntersecting == true) {
      vis = true;
      this.start();
    } else {
      this.stop(entry);
    }

    return vis;
  }

  start() {
    if (this.ctr.stop == 1 || this.active == 1) {
      return false;
    }
    if (this.device > 1) {
      this.anim.play();
    }
    this.el.classList.add('goout');
    this.active = 1;
  }

  stop(entry) {
    if (this.active == 0) {
      return false;
    }
    console.log(entry);
    this.el.classList.remove('goout');
    this.active = 0;
  }

  initEvents() {}
  removeEvents() {}
  touchScroll() {}
  update(vel, y = 0) {
    if (!this.anim) {
      return false;
    }
    this.ctr.current = y - this.ctr.start + this.h;
    // this.ctr.current = window.clamp(0, this.ctr.limit, this.ctr.current)
    this.ctr.progt = this.ctr.current / this.ctr.limit;
    this.ctr.prog = window.lerp(this.ctr.prog, this.ctr.progt, 0.01);

    this.anim.progress(Math.max(this.ctr.prog, this.ctr.stop));
  }
  onResize(pos) {
    this.h = window.innerHeight;

    this.ctr.start = parseInt((this.el.getBoundingClientRect().y + window.scrollY).toFixed(0));
    this.ctr.limit = parseInt(this.el.clientHeight);

    if (this.anim) {
      this.update(window.scrollY);
    }
  }
}
