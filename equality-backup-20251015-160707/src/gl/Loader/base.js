import { check, start, stop, updateX, updateY, updateScale } from './position.js';

import { Vec2 } from 'ogl';

class Base {
  constructor(obj) {
    this.pos = obj.pos;
    this.renderer = obj.renderer;
    this.mesh = obj.mesh;
    this.canvas = obj.canvas;
    this.program = obj.mesh.program;

    this.active = -1;
    this.isready = 0;

    this.initEvents();
  }

  update(time, speed, pos) {
    if (!this.renderer) {
      return false;
    }
    this.program.uniforms.uTime.value = time || 0;
    this.renderer.render({ scene: this.mesh });
  }
  removeEvents() {
    this.active = 0;
    this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
    this.canvas.remove();
  }
  initEvents() {
    this.animstart = gsap
      .timeline({
        paused: true,
        onComplete: () => {
          this.active = 0;
        },
      })
      //FIRST OPTION, MUY LARGA Y DEMASIADO DETALLE

      //OPCIÓN MONTAÑA, NO LE GUSTA A EVA PERO BIEN DE TIMINGS

      //MUY POQUITA MONTAÑA, MI OPCIÓN, SI LE QUITO EL MULTIX, SE NOTA UN PELÍN MÁS la montaña
      .fromTo(this.program.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uMultiX, { value: -0.4 }, { value: 0.1, duration: 2, ease: 'power2.inOut' }, 0)

      .fromTo(this.program.uniforms.uStartY, { value: 0.1 }, { value: 0.95, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uMultiY, { value: 0.45 }, { value: 0.3, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(this.program.uniforms.uStart2, { value: 1 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0.6);

    this.animstart.timeScale(1.4);
  }
  onResize(viewport, screen) {
    this.viewport = [viewport.w, viewport.h];
    this.screen = [screen.w, screen.h];

    this.bound = [0, 0, screen.w, screen.h];
    if (this.renderer) {
      this.renderer.setSize(screen.w, screen.h);
      this.program.uniforms.uResolution.value = [screen.w, screen.h];
    }
  }
}

Base.prototype.check = check;
Base.prototype.start = start;
Base.prototype.stop = stop;
Base.prototype.updateX = updateX;
Base.prototype.updateY = updateY;
Base.prototype.updateScale = updateScale;

export default Base;
