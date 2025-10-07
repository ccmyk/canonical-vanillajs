export async function startComps() {
  for (let [index, key] of Object.keys(this.components).entries()) {
    if (Array.isArray(this.components[key])) {
      for (let comp of this.components[key]) {
        if (comp.load) {
          await comp.load();
        }
        if (comp.initEvents) {
          comp.initEvents();
        }
      }
    } else {
      if (this.components[key].load) {
        await this.components[key].load();
      }
      if (this.components[key].initEvents) {
        this.components[key].initEvents();
      }
    }
  }
  for (let el of this.ios) {
    if (el.class != null) {
      if (el.class.initEvents) {
        el.class.initEvents();
      }
      if (el.class.load) {
        if (el.el.dataset.nowait) {
          el.class.load();
        } else {
          await el.class.load();
        }
      }
    }
  }
}

export async function stopComps() {
  for (let [index, key] of Object.keys(this.components).entries()) {
    if (Array.isArray(this.components[key])) {
      for (let comp of this.components[key]) {
        if (comp.removeEvents) {
          comp.removeEvents();
        }
      }
    } else {
      if (this.components[key].removeEvents) {
        this.components[key].removeEvents();
      }
    }
  }

  for (let el of this.ios) {
    if (el.class != null && el.class.removeEvents) {
      el.class.removeEvents();
    }

    this.observer.unobserve(el.el);
  }
}
