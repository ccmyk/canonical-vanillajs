import Page from '@/js/pagemain.js';

//COMPS
import Intro from './0Intro/index.js';
import In from './0Intro/ioin.js';
import Nxt from './0Intro/io.js';

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
      // Load page data when navigating without inline HTML snapshot
      const data = await this.loadAppData({
        id: content.dataset.id,
        template: content.dataset.template,
      });
      document.querySelector('#content').insertAdjacentHTML('afterbegin', data.csskfields.main);
    }
    this.el = document.querySelector('#content main') || document.querySelector('main');
    if (!this.el) {
      console.error('[Project] Missing <main> element in loaded content');
      return;
    }

    this.DOM = {
      el: this.el,
    };

    await this.loadImages();
    await this.loadVideos();

    await this.createComps();
    await this.createIos();

    await this.getReady();
  }
  iOpage(animobj) {
    if (animobj.el.classList.contains('iO-outin')) {
      animobj.class = new In(animobj, this.main.device);
    } else if (animobj.el.classList.contains('iO-nxt')) {
      animobj.class = new Nxt(animobj, this.main.device, this.main.events.nextprj);
    }

    return animobj;
  }

  async createComps() {
    await super.createComps();
    if (this.DOM.el.querySelector('.project_intro')) {
      this.components.intro = new Intro(this.DOM.el.querySelector('.project_intro'), this.main.device);
    }
  }

  async animIntro(val) {
    if (document.querySelector('.faketit')) {
      this.components.intro.set();
    } else {
      await this.components.intro.start();
    }

    return val;
  }

  async animOut(btn, lenis) {
    const lds = this.DOM.el.querySelectorAll('.ivi.Ldd');
    for (const a of lds) {
      a.classList.remove('Ldd');
    }
    let t = '';
    let n = '';
    if (btn == null) {
      super.animOut();
      return true;
    } else if (btn.classList.contains('nxtPr')) {
      n = btn.querySelector('.cnt_n');
      t = btn.querySelector('.cnt_t');

      n.classList.add('nfo_n');
      t.classList.add('nfo_t');
      if (this.main.device < 2) {
        gsap.set(t, { x: 34.4 + 'rem' });
      }

      return [n, t];
    } else {
      super.animOut();
      return true;
    }
  }
}

export default Home;
