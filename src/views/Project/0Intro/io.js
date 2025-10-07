export default class {
  constructor(obj, device, animev) {
    this.el = obj.el;

    this.pos = obj.pos;
    this.device = device;
    this.isupdate = 2;
    this.animev = animev;

    this.DOM = {
      el: obj.el,
      scr: obj.el.parentNode.querySelector('.top_sc'),
      cnt: obj.el.parentNode.querySelector('.cnt'),
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
    let mult = 2.4;

    this.animnolerp = gsap
      .timeline({
        paused: true,
        onComplete: () => {
          this.active = -1;
          this.anim.play();

          let div = document.createElement('div');
          div.classList.add('nxtPr');

          this.el.parentNode.classList.add('notrans');

          div.appendChild(this.el.parentNode.querySelector('.cnt_n').cloneNode(true));
          div.appendChild(this.el.parentNode.querySelector('.cnt_t').cloneNode(true));

          this.animev.detail.el = div;
          this.animev.detail.url = this.el.dataset.url;
          document.dispatchEvent(this.animev);
        },
      })
      .to(this.el, { opacity: 0, duration: 0.5 }, 0);

    this.anim = gsap
      .timeline({
        paused: true,
        onReverseComplete: () => {
          this.ctr.progt = 0;
          this.ctr.prog = 0;
        },
        onComplete: () => {},
      })
      .to(this.DOM.scr, { y: 30 + 'vh', opacity: 0, duration: 0.5 * mult }, 0)
      .fromTo(this.DOM.cnt, { y: 30 + 'vh' }, { y: 0 + 'vh', duration: 0.35 * mult }, 0.15 * mult);
  }

  check(entry, pos) {
    if (this.active == -1) {
      return false;
    }
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
      this.anim.reverse();
    }
    this.active = 0;
  }

  initEvents() {}
  removeEvents() {}

  update(speed, pos = 0) {
    if (this.active != 1) {
      return false;
    }
    this.ctr.current = this.ctr.start - pos;

    this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current);

    this.ctr.progt = 1 - this.ctr.current / this.ctr.limit;
    this.ctr.prog = window.lerp(this.ctr.prog, this.ctr.progt, 0.015);
    this.anim.progress(this.ctr.prog.toFixed(4));
    this.animnolerp.progress(this.ctr.progt);
  }

  onResize(pos) {
    this.h = window.innerHeight;
    let bound = this.DOM.el.getBoundingClientRect();
    this.ctr.start = parseInt(bound.y + window.scrollY);
    this.ctr.limit = this.h;
  }
}
