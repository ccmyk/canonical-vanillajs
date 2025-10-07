export function onResize() {
  for (let [index, key] of Object.keys(this.components).entries()) {
    if (Array.isArray(this.components[key])) {
      for (let comp of this.components[key]) {
        if (comp.onResize) {
          comp.onResize();
        }
      }
    } else {
      if (this.components[key].onResize) {
        this.components[key].onResize();
      }
    }
  }

  for (let el of this.ios) {
    if (el) {
      if (el.class) {
        if (el.class.onResize) {
          el.class.onResize(this.scroll.target);
        }
      }
    }
  }

  this.resizeLimit();
}
export function resizeLimit() {
  let size = 0;

  this.scroll.limit = this.DOM.el.clientHeight - this.main.screen.h;
}

export function onScroll(scrollY) {}

export function onTouchDown(event) {
  this.isDown = true;
}

export function onTouchMove(event) {
  if (!this.isDown) return;
}

export function onTouchUp(event) {
  this.isDown = false;
}

export function onWheel(y) {
  if (this.isVisible == 0) {
    return;
  }
}
