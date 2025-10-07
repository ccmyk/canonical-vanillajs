export function check(entry) {
  let vis = false;

  vis = entry.isIntersecting;
  if (entry.isIntersecting == undefined) {
    return vis;
  }
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

  if (this.isv) {
    this.tex.image.play();
  }
  this.active = 1;
  this.updateX();
  this.updateY();
  this.updateScale();
}

export function stop() {
  if (this.active == 0 || this.active == -1) {
    return false;
  }

  if (this.isv) {
    this.media.pause();
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
  this.ctr.progt = (this.ctr.current / this.ctr.limit).toFixed(3);
  this.ctr.prog = lerp(this.ctr.prog, this.ctr.progt, this.ctr.lerp);

  this.animctr.progress(this.ctr.prog);
}

export function updateScale() {}
