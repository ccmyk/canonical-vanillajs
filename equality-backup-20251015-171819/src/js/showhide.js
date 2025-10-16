//READY
export async function getReady() {
  this.cleanP();
  this.cleanWysi();
  await this.startComps();
}

//INTRO
export async function show() {
  this.showIos();
  this.onResize();
  await this.timeout(1);
}

export async function start(val = 0) {
  this.isVisible = 1;

  let result = await this.animIntro(val);
  this.callIos();
  return result;
}

export async function animIntro() {
  await gsap.fromTo(this.DOM.el, { opacity: 1, duration: 0.45, delay: 0.1 });
}
//OUT
export async function animOut() {
  if (this.main.isTouch) {
    this.DOM.el.classList.add('isGone');
  }
  for (let a of this.DOM.el.querySelectorAll('.inview')) {
    a.classList.remove('inview');
    a.classList.remove('stview');
    this.main.events.anim.detail.state = -1;
    this.main.events.anim.detail.el = a;
    document.dispatchEvent(this.main.events.anim);
  }
}

export async function hide() {
  this.isVisible = 0;
  this.stopComps();
}
