export function check(entry) {
  let vis = false;

  vis = entry.isIntersecting;

  if (vis == 1) {
    this.start();
  } else if (vis == 0) {
    this.stop();
  }
  return vis;
}

export function start() {
  if (this.active == 1) {
    return false;
  }

  if (this.active == -1) {
  }
  this.active = 1;
}

export function stop() {
  this.end = 0;
  this.ctr.prog = 0;
  this.ctr.progt = 0;
  this.animctr.progress(0);
  if (this.active < 1) {
    return false;
  }

  this.active = 0;
}
export function updateX(x = 0) {}
export function updateY(y = 0) {
  if (this.ctr.stop != 1) {
    this.ctr.current = y - this.ctr.start;
    this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current);
  }
}

export function updateAnim() {
  this.ctr.progt = parseFloat(this.ctr.current / this.ctr.limit).toFixed(3);
  this.ctr.prog = lerp(this.ctr.prog, this.ctr.progt, 0.015);
  this.animctr.progress(this.ctr.prog);
}

export function updateScale() {}
