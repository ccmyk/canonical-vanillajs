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
        <main>
          <section class="playground">
            <h1>Playground</h1>
            <p>Experimental projects and creative explorations</p>
          </section>
        </main>
      `;

      document
        .querySelector('#content')
        .insertAdjacentHTML('afterbegin', data.csskfields?.main || fallbackHTML);
    }
    this.el = document.querySelector('#content main') || document.querySelector('main');
    if (!this.el) {
      console.error('[Playground] Missing <main> element in loaded content');
      return;
    }

    this.DOM = {
      el: this.el,
    };

    if (this.main.webgl == 0 || this.main.device > 0) {
      document.documentElement.classList.add('NOGL');
      this.posel = -1;
      await this.loadImages();
      await this.loadVideos();

      if (this.main.device == 1) {
        this.DOM.el.classList.add('noclick');
      }

      this.els = this.DOM.el.querySelectorAll('.el');

      for (let [i, a] of this.els.entries()) {
        let b = a.querySelector('.el_b .Awrite');

        this.main.events.anim.detail.state = 0;
        this.main.events.anim.detail.el = b;

        document.dispatchEvent(this.main.events.anim);

        a.querySelector('.el_md').onclick = async () => {
          if (this.posel != -1) {
            this.els[this.posel].classList.remove('wact');

            let h = this.els[this.posel].querySelector('.el_b .Awrite');
            this.main.events.anim.detail.state = -1;
            this.main.events.anim.detail.el = h;
            document.dispatchEvent(this.main.events.anim);

            if (this.posel == i) {
              this.posel = -1;
              return false;
            }
          }
          this.posel = i;
          this.main.events.anim.detail.state = 1;
          this.main.events.anim.detail.el = b;
          document.dispatchEvent(this.main.events.anim);

          this.els[this.posel].classList.add('wact');
        };
      }
    }

    await this.createComps();
    await this.createIos();

    await this.getReady();
  }
  iOpage(animobj) {
    return animobj;
  }

  async createComps() {
    await super.createComps();

    let cont = 0;
    for (let a of this.DOM.el.querySelectorAll('.el')) {
      a.classList.add('el-' + cont);

      cont++;
      if (cont == 12) {
        cont = 0;
      }
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
