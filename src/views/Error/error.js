import Page from '@/js/pagemain.js';

//COMPS
import Intro from './0Intro/index.js';

class Home extends Page {
  constructor(main) {
    super(main);
  }

  async create(content, main, temp = undefined) {
    super.create(content, main);
    const base = (window.__BASE_PATH__ || import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    if (temp != undefined) {
      document.querySelector('#content').insertAdjacentHTML('afterbegin', temp);
    } else {
      // Use fallback HTML instead of WordPress REST API
      const fallbackHTML = `
        <main>
          <section class="error">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="${base}/">Return Home</a>
          </section>
        </main>
      `;
      document.querySelector('#content').insertAdjacentHTML('afterbegin', fallbackHTML);
    }
    this.el = document.querySelector('main');

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
