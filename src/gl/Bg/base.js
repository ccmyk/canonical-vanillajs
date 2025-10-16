import { check, start, stop, updateX, updateY, updateAnim, updateScale } from './position.js';

import { Vec2 } from 'ogl';

class Base {
  constructor(obj) {
    this.el = obj.el;
    this.pos = obj.pos;
    this.renderer = obj.renderer;
    this.mesh = obj.mesh;
    this.canvas = obj.canvas;
    this.program = obj.mesh.program;

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
    this.initEvents();
  }

  update(time, speed, pos) {
    if (!this.renderer) {
      return false;
    }
    if (this.isready == 0 || this.active != 1) {
      return false;
    }

    if (this.ctr.actual != pos) {
      this.ctr.actual = pos;
      this.updateY(pos);

      if (this.ctr.stop != 1) {
        this.updateAnim();
      }
      this.program.uniforms.uTime.value = time || 0;
    }
  }
  initEvents() {
    this.animstart = gsap
      .timeline({
        paused: true,
        onUpdate: () => {
          this.renderer.render({ scene: this.mesh });
        },
        onComplete: () => {},
      })
      //FIRST OPTION, MUY LARGA Y DEMASIADO DETALLE

      //OPCIÓN MONTAÑA, NO LE GUSTA A EVA PERO BIEN DE TIMINGS

      .fromTo('.home_about .cnt_tp', { opacity: 1 }, { opacity: 0, duration: 0.15 }, 0.9)

      //MUY POQUITA MONTAÑA, MI OPCIÓN, SI LE QUITO EL MULTIX, SE NOTA UN PELÍN MÁS la montaña
      .fromTo(this.program.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uMultiX, { value: -0.4 }, { value: 0.1, duration: 2, ease: 'power2.inOut' }, 0)

      .fromTo(this.program.uniforms.uStartY, { value: 0.1 }, { value: 0.95, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uMultiY, { value: 0.45 }, { value: 0.3, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uStart2, { value: 1 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0.6)

      .fromTo(
        '.nav',
        { '--dark': '#F8F6F2', '--gray': '#8A8A8A', '--light': '#000' },
        { '--dark': '#000', '--gray': '#8A8A8A', '--light': '#F8F6F2', duration: 0.5 },
        0.1
      );
    this.animstart.progress(1);
  }
  removeEvents() {
    this.active = -2;
    gsap
      .timeline({
        onUpdate: () => {
          this.renderer.render({ scene: this.mesh });
        },
        onComplete: () => {
          this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
          this.canvas.remove();
        },
      })
      .to('.home_about .cnt_tp', { opacity: 0, duration: 0.6 }, 0)
      .to(this.program.uniforms.uStart0, { value: 1, duration: 0.4, ease: 'power2.inOut' }, 0)
      .to(this.program.uniforms.uStartX, { value: -0.1, duration: 1, ease: 'power2.inOut' }, 0)
      .to(this.program.uniforms.uMultiX, { value: 0.1, duration: 1, ease: 'power2.inOut' }, 0)

      .to(this.program.uniforms.uStartY, { value: 0.95, duration: 1, ease: 'power2.inOut' }, 0)
      .to(this.program.uniforms.uMultiY, { value: 0.3, duration: 1, ease: 'power2.inOut' }, 0)
      .to(this.program.uniforms.uStart2, { value: 0, duration: 0.5, ease: 'power2.inOut' }, 0.3)
      .to('.nav', { '--dark': '#000', '--light': '#F8F6F2', duration: 0.5 }, 0);
  }
  onResize(viewport, screen) {
    this.viewport = [viewport.w, viewport.h];
    this.screen = [screen.w, screen.h];

    // Get both the element and the Mbg element
    let bound = this.el.getBoundingClientRect();
    const mbgElement = document.querySelector('.Mbg');
    const mbgBounds = mbgElement ? mbgElement.getBoundingClientRect() : bound;

    this.bound = [bound.x, bound.y, bound.width, bound.height];
    let calc = 0;

    this.ctr.start = parseInt(bound.y - screen.h + window.scrollY);
    this.ctr.limit = parseInt(bound.height + calc);

    if (this.renderer) {
      // Match canvas size to the Mbg element's dimensions
      if (mbgElement) {
        const dpr = Math.min(Math.max(window.devicePixelRatio, 1.5), 2);
        this.renderer.setSize(mbgBounds.width, mbgBounds.height);
      } else {
        this.renderer.setSize(screen.w, screen.h);
      }
      this.program.uniforms.uResolution.value = [this.renderer.width, this.renderer.height];
    }
  }
}

Base.prototype.check = check;
Base.prototype.start = start;
Base.prototype.stop = stop;
Base.prototype.updateX = updateX;
Base.prototype.updateY = updateY;
Base.prototype.updateAnim = updateAnim;
Base.prototype.updateScale = updateScale;

export default Base;
