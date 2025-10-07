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

  this.active = 1;
}

export function stop() {
  if (this.active == 0) {
    return false;
  }
  if (this.anim) {
    this.anim.pause();
  }
  this.active = 0;
}
export function updateX(x = 0) {}
export function updateY(y = 0) {}

export function updateScale() {
  this.mesh.scale.x = (this.viewport[0] * this.bound[2]) / this.screen[0];
  this.mesh.scale.y = (this.viewport[1] * this.bound[3]) / this.screen[1];
}
