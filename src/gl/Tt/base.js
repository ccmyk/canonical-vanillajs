import { check, start, stop, updateX, updateY, updateScale } from './position.js';

import { Vec2, Renderer, Mesh, Transform, Camera } from 'ogl';

class Title {
  /**
   * @param {Object} obj
   * @param {HTMLElement} obj.el
   * @param {Object} obj.pos
   * @param {import('ogl').Renderer} obj.renderer
   * @param {import('ogl').Mesh} obj.mesh
   * @param {string} obj.text
   * @param {HTMLCanvasElement} obj.canvas
   * @param {number} obj.touch
   * @param {import('ogl').Transform} obj.scene
   * @param {import('ogl').Camera} obj.cam
   */
  constructor(obj) {
    this.el = obj.el;
    this.cnt = obj.el.parentNode ? obj.el.parentNode.querySelector('.cCover') : null;
    this.pos = obj.pos;
    this.renderer = obj.renderer;
    this.mesh = obj.mesh;
    this.text = obj.text;
    this.canvas = obj.canvas;
    this.touch = obj.touch;

    this.fstsize = window.innerWidth;

    this.scene = obj.scene;
    this.camera = obj.cam;

    this.lastx = 0;

    this.active = -1;
    this.isready = 0;

    this.coords = [0, 0];
    this.norm = [0, 0];
    this.end = [0, 0];
    this.lerp = 0.6;
    this.actualChar = -2;

    /** @type {number[]} */
    this.power = [];
    /** @type {number[]} */
    this.positioncur = [];
    /** @type {number[]} */
    this.positiontar = [];

    this.actualChar = -2;

    this.change = 0;
    this.stopt = 0;
    this.animstart = 0;

    /** @type {HTMLElement | null} */
    this.tt = null;
    /** @type {NodeListOf<Element> | null} */
    this.chars = null;
    /** @type {gsap.core.Timeline | null} */
    this.animin = null;
    /** @type {gsap.core.Timeline | null} */
    this.animout = null;

    this.initEvents();
  }

  /**
   * @param {number} time
   */
  update(time) {
    if (!this.renderer || this.active == 2) {
      return;
    } else {
      this.end[0] = lerp(this.end[0], this.norm[0], this.lerp);
    }

    this.mesh.program.uniforms.uMouse.value = new Vec2(this.end[0], 0);
    this.mesh.program.uniforms.uTime.value = time;

    this.positioncur = this.lerpArr(this.positioncur, this.positiontar, this.lerp);

    this.mesh.program.uniforms.uPowers.value = this.positioncur;

    if (this.stopt == 0) {
      this.renderer.render({ scene: this.scene, camera: this.camera });
    }
  }
  removeEvents() {
    this.tt?.classList.remove('act');

    this.lerp = 0.03;
    this.animout?.pause();
    this.animin?.pause();
    this.active = 2;

    this.mesh.program.uniforms.uKey.value = (this.chars?.length ?? 0) - 1;
    if (this.tt) this.calcChars(this.tt.clientWidth);

    this.positioncur = this.lerpArr(this.positioncur, this.positiontar, 1);

    gsap
      .timeline({
        onUpdate: () => {
          this.calcChars(0, -0.5);

          this.end[0] = lerp(this.end[0], this.norm[0], this.lerp);
          this.mesh.program.uniforms.uMouse.value = new Vec2(this.end[0], 0);
          this.positioncur = this.lerpArr(this.positioncur, this.positiontar, this.lerp);
          this.mesh.program.uniforms.uPowers.value = this.positioncur;

          this.renderer.render({ scene: this.scene, camera: this.camera });
        },
        onComplete: () => {
          this.renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
          this.canvas?.remove();
        },
      })
      .to(this.mesh.program.uniforms.uPower, { value: 1, duration: 0.8, ease: 'power4.inOut' }, 0)
      .to(
        this.cnt,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0
      );
  }
  initEvents() {
    //ANIM MOUSE IN
    this.animin = gsap
      .timeline({ paused: true })
      .to(
        this.mesh.program.uniforms.uPower,
        { value: 1, duration: 0.36, ease: 'power4.inOut', onComplete: () => {} },
        0
      );

    //ANIMOUT
    this.animout = gsap.timeline({ paused: true }).to(
      this.mesh.program.uniforms.uPower,
      {
        value: 0,
        duration: 0.6,
        ease: 'none',
        onComplete: () => {
          this.mesh.program.uniforms.uKey.value = -1;
        },
      },
      0
    );

    if (this.el.parentNode) {
      this.tt = this.el.parentNode.querySelector('.Oiel');
      if (this.tt) new window.SplitType(this.tt, { types: 'chars,words' });
    }

    this.getChars();
    if (this.el.dataset.nome) {
      return;
    }

    /** @param {MouseEvent | TouchEvent} e */
    this.inFn = (e) => {
      this.stopt = 0;
      this.lerp = 0.03;
      let out = 0;
      let lX = 0;
      if ('touches' in e) {
        lX = e.touches[0] ? e.touches[0].pageX - (this.bound?.[0] ?? 0) : 0;
      } else {
        lX = e.layerX;
      }
      if (lX < 60) {
        out = -0.5;
      } else {
        out = 0.5;
      }
      this.calcChars(lX, out);

      this.animout?.pause();
      this.animin?.play();
      this.lerp = 0.06;
    };

    /** @param {MouseEvent | TouchEvent} e */
    this.mvFn = (e) => {
      let lX = 0;
      if ('touches' in e) {
        lX = e.touches[0] ? e.touches[0].pageX - (this.bound?.[0] ?? 0) : 0;
      } else {
        lX = e.layerX;
      }
      this.calcChars(lX);
    };

    /** @param {MouseEvent | TouchEvent} e */
    this.lvFn = (e) => {
      let lX = 0;
      if ('touches' in e) {
        lX = e.touches[0] ? e.touches[0].pageX - (this.bound?.[0] ?? 0) : 0;
      } else {
        lX = e.layerX;
      }
      this.lerp = 0.03;
      let out = 0;
      if (lX < 60) {
        out = 0.5;
      } else {
        out = -0.5;
      }
      this.calcChars(lX, out);
      this.animin?.pause();
    };

    console.log('[Tt base.js] this.touch value:', this.touch, 'for element:', this.text);
    if (this.touch == 0) {
      if (this.tt) {
        this.tt.onmouseenter = (e) => this.inFn(e);
        this.tt.onmousemove = (e) => this.mvFn(e);
        this.tt.onmouseleave = (e) => this.lvFn(e);
      }
    } else {
      if (this.tt) {
        this.tt.ontouchstart = (e) => this.inFn(e);
        this.tt.ontouchmove = (e) => this.mvFn(e);
        this.tt.ontouchend = (e) => this.lvFn(e);
      }
    }

    /**
     * @param {any} _e
     * @param {number} i
     */
    this.charFn = (_e, i) => {
      this.mesh.program.uniforms.uKey.value = i;
      this.actualChar = i;
    };

    if (this.chars) {
      for (const [i, a] of this.chars.entries()) {
        if (this.touch == 0) {
          a.onmouseenter = (e) => this.charFn(e, i);
        } else {
          a.ontouchstart = (e) => this.charFn(e, i);
        }
      }
    }
  }

  getChars() {
    if (!this.tt) return;
    this.chars = this.tt.querySelectorAll('.char');

    this.charw = [];
    this.charsposw = [];
    this.totalw = 0;

    const arrw = [];
    const arrh = [];

    if (this.chars) {
      for (const a of this.chars) {
        this.positiontar.push(0.5);
        this.positioncur.push(0.5);

        this.charw.push(a.clientWidth);
        this.charsposw.push(this.totalw);
        this.totalw += a.clientWidth;

        arrw.push(a.clientWidth);
        arrw.push(a.clientWidth);
        arrh.push(a.clientHeight);
      }
    }

    this.mesh.program.uniforms.uWidth.value = arrw;
    this.mesh.program.uniforms.uHeight.value = arrh;
  }

  /**
   * @param {number} x
   * @param {number} [out]
   */
  calcChars(x, out) {
    this.lastx = x;
    const arr = [];
    let tot = 0;
    if (out != undefined) {
      for (let i = 0; i < (this.chars?.length ?? 0); i++) {
        arr.push(out);
      }
    } else {
      if (this.chars) {
        for (const [i] of this.chars.entries()) {
          tot = x - this.charsposw[i];
          tot = tot / this.charw[i];

          tot -= 0.5;
          tot = Math.min(Math.max(tot, -0.5), 0.5);
          arr.push(tot);
        }
      }
    }

    this.positiontar = arr;
  }

  onResize() {
    if (!this.cnt) return;
    const bound = this.cnt.getBoundingClientRect();
    console.log(`[Tt onResize] Element: ${this.text}`, 'Bounds:', bound);
    this.bound = [bound.x, bound.y, bound.width, bound.height];
    this.screen = [bound.width, bound.height];

    this.renderer.setSize(bound.width, bound.height);

    this.camera.perspective({
      aspect: this.renderer.gl.canvas.width / this.renderer.gl.canvas.height,
    });
    this.camera.fov = 45;
    this.camera.position.set(0, 0, 7);

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = [width, height];

    this.getChars();
  }

  /**
   * @param {any} value1
   * @param {any} value2
   * @param {number} t
   * @param {any} [out]
   */
  lerpArr(value1, value2, t, out) {
    if (typeof value1 == 'number' && typeof value2 == 'number') return lerp(value1, value2, t);
    else {
      //assume array
      const len = Math.min(value1.length, value2.length);
      out = out || new Array(len);
      for (let i = 0; i < len; i++) out[i] = lerp(value1[i], value2[i], t);
      return out;
    }
  }
}

Title.prototype.check = check;
Title.prototype.start = start;
Title.prototype.stop = stop;
Title.prototype.updateX = updateX;
Title.prototype.updateY = updateY;
Title.prototype.updateScale = updateScale;

export default Title;
