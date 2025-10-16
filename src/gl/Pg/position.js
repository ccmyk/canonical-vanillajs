export function check(entry) {
  let vis = false;
  vis = entry.isIntersecting;

  if (entry.target.classList.contains('Oi-pgel')) {
    this.checkEl(entry);

    return true;
  }

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

export function checkEl(entry) {
  if (entry.isIntersecting == true) {
    this.meshes[parseInt(entry.target.dataset.pg)].y =
      this.meshes[parseInt(entry.target.dataset.pg)].el.querySelector('.cv').getBoundingClientRect().y + window.scrollY;
    this.meshes[parseInt(entry.target.dataset.pg)].el.classList.add('act');
    this.mmap.add(this.meshes[parseInt(entry.target.dataset.pg)].pos);
    if (this.meshes[parseInt(entry.target.dataset.pg)].vid) {
      this.meshes[parseInt(entry.target.dataset.pg)].texture.image.play();
    }
  } else {
    if (this.meshes[parseInt(entry.target.dataset.pg)].vid) {
      this.meshes[parseInt(entry.target.dataset.pg)].texture.image.pause();
    }
    if (this.mmap.has(parseInt(entry.target.dataset.pg))) {
    }
  }
}
export function start() {
  if (this.active == 1) {
    return false;
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
export function updateX(x = 0, anim = null) {
  if (!this.meshes) return false;

  if (anim == null) {
    for (let [i, a] of this.meshes.entries()) {
      x = a.el.querySelector('.cv').getBoundingClientRect().x;
      a.mesh.position.x = -(this.viewport[0] / 2) + a.mesh.scale.x / 2 + (x / this.screen[0]) * this.viewport[0];
    }
  } else {
    for (let [i, a] of this.mmap.entries()) {
      const bound = this.meshes[a].el.querySelector('.cv').getBoundingClientRect();
      x = bound.x;
      this.meshes[a].mesh.position.x =
        -(this.viewport[0] / 2) + this.meshes[a].mesh.scale.x / 2 + (x / this.screen[0]) * this.viewport[0];
      if (this.boundh) {
        if (this.boundh[2] == a) {
          this.boundh[0] = bound.x;
          this.boundh[1] = bound.width;
        }
      }
    }
  }
}
export function updateY(y = 0, all = null) {
  if (!this.meshes) return false;
  if (all != null) {
    for (let [i, a] of this.meshes.entries()) {
      a.y = a.el.querySelector('.cv').getBoundingClientRect().y + y;
      let ypos = a.y;
      a.mesh.position.y = this.viewport[1] / 2 - a.mesh.scale.y / 2 - ((ypos - y) / this.screen[1]) * this.viewport[1];
    }
  } else {
    for (let [i, a] of this.mmap.entries()) {
      if (this.meshes[a].vid) {
        if (this.meshes[a].texture.image.readyState >= this.meshes[a].texture.image.HAVE_ENOUGH_DATA) {
          if (!this.meshes[a].texture.image) this.meshes[a].texture.image = this.meshes[a].texture.image;

          this.meshes[a].texture.needsUpdate = true;
        }
      }
      if (this.onanim != -1) {
        let ypos = (this.meshes[a].y = this.meshes[a].el.querySelector('.Oi').getBoundingClientRect().y + y);
      }
      let ypos = this.meshes[a].y;
      this.meshes[a].mesh.position.y =
        this.viewport[1] / 2 - this.meshes[a].mesh.scale.y / 2 - ((ypos - y) / this.screen[1]) * this.viewport[1];
    }
  }
}
export function updateAnim() {}

export function updateScale(anim = null) {
  if (!this.meshes) return false;
  if (anim == null) {
    for (let [i, a] of this.meshes.entries()) {
      a.mesh.scale.x = (this.viewport[0] * (this.bound[2] * this.meshes[i].multx)) / this.screen[0];
      a.mesh.scale.y = (this.viewport[1] * (this.bound[3] * this.meshes[i].multy)) / this.screen[1];
    }
  } else {
    for (let [i, a] of this.mmap.entries()) {
      this.meshes[a].mesh.scale.x = (this.viewport[0] * (this.bound[2] * this.meshes[a].multx)) / this.screen[0];
      this.meshes[a].mesh.scale.y = (this.viewport[1] * (this.bound[3] * this.meshes[a].multy)) / this.screen[1];

      if (this.boundh) {
      }

      this.meshes[a].mesh.program.uniforms.uCover.value = [
        this.bound[2] * this.meshes[a].multx,
        this.bound[3] * this.meshes[a].multy,
      ];
    }
  }
}
