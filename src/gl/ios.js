export function callIos() {
  let root = null;
  let opts = {
    root: root,
    threshold: [0],
  };

  this.callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.target.dataset.oi || this.isVisible == 0) {
        return false;
      }

      const pos = entry.target.dataset.oi;
      this.iosmap.get(parseInt(pos));
      if (this.iosmap.get(parseInt(pos))) {
        this.checkIo(pos, entry);
      }
    });
  };

  this.obs = new IntersectionObserver(this.callback, opts);

  if (this.ios) {
    for (let [i, a] of this.iosmap.entries()) {
      this.obs.observe(a.el);
    }
  }
}

export async function loadIos() {
  for (let [i, a] of this.iosmap.entries()) {
    if (a.load) {
      await a.load(this.loadImage, this.loadVideo);
    }
  }
}

export function showIos() {
  for (let [i, a] of this.iosmap.entries()) {
    a.el.style.visibility = 'visible';
  }
}

export function checkIo(pos, entry) {
  let check = false;
  if (this.iosmap.get(parseInt(pos)).check) {
    check = this.iosmap.get(parseInt(pos)).check(entry);
  }
}
