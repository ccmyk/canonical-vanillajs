export function check(entry) {
  if (entry.isIntersecting == undefined) {
    return false;
  }
  let vis = false;

  vis = entry.isIntersecting;

  if (vis == 1) {
    this.start();
  } else if (vis == 0) {
    this.stop(entry.boundingClientRect.y);
  }
  return vis;
}

export function start() {
  if (this.active == 1) {
    return false;
  }
  this.animstart.pause();
  this.active = 1;
}

export function stop(y) {
  if (this.active == 0) {
    return false;
  }

  if (this.animstart) {
    if (y < -1) {
      this.animstart.reverse();
      this.ctr.prog = 1;
      this.ctr.progt = 1;
      this.active = 1;
    } else {
      this.animstart.play();
      this.ctr.prog = 0;
      this.ctr.progt = 0;
      this.active = 0;
    }
  }
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
  this.ctr.prog = lerp(this.ctr.prog, this.ctr.progt, 0.045);

  this.animstart.progress(1 - this.ctr.prog);
}

export function updateScale() {
  this.mesh.scale.x = (this.viewport[0] * this.bound[2]) / this.screen[0];
  this.mesh.scale.y = (this.viewport[1] * this.bound[3]) / this.screen[1];
}
