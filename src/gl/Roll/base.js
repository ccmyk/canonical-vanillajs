import { check, start, stop, updateY, updateScale, updateAnim } from './position.js';

import { Vec2 } from 'ogl';

class Roll {
  constructor(obj) {
    this.name = 'Roll';
    this.el = obj.el;
    this.pos = obj.pos;
    this.renderer = obj.renderer;
    this.mesh = obj.mesh;
    this.scene = obj.scene;
    this.canvas = obj.canvas;
    this.medias = obj.medias;
    this.textures = obj.textures;

    this.parent = document.querySelector('.cRoll');
    this.singles = document.querySelectorAll('.stck_hold .single');

    this.renderer.gl.canvas.classList.add('hideme');

    this.active = -1;
    this.isready = 0;

    this.ctr = {
      actual: 0,
      current: 0,
      limit: 0,
      start: 0,
      prog: 0,
      progt: 0,
      stop: 0,
    };

    this.change = 0;
    this.stopt = 0;
    //MOUSE

    this.norm = 0;
    this.end = 0;
    this.lerp = 0.6;

    this.time = null;
    this.ishovered = 0;

    this.animhover = gsap.timeline({ paused: true });

    let end = 0;
    let start = 1;
    let anim = 1.2;

    const els = document.querySelectorAll('main .cnt_el');
    const vh = 40;

    this.animctr = gsap.timeline({ paused: true, onUpdate: () => {} });

    let length = this.textures.length - 1;

    for (let [i, a] of this.textures.entries()) {
      let end = 0;
      let start = 1;
      let anim = 1.2;
      let del = 0.4;
      if (i == 0) {
        end = 0;
        start = 0;
        anim = 0;

        this.animctr
          .fromTo(
            this.mesh.program.uniforms.uChange,
            { value: 0 },
            {
              value: 1,
              duration: 0.6,
              ease: 'power2.inOut',

              onStart: () => {
                this.mesh.program.uniforms.tMap.value = this.textures[0];
                this.mesh.program.uniforms.tMap2.value = this.textures[1];
                this.checkVid(0, 1);
              },
              onReverseComplete: () => {
                this.mesh.program.uniforms.tMap.value = this.textures[0];
                this.mesh.program.uniforms.tMap2.value = this.textures[1];
                this.checkVid(0, 1);
              },
            },
            del
          )
          .fromTo(
            this.mesh.program.uniforms.uStart,
            { value: 0 },
            { value: 0.4, duration: 0.6, ease: 'power2.inOut' },
            del
          )
          .fromTo(
            this.mesh.program.uniforms.uEnd,
            { value: 0.4 },
            { value: 0, duration: 0.6, ease: 'power2.inOut' },
            del
          );
      } else {
        del = 0.4;
        if (i == length) {
        }
        this.animctr.set(
          this.mesh.program.uniforms.tMap,
          {
            value: a,
            onReverseComplete: () => {
              this.mesh.program.uniforms.tMap.value = this.textures[i - 1];
              this.mesh.program.uniforms.tMap2.value = this.textures[i];
              this.checkVid(i - 1, i);

              this.mesh.program.uniforms.uStart.value = 0;
              this.mesh.program.uniforms.uEnd.value = 0;
              this.mesh.program.uniforms.uChange.value = 1;
            },
            onComplete: () => {
              if (this.textures[i + 1]) {
                this.mesh.program.uniforms.tMap.value = this.textures[i];
                this.mesh.program.uniforms.tMap2.value = this.textures[i + 1];
                this.checkVid(i, i + 1);

                this.mesh.program.uniforms.uStart.value = 0;
                this.mesh.program.uniforms.uEnd.value = 0;
                this.mesh.program.uniforms.uChange.value = 0;
              }
            },
          },
          i + del
        );
        if (this.textures[i + 1]) {
          this.animctr
            .fromTo(
              this.mesh.program.uniforms.uChange,
              { value: 0 },
              { value: 1, duration: 0.6, ease: 'power2.inOut' },
              i + del
            )
            .fromTo(
              this.mesh.program.uniforms.uStart,
              { value: 0 },
              { value: 0.4, duration: 0.6, ease: 'power2.inOut' },
              i + del
            )
            .fromTo(
              this.mesh.program.uniforms.uEnd,
              { value: 0.4 },
              { value: 0, duration: 0.6, ease: 'power2.inOut' },
              i + del
            );
        } else {
        }
      }
    }

    //STATE
    //al -1 si está animando?
    this.state = 0;

    this.initEvents();
  }

  update(time, speed, pos) {
    if (!this.renderer) {
      return false;
    }
    if (this.time == null) {
      this.time = performance.now() - 10;
    }

    if (this.state == 1) {
      this.ctr.actual = pos;
      this.updateY(pos);
      if (this.ctr.stop != 1 && this.state == 1) {
        this.updateAnim();
      }

      for (let [i, a] of this.textures.entries()) {
        if (this.textures[i].image.tagName == 'VIDEO') {
          if (this.textures[i].image.readyState >= this.textures[i].image.HAVE_ENOUGH_DATA) {
            if (!this.textures[i].image) this.textures[i].image = this.textures[i].image;

            this.textures[i].needsUpdate = true;
          }
        }
      }

      this.renderer.render({
        scene: this.mesh,
      });
    }
  }
  initEvents() {
    this.searchTex = (i, u) => {
      if (this.medias[i].tagName == 'VIDEO') {
        this.mesh.program.uniforms.uTextureSize.value = [this.medias[i].width, this.medias[i].height];
      } else {
        this.mesh.program.uniforms.uTextureSize.value = [
          this.textures[i].image.naturalWidth,
          this.textures[i].image.naturalHeight,
        ];
      }

      if (this.medias[u].tagName == 'VIDEO') {
        this.mesh.program.uniforms.uTextureSize2.value = [this.medias[u].width, this.medias[u].height];
      } else {
        this.mesh.program.uniforms.uTextureSize2.value = [
          this.textures[u].image.naturalWidth,
          this.textures[u].image.naturalHeight,
        ];
      }
    };

    this.checkVid = (a, b) => {
      for (let [i, oth] of this.textures.entries()) {
        if (oth.image.tagName == 'VIDEO') {
          if (a == i || b == i) {
            oth.image.play();
          } else {
            oth.image.pause();
          }
        }
      }

      this.searchTex(a, b);
    };

    this.actualpos = 0;

    this.searchTex(this.actualpos, this.actualpos + 1);
  }

  removeEvents() {
    if (this.state != 1) {
      this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
      this.canvas.remove();
      return false;
    }
    this.active = -2;

    this.canvas.style.transition = 'none';
    this.canvas.parentNode.style.pointerEvents = 'none';
    gsap
      .timeline({
        onUpdate: () => {
          this.renderer.render({
            scene: this.mesh,
          });
        },
        onComplete: () => {
          this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
          this.canvas.remove();
        },
      })
      .to(this.mesh.program.uniforms.uStart, { value: 0.8, duration: 1, ease: 'power2.inOut' }, 0)

      .to(
        this.canvas,
        {
          webkitFilter: 'blur(' + 6 + 'px)',
          filter: 'blur(' + 6 + 'px)',
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      )

      .to(
        this.canvas,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0.4
      );
  }

  onResize(viewport, screen) {
    let bound = this.el.getBoundingClientRect();
    this.bound = [bound.x, bound.y, bound.width, bound.height];

    this.screen = [this.parent.clientWidth, this.parent.clientHeight];

    this.aspect = this.parent.clientWidth / this.parent.clientHeight;
    this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight);

    let calc = 0;
    let fix = parseInt(this.screen[1] + this.el.clientHeight);

    this.ctr.start = parseInt(bound.y + window.scrollY - this.parent.clientHeight);
    this.ctr.limit = this.el.clientHeight + this.parent.clientHeight;

    this.updateY();
    this.updateScale();

    this.mesh.program.uniforms.uCover.value = [this.parent.clientWidth, this.parent.clientHeight];
  }

  async changeState(n) {
    if (n == 1) {
      const animin = gsap
        .timeline()
        .fromTo(this.mesh.program.uniforms.uStart, { value: 1.2 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0)
        .fromTo(
          this.mesh.program.uniforms.uEnd,
          { value: 1.2 },
          {
            value: 0,
            duration: 2,
            ease: 'power2.inOut',
            onStart: () => {
              this.mesh.program.uniforms.tMap.value = this.textures[0];
              this.mesh.program.uniforms.tMap2.value = this.textures[1];
              this.checkVid(0, 1);
              this.state = 1;
              this.renderer.gl.canvas.classList.remove('hideme');
            },
          },
          0
        );
    } else {
      this.renderer.gl.canvas.classList.add('hideme');
      this.state = 0;
      for (let [i, a] of this.textures.entries()) {
        this.singles[i].style.pointerEvents = 'none';
        if (a.image.tagName == 'VIDEO') {
          a.image.pause();
        }
      }
    }
  }
}

Roll.prototype.check = check;
Roll.prototype.start = start;
Roll.prototype.stop = stop;
Roll.prototype.updateY = updateY;
Roll.prototype.updateScale = updateScale;
Roll.prototype.updateAnim = updateAnim;

export default Roll;
