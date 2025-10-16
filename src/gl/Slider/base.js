import { check, start, stop, updateX, updateY, updateScale, updateAnim } from './position.js';

import { Vec2 } from 'ogl';

class Slides {
  constructor(obj) {
    this.name = 'Slides';
    this.el = obj.el;
    this.pos = obj.pos;
    this.renderer = obj.renderer;
    this.meshes = obj.meshes;
    this.scene = obj.scene;
    this.post = obj.post;
    this.camera = obj.cam;
    this.canvas = obj.canvas;
    this.medias = obj.medias;
    this.textures = obj.textures;

    this.device = obj.dev;
    this.h = window.innerHeight;
    this.single = document.querySelector('.single[data-ids="' + this.el.dataset.ids + '"]');

    if (this.single) {
      this.single.style.opacity = 0;
    }
    this.oldpos = 0;

    if (this.el.dataset.ids == 0) {
      this.canvas.classList.add('fCanvas');
    }

    this.active = -1;
    this.isready = 0;

    this.posmesh = 0;
    this.posmeshes = [];
    this.objpos = { x: 0, target: 0, timer: 0 };

    this.ctr = {
      actual: 0,
      current: 0,
      limit: 0,
      start: 0,
      prog: 0,
      progt: 0,
      stop: 0,
    };

    gsap.set(this.canvas, { display: 'none' });

    this.animctr = gsap.timeline({ paused: true });
    if (this.el.dataset.ids != 0) {
      this.animctr;

      this.animctr
        .fromTo(
          this.objpos,
          { timer: 0 },
          {
            timer: 1,
            duration: 0.1,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (this.slideanim) {
                this.slideanim.timeScale(this.objpos.timer);
              }
            },
          },
          0
        )
        .fromTo(this.post.passes[0].program.uniforms.uStart, { value: 1.5 }, { value: 0, duration: 0.45 }, 0);
    } else {
      //INTRO 1
      this.animin = gsap
        .timeline({
          paused: true,
          delay: 0.1,
          onStart: () => {
            this.active = 1;

            for (let a of this.textures) {
              if (a.image.tagName == 'VIDEO') {
                a.image.play();
              }
            }

            this.slideanim.play();
          },
          onComplete: () => {
            delete this.animin;
          },
        })
        .fromTo(
          this.canvas,
          {
            webkitFilter: 'blur(' + 6 + 'px)',
            filter: 'blur(' + 6 + 'px)',
          },
          {
            webkitFilter: 'blur(' + 0 + 'px)',
            filter: 'blur(' + 0 + 'px)',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        )

        .fromTo(
          this.canvas,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          0
        );

      this.animin.fromTo(
        this.objpos,
        { timer: 0 },
        {
          timer: 1,
          duration: 0.9,
          ease: 'none',
          onUpdate: () => {
            if (this.slideanim) {
              this.slideanim.timeScale(this.objpos.timer);
            }
          },
        },
        0.8
      );

      this.animin.fromTo(
        this.post.passes[0].program.uniforms.uStart,
        { value: 1.5 },
        { value: 0, duration: 2, ease: 'power4.inOut' },
        0.6
      );

      this.animin
        .fromTo(
          this.objpos,
          { timer: 0 },
          {
            timer: 1,
            duration: 0.9,
            ease: 'none',
            onUpdate: () => {
              if (this.slideanim) {
                this.slideanim.timeScale(this.objpos.timer);
              }
            },
          },
          0.8
        )
        .fromTo(
          this.post.passes[0].program.uniforms.uStart,
          { value: 1.5 },
          { value: 0, duration: 2, ease: 'power4.inOut' },
          0.6
        );
    }

    this.animctr.fromTo(
      this.objpos,
      { timer: 1 },
      {
        timer: 0,
        duration: 0.05,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (this.slideanim) {
            this.slideanim.timeScale(this.objpos.timer);
          }
        },
      },
      0.95
    );

    this.animsinglectr = gsap.timeline({ paused: true });

    this.change = 0;
    this.stopt = 0;
    //MOUSE

    this.norm = 0;
    this.end = 0;
    this.lerp = 0.6;

    this.time = null;
    this.ishovered = 0;

    this.animhover = gsap.timeline({ paused: true });
    if (this.device < 3) {
      this.animhover.to(
        this.post.passes[0].program.uniforms.uHover,
        { value: 1, duration: 1, ease: 'power2.inOut', onComplete: () => {} },
        0
      );
    } else {
    }

    //STATE

    this.state = 0;

    this.initEvents();
  }

  removeEvents() {
    if (this.state != 0) {
      this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
      this.canvas.remove();
      return false;
    }
    this.active = -2;
    this.canvas.style.transition = 'none';
    this.canvas.parentNode.style.pointerEvents = 'none';

    let animout = gsap.timeline({
      onUpdate: () => {
        this.post.render({ scene: this.scene, camera: this.camera });
      },
      onComplete: () => {
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
        this.canvas.remove();
      },
    });
    if (this.device < 3) {
      animout
        .to(this.post.passes[0].program.uniforms.uStart, { value: 1.5, duration: 1, ease: 'power2.inOut' }, 0)
        .to(this.post.passes[0].program.uniforms.uHover, { value: 1, duration: 1, ease: 'power2.inOut' }, 0);
    }
    animout
      .to(
        this.objpos,
        {
          timer: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (this.slideanim) {
              this.slideanim.timeScale(this.objpos.timer);
            }
          },
        },
        0
      )
      .to(
        this.post.passes[0].program.uniforms.uStart,
        {
          value: 1.5,
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      );
  }

  update(time, speed, pos) {
    if (!this.renderer) {
      return false;
    }

    if (this.state < 1 && this.active == 1) {
      this.updateY(pos, 0);
      if (this.ctr.stop != 1 && this.state == 0) {
        this.updateAnim(0);
      }
      this.updateX();

      for (let [i, a] of this.textures.entries()) {
        if (this.textures[i].image.tagName == 'VIDEO') {
          if (this.textures[i].image.readyState >= this.textures[i].image.HAVE_ENOUGH_DATA) {
            if (!this.textures[i].image) this.textures[i].image = this.textures[i].image;

            this.textures[i].needsUpdate = true;
          }
        }
      }

      this.post.render({ scene: this.scene, camera: this.camera });
    }
  }
  initEvents() {
    if (this.device < 2) {
      this.el.parentNode.onmouseenter = () => {
        this.animhover.timeScale(1);
        this.animhover.play();
        this.ishovered = 1;
      };

      this.el.parentNode.onmouseleave = () => {
        this.animhover.pause();
        this.animhover.timeScale(0.7);
        this.animhover.reverse();
        this.ishovered = 0;
      };
    }

    this.checkVis = (e) => {
      if (this.active != 1 && this.active != -2) {
        return false;
      }

      if (document.visibilityState == 'hidden') {
        this.active = -2;
        this.slideanim.pause();
        this.slideanim.progress(0);
        this.resetMeshes();
        this.statepos = 0;
      } else {
        this.active = 1;

        this.slideanim.restart();
        this.slideanim.play();
      }
    };

    document.addEventListener('visibilitychange', (e) => this.checkVis(e));

    for (let [i, a] of this.medias.entries()) {
      if (a.tagName == 'VIDEO') {
        this.meshes[i].program.uniforms.uTextureSize.value = [a.width, a.height];
      } else {
        this.meshes[i].program.uniforms.uTextureSize.value = [
          this.textures[i].image.naturalWidth,
          this.textures[i].image.naturalHeight,
        ];
      }
    }

    this.resetMeshes = () => {
      for (let [i, a] of this.meshes.entries()) {
        this.posmeshes[i] = (this.wel + this.space) * i;

        a.position.x =
          -(this.viewport[0] / 2) + a.scale.x / 2 + (this.posmeshes[i] / this.screen[0]) * this.viewport[0];
      }
    };

    let time = 42;

    this.slideanim = gsap
      .timeline({
        paused: true,
        repeat: -1,
        onRepeat: () => {
          this.resetMeshes();
          this.statepos = 0;
        },
      })
      .fromTo(this.objpos, { x: 0 }, { x: 1, ease: 'none', duration: time }, 0);
  }

  onResize(viewport, screen) {
    if (this.state == 1) {
      return false;
    }
    let bound = this.el.getBoundingClientRect();
    this.bound = [bound.x, bound.y, bound.width, bound.height];

    this.h = window.innerHeight;
    this.screen = [bound.width, bound.height];

    this.statepos = 0;
    if (this.device < 3) {
      this.wel = this.bound[2] * 0.322;
    } else {
      this.wel = this.bound[2] * 0.75;
    }

    this.space = parseFloat(
      window
        .getComputedStyle(this.el.parentNode.parentNode.querySelector('.nfo_t'), null)
        .getPropertyValue('padding-left')
    );

    this.firstpos = 0;

    this.minpos = this.wel * -1;

    this.maxpos = (this.meshes.length - 1) * (this.wel + this.space);
    this.totalpos = this.meshes.length * (this.wel + this.space);

    this.aspect = this.screen[0] / this.bound[3];
    this.renderer.setSize(this.screen[0], this.bound[3]);

    this.camera.perspective({
      aspect: this.renderer.gl.canvas.width / this.renderer.gl.canvas.height,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = [width, height];
    let firstfix = 0;
    if (this.el.dataset.ids == 0) {
      firstfix = window.innerHeight * -0.15;
    }
    let calc = 0 + firstfix;
    let fix = parseInt(this.screen[1] + this.el.clientHeight * 2);

    this.ctr.start = parseInt(bound.y - screen.h + calc + window.scrollY);
    this.ctr.limit = fix;

    this.updateX();
    this.updateY();
    this.updateScale();

    this.resetMeshes();

    for (let [i, a] of this.medias.entries()) {
      this.meshes[i].program.uniforms.uCover.value = [this.wel, this.el.clientHeight];
    }
  }

  async changeState(n) {
    this.state = -1;

    const parent = this.el.parentNode.parentNode;
    const map = new Map()

      .set('n', parent.querySelector('.nfo_n'))
      .set('t', parent.querySelector('.nfo_t'))
      .set('x', parent.querySelector('.nfo_x'));

    const animout = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.state = n;
      },
    });

    if (n == 1) {
      let height = 100 + 'vh';

      let waitfr = 1.6;

      animout
        .fromTo(
          this.post.passes[0].program.uniforms.uTime,
          { value: 0 },
          { value: 1, duration: 1, ease: 'power2.inOut' },
          0
        )
        .to(
          this.post.passes[0].program.uniforms.uStart,
          {
            value: 1,
            duration: 1,
            ease: 'power2.inOut',
            onStart: () => {
              this.renderer.gl.canvas.classList.add('hideme');
            },
          },
          0
        )
        .to(
          this.objpos,
          {
            timer: 0,
            duration: 0.4,
            ease: 'power2.inOut',

            onUpdate: () => {
              if (this.slideanim) {
                this.slideanim.timeScale(this.objpos.timer);
              }
            },
          },
          0
        )
        .to(map.get('n'), { x: +59 + 'rem', duration: 1.8, ease: 'power2.inOut' }, 0)
        .to(map.get('t'), { x: +46.6 + 'rem', duration: 1.6, ease: 'power2.inOut' }, 0)
        .to(map.get('x'), { x: +12 + 'rem', duration: 0.6, ease: 'power2.inOut' }, 0)
        .to(
          map.get('x'),
          {
            paddingTop: map.get('t').clientHeight + 24 + 'px',
            duration: 0.6,
            ease: 'power2.inOut',
          },
          0.4
        )
        .to(
          parent,
          {
            height: height,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
              parent.classList.add('cnt_el-singlemod');
              this.state = 1;
              this.animctr.progress(0);
            },
          },
          0
        )
        .to(
          parent,
          {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
              parent.classList.add('cnt_el-singlemod');
            },
          },
          0
        );

      await animout.play();
    } else {
      const animin = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (this.active == 1) {
          }
        },
      });
      animin
        .to(map.get('n'), { x: +0 + 'rem', duration: 1, ease: 'power2.inOut' }, 0)
        .to(map.get('t'), { x: +0 + 'rem', duration: 1.2, ease: 'power2.inOut' }, 0)
        .to(map.get('x'), { x: 0, duration: 0.6, ease: 'power2.inOut' }, 0)
        .to(map.get('x'), { paddingTop: 0, duration: 0.6, ease: 'power2.inOut' }, 0.45)
        .to(
          parent,
          {
            height: '',
            duration: 0.4,
            ease: 'power2.inOut',
            onStart: () => {
              this.slideanim.restart();
              if (this.el.dataset.ids == 0) {
                this.animfck = gsap
                  .timeline({
                    paused: true,
                    delay: 0.1,
                    onStart: () => {
                      this.active = 1;

                      for (let a of this.textures) {
                        if (a.image.tagName == 'VIDEO') {
                          a.image.play();
                        }
                      }

                      this.slideanim.play();
                    },
                    onComplete: () => {
                      delete this.animfck;
                    },
                  })
                  .fromTo(
                    this.post.passes[0].program.uniforms.uStart,
                    { value: 1.5 },
                    { value: 0.5, duration: 0.8, ease: 'power2.inOut' },
                    0
                  )
                  .fromTo(
                    this.objpos,
                    { timer: 0 },
                    {
                      timer: 1,
                      duration: 0.9,
                      ease: 'power2.inOut',
                      onUpdate: () => {
                        if (this.slideanim) {
                          this.slideanim.timeScale(this.objpos.timer);
                        }
                      },
                    },
                    0.8
                  )
                  .fromTo(
                    this.post.passes[0].program.uniforms.uStart,
                    { value: 1.5 },
                    { value: 0, duration: 0.8 },
                    0.8
                  );
              }
            },
            onComplete: () => {
              this.renderer.gl.canvas.classList.remove('hideme');
              parent.classList.remove('cnt_el-singlemod');

              this.state = 0;

              this.ctr.actual = window.scrollY;
              this.onResize(null, { w: window.innerWidth, h: window.innerHeight });

              this.slideanim.play();
              this.updateY(window.scrollY, 0);
              this.updateAnim(0);

              if (this.animfck) {
                this.animfck.play();
              }
              //Calculo de posición
            },
          },
          0.8
        );

      animin.play();
    }
  }
}

Slides.prototype.check = check;
Slides.prototype.start = start;
Slides.prototype.stop = stop;
Slides.prototype.updateX = updateX;
Slides.prototype.updateY = updateY;
Slides.prototype.updateScale = updateScale;
Slides.prototype.updateAnim = updateAnim;

export default Slides;
