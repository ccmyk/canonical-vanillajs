import lazyImg from '@/ios/lazyImg.js';
import lazyVideo from '@/ios/lazyVideo.js';

export function buildThresholdList(numSteps) {
  var thresholds = [];

  for (var i = 1.0; i <= numSteps; i++) {
    var ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

export function checkIo(pos, entry) {
  let check = false;
  check = this.ios[pos].class.check(entry, this.scroll.current);
  if (!this.ios[pos].class.isupdate) {
    return false;
  }
  if (check == true) {
    if (this.ios[pos].class.isupdate == 1) {
      let i = this.iosupdaters.indexOf(pos);

      if (i == -1) {
        this.iosupdaters.push(pos);
      }
    } else if (this.ios[pos].class.isupdate == 2) {
      let i = this.updaters.indexOf(pos);

      if (i == -1) {
        this.updaters.push(pos);
      }
    } else {
      this.observer.unobserve(entry.target);
    }
  } else {
    if (this.ios[pos].class.isupdate == 1) {
      let i = this.iosupdaters.indexOf(pos);
      if (i != -1) {
        this.iosupdaters.splice(i, 1);
      }
    } else if (this.ios[pos].class.isupdate == 2) {
      let i = this.updaters.indexOf(pos);
      if (i != -1) {
        this.updaters.splice(i, 1);
      }
    }
  }
}

export function callIos() {
  this.callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.target.dataset.no || !entry.target.dataset.io || this.isVisible == 0) {
        return false;
      }

      const pos = entry.target.dataset.io;
      if (this.ios[pos]) {
        if (this.ios[pos].class) {
          if (this.ios[pos].class.check) {
            this.checkIo(pos, entry);
          }
        } else {
          if (entry.isIntersecting) {
            this.inViewAddClass(entry);
          } else {
            entry.target.parentNode.classList.remove('inview');
            entry.target.parentNode.classList.remove('okF');
          }
        }
      }
    });
  };

  let root = null;

  if (this.main.isTouch) {
    this.optionsob = {
      root: root,
      threshold: [0, 1],
    };
  } else {
    this.optionsob = {
      root: root,
      threshold: [0, 1],
    };
  }

  this.observer = new IntersectionObserver(this.callback, this.optionsob);

  if (this.ios) {
    this.ios.forEach((el) => {
      if (el.class) {
        //el noob es por si no quieres que lo observe
        if (el.class.noob == 1) {
          return false;
        }
      }
      this.observer.observe(el.el);
    });
  }
}

export function createIos() {
  this.DOM.ios = this.DOM.el.querySelectorAll('.iO');
  if (this.DOM.ios) {
    let animobj = '';
    for (let [index, anim] of this.DOM.ios.entries()) {
      animobj = this.iO(index, anim);

      this.ios.push(animobj);
    }
  }
}

export async function newIos(fromel = null) {
  let newios = null;
  if (fromel == null) {
    newios = document.body.querySelectorAll('.iO');
  } else {
    newios = fromel.querySelectorAll('.iO');
  }

  if (newios.length == 0) {
    return false;
  }

  newios = Array.prototype.slice.call(newios);
  let oldios = Array.prototype.slice.call(this.DOM.ios);

  for (let [i, a] of this.DOM.ios.entries()) {
    let foundio = newios.find((element) => element == a);

    if (foundio == undefined) {
      let pos = a.dataset.io;
      if (this.ios[pos]) {
        if (this.ios[pos].class) {
          if (this.ios[pos].class.isupdate == 1) {
            let i = this.iosupdaters.indexOf(pos);
            if (i != -1) {
              this.iosupdaters.splice(i, 1);
            }
          } else if (this.ios[pos].class.isupdate == 2) {
            let i = this.updaters.indexOf(pos);
            if (i != -1) {
              this.updaters.splice(i, 1);
            }
          }
        }
      }
      this.observer.unobserve(a);
      delete this.ios[pos];
    }
  }

  this.ios = this.ios.filter((x) => x != undefined);

  for (let [i, a] of newios.entries()) {
    let foundio = oldios.find((element) => element == a);

    if (foundio == undefined) {
      let newindex = this.ios.length;
      let animobj = this.iO(newindex, a);

      this.ios.push(animobj);
      let last = this.ios.length - 1;
      if (this.ios[last].class) {
        this.ios[last].class.onResize(this.scroll.current);
      }
      this.observer.observe(this.ios[last].el);
    }
  }

  this.DOM.ios = document.body.querySelectorAll('.iO');
}

export function iOpage(animobj) {
  return animobj;
}

export function iO(index, anim) {
  if (anim.dataset.io) {
    return false;
  }
  anim.dataset.io = index;
  let animobj = {
    el: anim,
    pos: index,
    active: false,
  };

  if (anim.classList.contains('iO-lazyV')) {
    animobj.class = new lazyVideo(animobj, this.main.isTouch, this.main.vidauto, this.main.events.anim);
  } else if (anim.classList.contains('iO-lazyI')) {
    animobj.class = new lazyImg(animobj, this.main.device, this.main.isTouch);
  } else {
    if (anim.classList.contains('iO-std')) {
      this.main.events.anim.detail.state = 0;
      this.main.events.anim.detail.el = anim.parentNode;
      document.dispatchEvent(this.main.events.anim);

      if (anim.parentNode.tagName == 'A' || anim.parentNode.tagName == 'BUTTON') {
        anim.parentNode.onmouseenter = () => {
          this.main.events.anim.detail.state = 1;
          this.main.events.anim.detail.el = anim.parentNode;
          document.dispatchEvent(this.main.events.anim);
        };
      }
    }

    animobj = this.iOpage(animobj);
  }

  if (animobj.class) {
    if (animobj.class.prior == undefined) {
      animobj.class.prior = 10;
    }
  }
  return animobj;
}

export function inViewAddClass(entry) {
  entry.target.parentNode.classList.add('inview');
  if (!entry.target.parentNode.dataset.bucle && entry.target.parentNode.classList.contains('stview')) {
    return false;
  }
  entry.target.parentNode.classList.add('stview');
  if (entry.target.classList.contains('iO-std')) {
    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = entry.target.parentNode;

    document.dispatchEvent(this.main.events.anim);

    if (entry.target.parentNode.dataset.bucle) {
      entry.target.parentNode.classList.add('okF');
      return false;
    }
  }
}
export function showIos() {
  this.waitres = 0;
  for (let a of this.ios) {
    if (a.el.dataset.delay) {
      a.el.dataset.no = 'true';
      a.el.style.display = 'none';
      setTimeout(() => {
        a.el.removeAttribute('data-no');
        a.el.style.display = 'block';
        a.el.style.visibility = 'visible';

        if (a.class) {
          if (a.class.create) {
            a.class.create();
            a.class.isstarted = 1;
          }
          if (a.class.check) {
            let bound = a.el.getBoundingClientRect();
            let entry = {
              boundingClientRect: {
                top: bound.top,
                bottom: bound.bottom,
                left: bound.left,
                right: bound.right,
                width: a.el.clientWidth,
                height: a.el.clientHeight,
              },
            };

            this.ios[a.el.dataset.io].class.onResize(this.scroll.current);

            this.ios[a.el.dataset.io].class.update(this.speed, this.scroll.current);

            this.checkIo(a.el.dataset.io, entry);
          }
        }
      }, a.el.dataset.delay);
    }
    if (a.el.dataset.await) {
      setTimeout(() => {
        a.el.style.visibility = 'visible';
      }, a.el.dataset.await);
      if (this.waitres < a.el.dataset.await) {
        this.waitres = parseInt(a.el.dataset.await);
      }
    } else {
      a.el.style.visibility = 'visible';
      if (a.class) {
        if (a.class.check) {
          let bound = a.el.getBoundingClientRect();
          let entry = {
            boundingClientRect: {
              top: bound.top,
              bottom: bound.bottom,
              left: bound.left,
              right: bound.right,
              width: a.el.clientWidth,
              height: a.el.clientHeight,
            },
          };

          this.ios[a.el.dataset.io].class.onResize(this.scroll.current);

          this.ios[a.el.dataset.io].class.update(this.speed, this.scroll.current);

          this.checkIo(a.el.dataset.io, entry);
        }
      }
    }
  }
  this.waitres += 24;
}
