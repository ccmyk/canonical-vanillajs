import Page from '@/js/pagemain.js';

//COMPS
import Intro from './0Intro/index.js';
import Scr from './1Dual/io.js';

class Home extends Page {
  constructor(main) {
    super(main);
  }

  async create(content, main, temp = undefined) {
    super.create(content, main);
    const hasTempContent = typeof temp === 'string' ? temp.trim().length > 0 : temp != null;
    if (hasTempContent) {
      document.querySelector('#content').insertAdjacentHTML('afterbegin', temp);
    } else {
      let data = await this.loadAppData({
        id: content.dataset.id,
        template: content.dataset.template,
      });
      document.querySelector('#content').insertAdjacentHTML('afterbegin', data.csskfields.main);
    }
    this.el = document.querySelector('#content main') || document.querySelector('main');
    if (!this.el) {
      console.error('[About] Missing <main> element in loaded content');
      return;
    }

    this.DOM = {
      el: this.el,
    };

    if (this.main.webgl == 0) {
      await this.loadImages();
      await this.loadVideos();
    }

    await this.createComps();
    await this.createIos();

    await this.getReady();
  }
  iOpage(animobj) {
    if (animobj.el.classList.contains('iO-scr')) {
      animobj.class = new Scr(animobj, this.main.device, this.main.touch);
    }
    return animobj;
  }

  async createComps() {
    await super.createComps();
    if (this.DOM.el.querySelector('.about_intro')) {
      this.components.intro = new Intro(this.DOM.el.querySelector('.about_intro'), this.main.device);
    }

    const i = this.DOM.el.querySelector('.about_list .Awrite i');

    for (const a of this.DOM.el.querySelectorAll('.about_dual .cnt_t a')) {
      a.insertAdjacentElement('beforeend', i.cloneNode(true));
    }

    if (this.main.device > 1) {
      for (const a of this.DOM.el.querySelectorAll('.about_list .Awrite .iO')) {
        a.parentNode.classList.add('ivi');
        a.parentNode.classList.add('nono');

        a.remove();
      }
    }
  }

  async animIntro(val) {
    return val;
  }

  async animOut() {
    if (this.DOM.el.querySelector('.iO.goout')) {
      this.ios[this.DOM.el.querySelector('.iO.goout').dataset.io].class.active = 0;
      gsap.to(this.ios[this.DOM.el.querySelector('.iO.goout').dataset.io].class.anim, {
        progress: 0,
        duration: 0.8,
        ease: 'Power2.inOut',
      });
    } else {
      gsap.to('.about_dual .cnt_t', { opacity: 0, duration: 0.8, ease: 'Power2.inOut' });
    }

    super.animOut();
  }
}

export default Home;
