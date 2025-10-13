export default class {
  constructor(obj, device, touch) {
    this.el = obj.el;

    this.pos = obj.pos;
    this.device = device;
    this.touch = touch;

    this.DOM = {
      el: obj.el,
      img: obj.el.parentNode.querySelector('img'),
    };

    this.active = 0;
    this.isupdate = 3;

    this.create();
  }

  create() {}
  check(entry, pos) {
    let vis = false;
    if (entry.isIntersecting == undefined) {
      return false;
    }
    vis = entry.isIntersecting;
    if (vis == true) {
      this.start();
      vis = entry.isIntersecting;

      if (this.DOM.img.getAttribute('src')) {
        return -1;
      }

      let img = new Image();
      let url = '';
      if (this.DOM.img.dataset.lazy) {
        url = this.DOM.img.dataset.lazy;
      }

      let gif = 0;
      if (/\.(gif)$/.test(url)) {
        gif = 1;
      }

      this.DOM.img.onload = () => {
        delete this.DOM.img.dataset.lazy;
        this.DOM.img.classList.add('Ldd');
      };
      img.onload = () => {
        this.DOM.img.src = url;
      };
      img.src = url;

      if (gif == 1) {
        this.DOM.img.src = url;
        this.DOM.img.classList.add('Ldd');
      }

      vis = -1;
    } else if (vis == false) {
      this.stop();
    }
    return vis;
  }

  start() {
    this.DOM.img.classList.add('ivi');
    this.active = 1;
  }
  stop() {
    this.DOM.img.classList.remove('ivi');
    this.active = 0;
  }

  initEvents() {}
  removeEvents() {}
  update() {}

  onResize(scrollCurrent) {
    this.h = window.innerHeight;
    this.max = this.el.clientHeight;

    this.checkobj = {
      firstin: Math.min(this.h, this.el.clientHeight) * 0.92,
      firstout: this.h * 0.92,
      secout: this.el.clientHeight * -1,
      limit: this.el.clientHeight,
    };
  }
}
