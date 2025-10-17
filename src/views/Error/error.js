import Page from '@/js/pagemain.js';

//COMPS
import Intro from './0Intro/index.js';

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
      const data = await this.loadAppData({
        id: content.dataset.id,
        template: content.dataset.template,
      });
      const fallbackHTML = `
        <main class="error">
          <section class="error_hero">
            <div class="c-vw cnt">
              <div class="cnt_hold">
                <h2 class="cnt_tt">Page not found</h2>
              </div>
              <div class="cnt_bt">
                <a class="Awrite Awrite-inv" href="/">Back to home</a>
              </div>
            </div>
          </section>
        </main>
      `;
      document
        .querySelector('#content')
        .insertAdjacentHTML('afterbegin', data.csskfields?.main || fallbackHTML);
    }
    this.el = document.querySelector('#content main') || document.querySelector('main');
    if (!this.el) {
      console.error('[Error] Missing <main> element in loaded content');
      return;
    }

    this.DOM = {
      el: this.el,
    };

    await this.createComps();
    await this.createIos();

    await this.getReady();
  }
  iOpage(animobj) {
    return animobj;
  }

  async createComps() {
    await super.createComps();
    if (this.DOM.el.querySelector('.error_intro')) {
      this.components.intro = new Intro(this.DOM.el.querySelector('.error_intro'), this.main.device);
    }
  }

  async animIntro(val) {
    if (this.components.intro) {
      this.components.intro.start();
    }

    return val;
  }

  async animOut() {
    super.animOut();
  }
}

export default Home;
