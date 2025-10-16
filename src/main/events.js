export function addEvents() {
  this.main.events = {
    startscroll: new Event('startscroll'),
    stopscroll: new Event('stopscroll'),
    scrollto: new CustomEvent('scrollto', {
      bubbles: true,
      detail: { id: '' },
    }),
    anim: new CustomEvent('anim', {
      detail: { el: '', state: 0, style: 0, params: [0] },
    }),
    nextprj: new CustomEvent('nextprj', {
      detail: { el: '', url: '' },
    }),
    newlinks: new Event('newlinks'),
    openmenu: new Event('openmenu'),
    closemenu: new Event('closemenu'),
  };

  document.addEventListener('startscroll', () => this.controlScroll(1));
  document.addEventListener('stopscroll', () => this.controlScroll(0));

  document.addEventListener('newlinks', () => {
    this.addLinks();
  });

  document.addEventListener('scrollto', (e) => {
    this.lenis.scrollTo('#' + e.target.dataset.goto, { offset: -100 });
  });

  document.addEventListener('openmenu', () => this.controlScroll(0));
  document.addEventListener('closemenu', () => this.controlScroll(1));

  document.addEventListener('nextprj', async (e) => {
    this.lenis.stop();
    this.lenis.scrollTo(this.page.DOM.el.querySelector('.project_nxt'), {
      duration: 0.3,
      force: true,
    });
    await window.waiter(300);

    this.onChange({
      url: e.detail.url,
      link: e.detail.el,
    });
  });

  document.addEventListener('anim', async (e) => {
    if (e.detail.style == 0) {
      if (e.detail.el.classList.contains('nono')) return false;
      this.writeFn(e.detail.el, e.detail.state);
    } else if (e.detail.style == 1) {
      this.lenis.scrollTo(0);
      await window.waiter(600);
      this.controlScroll(0);
      Promise.all([this.gl.changeSlides(e.detail.state)]).then(() => {
        this.controlScroll(1);
      });
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (this.isload == 1) return false;
    if (document.visibilityState == 'hidden') {
      this.lenis.stop();
      window.cancelAnimationFrame(this.upid);
    } else {
      this.lenis.start();
      this.update(performance.now());
    }
  });

  window.addEventListener('popstate', (e) => this.onPopState(e), {
    passive: true,
  });

  window.addEventListener(
    'resize',
    () => {
      clearTimeout(this.res);
      this.res = setTimeout(this.onResize, 400);
    },
    { passive: true }
  );

  if (this.main.isTouch) {
    window.addEventListener('orientationchange', () => {
      location.reload();
    });
  }
}

export function onResize() {
  this.main.design.L.total = (this.main.design.L.w / window.innerWidth) * 10;
  this.main.design.L.total = 10 - (10 - this.main.design.L.total) * this.main.design.L.multi;
  this.main.design.L.total = Math.min(10, this.main.design.L.total);

  this.main.design.P.total = (this.main.design.P.w / window.innerWidth) * 10;
  this.main.design.P.total = 10 - (10 - this.main.design.P.total) * this.main.design.P.multi;
  this.main.design.P.total = Math.min(10, this.main.design.P.total);

  document.documentElement.style.setProperty('--ck_multiL', this.main.design.L.total);
  document.documentElement.style.setProperty('--ck_multiP', this.main.design.P.total);

  if (this.main.isTouch) {
    document.documentElement.style.setProperty('--ck_hscr', window.screen.height + 'px');
    document.documentElement.style.setProperty('--ck_hmin', document.documentElement.clientHeight + 'px');
    gsap.to(document.documentElement, { '--ck_hvar': window.innerHeight + 'px', duration: 0.4 });

    const isTouch =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.platform == 'MacIntel' && navigator.maxTouchPoints > 1);

    if (!isTouch) location.reload();
  } else {
    document.documentElement.style.setProperty('--ck_hscr', window.innerHeight + 'px');
    document.documentElement.style.setProperty('--ck_hvar', window.innerHeight + 'px');
    document.documentElement.style.setProperty('--ck_hmin', window.innerHeight + 'px');

    const isTouch =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.platform == 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isTouch) location.reload();
  }

  this.main.screen.w = window.innerWidth;
  this.main.screen.h = window.innerHeight;

  if (this.gl?.onResize) {
    this.gl.main.screen.w = window.innerWidth;
    this.gl.main.screen.h = window.innerHeight;
    this.gl.onResize();
  }

  if (this.page) {
    this.page.main.screen.w = window.innerWidth;
    this.page.main.screen.h = window.innerHeight;
    this.page.onResize();
  }

  if (this.mouse) {
    this.mouse.main.screen.w = window.innerWidth;
    this.mouse.main.screen.h = window.innerHeight;
  }

  if (this.nav) {
    this.nav.main.screen.w = window.innerWidth;
    this.nav.main.screen.h = window.innerHeight;
    this.nav.onResize();
  }
}
