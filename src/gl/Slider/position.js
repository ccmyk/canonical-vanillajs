export function check(entry) {
  let vis = false;

  vis = entry.isIntersecting;

  if (vis == 1) {
    this.start(entry);
  } else if (vis == 0) {
    this.stop(entry);
  }
  return vis;
}

export function start(entry) {
  if (this.state == 1) {
    if (this.single) {
      if (this.oldpos > window.scrollY) {
        if (entry.boundingClientRect.y > 60) {
          this.single.style.pointerEvents = 'all';
        } else {
        }
      } else {
        if (entry.boundingClientRect.y > 60) {
          this.single.style.pointerEvents = 'all';
        } else {
          this.single.style.pointerEvents = 'none';
        }
      }
      this.oldpos = window.scrollY;
    }
  } else {
    gsap.set(this.canvas, { display: 'block' });
    if (this.animin) {
      this.animin.play();
      if (this.touchl) {
        this.active = 1;
      }
      return false;
    }
  }
  if (this.active == 1) {
    return false;
  }

  this.active = 1;

  for (let a of this.textures) {
    if (a.image.tagName == 'VIDEO') {
      a.image.play();
    }
  }

  this.slideanim.play();
}

export function stop(entry) {
  gsap.set(this.canvas, { display: 'none' });
  if (this.state == 1) {
    if (this.single) {
      this.single.style.pointerEvents = 'none';
      this.single.style.opacity = 0;

      this.oldpos = window.scrollY;
    }
  }
  if (this.active < 1 || this.state != 0) {
    return false;
  }
  this.slideanim.pause();
  for (let a of this.textures) {
    if (a.image.tagName == 'VIDEO') {
      a.image.pause();
    }
  }

  this.active = 0;
}
export function updateX(sum = 0) {
  this.statepos = (this.objpos.x * this.totalpos) / 1;

  let x = 0;
  for (let [i, a] of this.meshes.entries()) {
    x = this.posmeshes[i];

    x -= this.statepos;

    if (x <= this.minpos) {
      this.posmeshes[i] = this.statepos + this.maxpos + this.space;
    }

    a.position.x = -(this.viewport[0] / 2) + a.scale.x / 2 + (x / this.screen[0]) * this.viewport[0];
  }
}
export function updateY(y = 0, state = 0) {
  if (this.ctr.stop != 1) {
    this.ctr.current = y - this.ctr.start;
    this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current);
  }
}

export function updateAnim() {
  this.ctr.progt = (this.ctr.current / this.ctr.limit).toFixed(3);

  if (this.active == -2) {
    this.ctr.prog = this.ctr.progt;
  } else {
    this.ctr.prog = lerp(this.ctr.prog, this.ctr.progt, 0.015);
  }
  this.animctr.progress(this.ctr.prog);
}

export function updateScale() {
  let w = this.screen[0] * 0.322;
  let h = this.bound[3];
  if (this.device < 3) {
    w = this.screen[0] * 0.322;
  } else {
    w = this.screen[0] * 0.75;
  }

  for (let [i, a] of this.meshes.entries()) {
    a.scale.x = (this.viewport[0] * w) / this.screen[0];
    a.scale.y = (this.viewport[1] * h) / this.screen[1];
  }
}
