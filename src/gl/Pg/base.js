import { check, checkEl, start, stop, updateX, updateY, updateScale, updateAnim } from './position.js';

import PGs from './Pg.fragment.main.glsl?raw';
import PGv from './Pg.vertex.main.glsl?raw';

import { Triangle, Program, Mesh, Vec2, Texture } from 'ogl';

class Base {
  constructor(obj) {
    this.el = obj.el;
    this.pos = obj.pos;
    this.scene = obj.scene;
    this.camera = obj.cam;
    this.tex = obj.texture;

    this.renderer = obj.renderer;
    this.touch = obj.touch;
    this.device = obj.device;
    this.canvas = obj.canvas;

    this.geo = obj.geometry;

    this.rev = obj.rev;

    this.active = -1;
    this.isready = 0;

    this.onanim = -1;

    this.els = this.el.parentNode.querySelectorAll('.el');

    this.sizer = this.el.parentNode.querySelector('.Sizer');

    this.animctr = gsap.timeline({ paused: true });

    this.meshes = [];
    this.mmap = new Set();

    let mesh = '';
    let cont = 0;
    let row = 0;
    let w = this.sizer.clientWidth;
    let h = this.sizer.clientHeight;

    for (let [i, a] of this.els.entries()) {
      let program = new Program(this.renderer.gl, {
        vertex: PGv,
        fragment: PGs,
        uniforms: {
          uTime: { value: 0 },
          uStart: { value: 0 },
          uZoom: { value: 1 },
          uMove: { value: 1 },
          tMap: { value: this.texture },
          uCover: { value: new Vec2(w, h) },
          uTextureSize: { value: new Vec2(0, 0) },
          uMouse: { value: 0 },
          uLoad: { value: 0 },
        },
      });
      let texture = new Texture(this.renderer.gl, {
        generateMipmaps: false,
      });

      mesh = new Mesh(this.renderer.gl, { geometry: this.geo, program: program });

      mesh.setParent(this.scene);

      const qck = gsap.utils.pipe(
        gsap.utils.clamp(-2, 2),
        gsap.quickTo(mesh.program.uniforms.uMouse, 'value', { duration: 0.8, ease: 'power1' })
      );
      this.meshes.push({
        mesh,
        texture: texture,
        el: a,
        id: cont,
        pos: i,
        row: row,
        multx: 1,
        multy: 1,
        mult: 1,
        qck,
        loaded: 0,
      });

      if (this.device < 2) {
        if (cont == 3 || cont == 6 || cont == 9 || cont == 11) {
          row++;
        }

        cont++;
        if (cont == 12) {
          cont = 0;
        }
      } else {
        cont++;
        row++;
      }
    }

    if (this.device < 2) {
      this.calculator = [2.55, 2.55];
    } else if (this.device == 2) {
      this.calculator = [1.49, 1.49, 0.49];
    } else {
      this.calculator = [1.33, 1.33, 0.33];
    }

    this.initEvents();
  }

  async load(loadim, loadvid) {
    this.loadImage = loadim;
    this.loadVideo = loadvid;

    this.loadEls(this.els);
  }

  async loadEls(els) {
    let src = '';
    const video = document.createElement('video');
    video.isPlaying = false;
    video.style.display = 'none';
    video.autoplay = true;
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    video.setAttribute('playsinline', 'playsinline');
    video.muted = true;
    video.loop = true;
    video.dataset.auto = true;

    for (let [i, el] of this.els.entries()) {
      let path = el.querySelector('.el_md video,.el_md img');
      let url = path.dataset.src;

      if (path.tagName == 'IMG') {
        src = await this.loadImage(url);
        this.meshes[i].loaded = 1;
        this.meshes[i].mesh.program.uniforms.uTextureSize.value = [src.naturalWidth, src.naturalHeight];
        this.meshes[i].texture.image = src;
        this.meshes[i].mesh.program.uniforms.tMap.value = this.meshes[i].texture;
      } else if (path.tagName == 'VIDEO') {
        let vidclone = video.cloneNode();
        src = await this.loadVideo(vidclone, url);
        path.classList.add('Ldd');
        this.meshes[i].loaded = 1;

        this.meshes[i].vid = vidclone;
        this.meshes[i].texture.image = src;

        if (this.meshes[i].texture.image.readyState >= this.meshes[i].texture.image.HAVE_ENOUGH_DATA) {
          if (!this.meshes[i].texture.image) this.meshes[i].texture.image = this.meshes[i].texture.image;

          this.meshes[i].texture.needsUpdate = true;
        }

        this.meshes[i].mesh.program.uniforms.tMap.value = this.meshes[i].texture;
        this.meshes[i].mesh.program.uniforms.uTextureSize.value = [
          this.meshes[i].el.querySelector('video').width,
          this.meshes[i].el.querySelector('video').height,
        ];
      }

      gsap.to(this.meshes[i].mesh.program.uniforms.uLoad, {
        value: 1,
        duration: 0.6,
        delay: 1,
        ease: 'power2.inOut',
      });
      this.els[i].classList.add('ldd');
    }
  }

  update(time, speed, pos) {
    if (!this.meshes) {
      return false;
    }
    if (this.isready == 0 || this.active < 0) {
      return false;
    }

    if (this.onanim != -1) {
      this.updateY(pos, true);
      this.updateX(0, this.onanim);
      this.updateScale(this.onanim);
    } else {
      this.updateY(pos);
    }

    if (this.boundh) {
      this.meshes[this.boundh[2]].qck(this.boundh[4] * this.meshes[this.boundh[2]].mult);
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    return true;
  }
  initEvents() {
    document.querySelector('.cnt_g').onclick = async (e) => {
      if (this.isload == 1 || e.target.closest('button')) {
        return false;
      }

      this.isload = 1;

      const animsel = gsap.timeline({
        paused: true,
        onUpdate: (a) => {},
        onComplete: () => {},
      });
      if (this.onsel != undefined) {
        this.onanim = 0;
        animsel
          .to(this.meshes[this.onsel].mesh.program.uniforms.uZoom, { value: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
          .to(this.meshes[this.onsel], { multx: 1, multy: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
          .to(
            this.meshes[this.onsel].el,
            { '--scx': 1, '--scy': 1, xPercent: 0, duration: 0.9, ease: 'power2.inOut' },
            0
          );

        animsel;

        if (this.device > 1) {
        } else {
          if (this.meshes[this.onsel].id == 0) {
            if (this.meshes[this.onsel + 1])
              animsel.to(this.meshes[this.onsel + 1].el, { xPercent: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
            if (this.meshes[this.onsel + 2])
              animsel.to(this.meshes[this.onsel + 2].el, { xPercent: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
          } else if (
            this.meshes[this.onsel].id == 1 ||
            this.meshes[this.onsel].id == 4 ||
            this.meshes[this.onsel].id == 5
          ) {
            if (this.meshes[this.onsel + 1])
              animsel.to(this.meshes[this.onsel + 1].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
          } else if ((this.meshes[this.onsel].id == 2) | (this.meshes[this.onsel].id == 9)) {
            animsel.to(this.meshes[this.onsel - 1].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
          } else if (this.meshes[this.onsel].id == 3) {
            animsel
              .to(this.meshes[this.onsel - 1].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
              .to(this.meshes[this.onsel - 2].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
          } else if (this.meshes[this.onsel].id == 6 || this.meshes[this.onsel].id == 7) {
          }
        }
      }

      if (this.onsel != undefined) {
        await animsel.play();
      }
      delete this.onsel;
      delete this.isload;
      this.onanim = -1;
    };

    for (let [i, a] of this.els.entries()) {
      let b = a.querySelector('.el_b .Awrite');
      this.rev.detail.state = 0;
      this.rev.detail.el = b;
      document.dispatchEvent(this.rev);

      a.querySelector('.el_md').onclick = async () => {
        if (this.isload) {
          return false;
        }

        let wait = 0;
        this.isload = 1;
        this.onanim = i;

        const animsel = gsap.timeline({
          paused: true,
          onUpdate: (a) => {},
          onComplete: () => {},
        });

        if (this.onsel != undefined) {
          if (this.onsel != -1 && this.meshes[this.onsel].row == this.meshes[i].row) {
            if (this.onsel != i) {
              animsel
                .set(this.meshes[i].el, { marginBottom: 16.725 * 1.26 + 'rem', ease: 'power2.inOut' }, 0)
                .set(this.meshes[i].el, { marginBottom: '', ease: 'power2.inOut' }, 2.4);
            }
            animsel
              .to(
                this.meshes[this.onsel].mesh.program.uniforms.uZoom,
                { value: 1, duration: 0.9, ease: 'power2.inOut' },
                0
              )
              .to(this.meshes[this.onsel], { multx: 1, multy: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
              .to(
                this.meshes[this.onsel].el,
                { '--scx': 1, '--scy': 1, xPercent: 0, duration: 0.9, ease: 'power2.inOut' },
                0
              );

            wait = 0.45;
          } else {
            animsel
              .set(this.meshes[this.onsel].el, { marginBottom: '', ease: 'power2.inOut' }, 0)
              .to(
                this.meshes[this.onsel].mesh.program.uniforms.uZoom,
                { value: 1, duration: 0.9, ease: 'power2.inOut' },
                0
              )
              .to(this.meshes[this.onsel], { multx: 1, multy: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
              .to(
                this.meshes[this.onsel].el,
                { '--scx': 1, '--scy': 1, xPercent: 0, duration: 0.9, ease: 'power2.inOut' },
                0
              );
          }
          if (this.device > 1) {
          } else {
            if (this.meshes[this.onsel].id == 0) {
              if (this.meshes[this.onsel + 1])
                animsel.to(this.meshes[this.onsel + 1].el, { xPercent: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
              if (this.meshes[this.onsel + 2])
                animsel.to(this.meshes[this.onsel + 2].el, { xPercent: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
            } else if (
              this.meshes[this.onsel].id == 1 ||
              this.meshes[this.onsel].id == 4 ||
              this.meshes[this.onsel].id == 5
            ) {
              if (this.meshes[this.onsel + 1])
                animsel.to(this.meshes[this.onsel + 1].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
            } else if ((this.meshes[this.onsel].id == 2) | (this.meshes[this.onsel].id == 9)) {
              animsel.to(this.meshes[this.onsel - 1].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
            } else if (this.meshes[this.onsel].id == 3) {
              animsel
                .to(this.meshes[this.onsel - 1].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
                .to(this.meshes[this.onsel - 2].el, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
            } else if (this.meshes[this.onsel].id == 6 || this.meshes[this.onsel].id == 7) {
            }
          }
        }

        if (this.onsel != i) {
          let multi = 0.76;
          const anim = gsap
            .timeline({
              paused: true,
              onUpdate: (a) => {},
              onComplete: () => {
                this.onsel = this.onanim;
                this.onanim = -1;

                delete this.isload;
              },
            })
            .to(this.meshes[i].mesh.program.uniforms.uZoom, { value: 2, duration: 0.9, ease: 'power2.inOut' }, wait)
            .to(this.meshes[i], { mult: -6, duration: 0.25, ease: 'none' }, wait)
            .to(this.meshes[i], { mult: 1, duration: 0.35, ease: 'none' }, wait + 0.25);

          if (wait == 0) {
            anim;
          }

          if (this.device > 1) {
            let x = 0;
            if (i % 2 == 0) {
              x = this.calculator[2] * -100;
            }
            anim
              .to(
                this.meshes[i],
                {
                  multx: this.calculator[0],
                  multy: this.calculator[1],
                  duration: 1.2,
                  ease: 'power2.inOut',
                },
                wait * multi
              )
              .to(
                this.meshes[i].el,
                {
                  '--scx': this.calculator[0],
                  '--scy': this.calculator[1],
                  xPercent: x,
                  duration: 1.2,
                  ease: 'power2.inOut',
                },
                wait * multi
              );
          } else {
            if (this.meshes[i].id == 0) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                );

              if (this.meshes[i + 1])
                anim.to(this.meshes[i + 1].el, { xPercent: 52, duration: 0.9, ease: 'power2.inOut' }, wait);
              if (this.meshes[i + 2])
                anim.to(this.meshes[i + 2].el, { xPercent: 52, duration: 0.9, ease: 'power2.inOut' }, wait);
            } else if (this.meshes[i].id == 1 || this.meshes[i].id == 4) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    xPercent: -104,
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                );

              if (this.meshes[i + 1])
                anim.to(this.meshes[i + 1].el, { xPercent: 50, duration: 0.9, ease: 'power2.inOut' }, wait);
            } else if (this.meshes[i].id == 2) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    xPercent: -104,
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )

                .to(this.meshes[i - 1].el, { xPercent: -104, duration: 0.9, ease: 'power2.inOut' }, wait);
            } else if (this.meshes[i].id == 3) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    xPercent: -156,
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )

                .to(this.meshes[i - 2].el, { xPercent: -52, duration: 0.9, ease: 'power2.inOut' }, wait)
                .to(this.meshes[i - 1].el, { xPercent: -52, duration: 0.9, ease: 'power2.inOut' }, wait);
            } else if (this.meshes[i].id == 5) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                );

              if (this.meshes[i + 1])
                anim.to(this.meshes[i + 1].el, { xPercent: 50, duration: 0.9, ease: 'power2.inOut' }, wait);
            } else if (this.meshes[i].id == 6 || this.meshes[i].id == 11) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    xPercent: -104,
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                );
            } else if (this.meshes[i].id == 7 || this.meshes[i].id == 10) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                );
            } else if (this.meshes[i].id == 8) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    xPercent: -156,
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                );
            } else if (this.meshes[i].id == 9) {
              anim
                .to(
                  this.meshes[i],
                  {
                    multx: this.calculator[0],
                    multy: this.calculator[1],
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(
                  this.meshes[i].el,
                  {
                    '--scx': this.calculator[0],
                    '--scy': this.calculator[1],
                    xPercent: -156,
                    duration: 1.2,
                    ease: 'power2.inOut',
                  },
                  wait * multi
                )
                .to(this.meshes[i - 1].el, { xPercent: -52, duration: 0.9, ease: 'power2.inOut' }, wait);
            }
          }
          if (this.onsel != undefined) {
            animsel.play();
          }
          anim.play();
        } else {
          if (this.onsel != undefined) {
            await animsel.play();
            console.log(animsel);
          }
          delete this.onsel;
          delete this.isload;
          this.onanim = -1;
        }
      };
      this.enFn = (el, e, i) => {
        const bound = el.getBoundingClientRect();
        this.boundh = [bound.x, bound.width, i, 0, 0];
      };

      this.mvFn = (qck, e) => {
        if (!this.boundh) {
          return false;
        }

        this.boundh[3] = e.touches ? e.touches[0].clientX : e.clientX;

        //MAP SCREEN

        const norm = (this.boundh[3] - this.boundh[0]) / this.boundh[1];

        this.boundh[4] = norm - 0.5;
      };

      this.lvFn = (qck, e) => {
        delete this.boundh;
        qck(0);
      };

      a.querySelector('.el_md .cv').onmouseenter = (e) => this.enFn(a.querySelector('.el_md .cv'), e, i);
      a.querySelector('.el_md .cv').onmousemove = (e) => this.mvFn(this.meshes[i].qck, e);
      a.querySelector('.el_md .cv').onmouseleave = (e) => this.lvFn(this.meshes[i].qck, e);

      this.meshes[i].animin = gsap.timeline({
        paused: true,
        onUpdate: () => {},
      });
      let params = [0, 3];
      let splits = b.querySelectorAll('.char');
      let times = [0.22, 0.05, 0.16, 0.05, 0.016];
      this.meshes[i].animin.set(b, { opacity: 1 }, 0);
      for (let [h, c] of splits.entries()) {
        let n = c.querySelector('.n');

        this.meshes[i].animin
          .set(c, { opacity: 1 }, 0)
          .to(
            n,
            { opacity: 1, duration: times[0], immediateRender: false, ease: 'power4.inOut' },
            h * times[1] + params[0]
          );

        for (let [z, f] of c.querySelectorAll('.f').entries()) {
          this.meshes[i].animin
            .set(f, { opacity: 0, display: 'block' }, 0)
            .fromTo(
              f,
              { scaleX: 1, opacity: 1 },
              {
                scaleX: 0,
                opacity: 0,
                immediateRender: false,
                duration: times[2],
                ease: 'power4.inOut',
              },
              params[0] + (h * times[3] + (1 + z) * times[4])
            )
            .set(f, { display: 'none' }, '>');
        }
      }

      a.onmouseenter = () => {
        this.meshes[i].animin.pause();
        this.meshes[i].animin.timeScale(1);
        this.meshes[i].animin.progress(0);
        this.meshes[i].animin.play();
      };

      a.onmouseleave = () => {
        this.meshes[i].animin.pause();
        this.meshes[i].animin.timeScale(2.4);
        this.meshes[i].animin.reverse();
      };
    }
  }
  removeEvents() {
    this.active = -2;

    delete this.boundh;

    let anim = gsap.timeline({
      onUpdate: () => {
        this.renderer.render({ scene: this.scene, camera: this.camera });
      },
      onComplete: () => {
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
        this.canvas.remove();
      },
    });

    for (let [i, a] of this.mmap.entries()) {
      anim.to(this.meshes[a].mesh.program.uniforms.uMouse, { value: -1.5, duration: 1, ease: 'power2.inOut' }, 0);
      this.meshes[a].el.classList.remove('act');
    }
    anim.to(
      this.canvas,
      {
        webkitFilter: 'blur(' + 6 + 'px)',
        filter: 'blur(' + 6 + 'px)',
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0.4
    );
  }
  onResize(viewport, screen) {
    this.viewport = [viewport.w, viewport.h];
    this.screen = [screen.w, screen.h];

    let bound = this.sizer.getBoundingClientRect();
    this.bound = [bound.x, bound.y, bound.width, bound.height];

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.perspective({
      aspect: this.renderer.gl.canvas.clientWidth / this.renderer.gl.canvas.clientHeight,
    });

    this.camera.fov = 45;
    this.camera.position.set(0, 0, 7);

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = [width, height];

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.updateScale();
    this.updateX();
    this.updateY(window.scrollY, true);
  }

  lerp(value1, value2, t) {
    return value1 * (1 - t) + value2 * t;
  }
}

Base.prototype.check = check;
Base.prototype.checkEl = checkEl;
Base.prototype.start = start;
Base.prototype.stop = stop;
Base.prototype.updateX = updateX;
Base.prototype.updateY = updateY;
Base.prototype.updateAnim = updateAnim;
Base.prototype.updateScale = updateScale;

export default Base;
