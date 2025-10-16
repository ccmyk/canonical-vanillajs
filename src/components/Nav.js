class Nav {
  constructor(main) {
    this.main = main;
    this.isOpen = 0;
  }

  async create(temp) {
    if (!temp) {
      console.error('[Nav] No navigation HTML template provided');
      return;
    }

    try {
      document.querySelector('body').insertAdjacentHTML('afterbegin', temp);

      let el = document.querySelector('.nav');
      if (!el) {
        console.error('[Nav] Could not find .nav element after injection');
        return;
      }

      this.DOM = {
        el: el,
        burger: el.querySelector('.nav_burger'),
        els: el.querySelectorAll('.nav_right a'),
        city: el.querySelector('.nav_clock_p'),
        c: el.querySelector('.nav_logo'),
        h: el.querySelector('.nav_clock_h'),
        m: el.querySelector('.nav_clock_m'),
        a: el.querySelector('.nav_clock_a'),
      };

      // Verify critical elements
      if (!this.DOM.c) console.warn('[Nav] Missing nav_logo element');
      if (!this.DOM.h || !this.DOM.m || !this.DOM.a) console.warn('[Nav] Missing clock elements');
    } catch (error) {
      console.error('[Nav] Error creating navigation:', error);
    }

    this.DOM.el.style.opacity = 0;

    let date = new Date();

    this.time = performance.now();
    let h = date.getHours();
    let m = date.getMinutes();

    this.clockact = 0;

    //LOGO

    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = this.DOM.c;
    document.dispatchEvent(this.main.events.anim);

    //CITY

    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = this.DOM.city;
    document.dispatchEvent(this.main.events.anim);

    //HOUR

    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = this.DOM.h;
    document.dispatchEvent(this.main.events.anim);

    //MINUTE

    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = this.DOM.m;
    document.dispatchEvent(this.main.events.anim);

    //AMPM
    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = this.DOM.a;
    document.dispatchEvent(this.main.events.anim);

    this.searchAMPM();
    this.setTime(h, m);

    this.initEvents();
  }
  setTime(hour = null, minute = null) {
    console.log('setTime called with:', hour, minute);

    let m = minute;
    if (minute == null) {
      console.log('Trying to read minute from DOM...');
      const charElements = this.DOM.m.querySelectorAll('.char');
      console.log('Found', charElements.length, 'char elements in minute element');

      if (charElements.length < 2) {
        console.log('Not enough char elements, using current time');
        m = new Date().getMinutes();
      } else {
        m = parseInt(
          this.DOM.m.querySelectorAll('.char')[0].querySelector('.n').innerHTML +
            this.DOM.m.querySelectorAll('.char')[1].querySelector('.n').innerHTML
        );
        m++;

        let mi = new Date().getMinutes();
        if (mi != m) {
          m = mi;
        }
      }
    }

    let h = hour;

    if (hour == null || m == 60) {
      this.searchAMPM();

      if (m == 60 && minute == null) {
        m = 0;
      }
    }

    if (m < 10) {
      m = '0' + m;
    }

    m = m.toString();

    console.log('Setting minute to:', m);
    const minuteCharElements = this.DOM.m.querySelectorAll('.char');

    if (minuteCharElements.length >= 2) {
      console.log('Updating minute char elements');
      this.DOM.m.querySelectorAll('.char')[0].querySelector('.n').classList.add('eee1');
      this.DOM.m.querySelectorAll('.char')[0].querySelector('.n').innerHTML = m[0];
      this.DOM.m.querySelectorAll('.char')[1].querySelector('.n').innerHTML = m[1];
    } else {
      console.log('No char elements found, setting textContent directly');
      this.DOM.m.textContent = m;
    }

    if (this.clockact == 1) {
      this.main.events.anim.detail.state = 1;
      this.main.events.anim.detail.el = this.DOM.m;
      document.dispatchEvent(this.main.events.anim);
    }
  }
  searchAMPM(h = null) {
    if (h == null) {
      let date = new Date();
      h = date.getHours();
    }

    if (h >= 12) {
      this.DOM.a.querySelectorAll('.char')[1].querySelector('.n').innerHTML = 'M';
      if (h > 12) {
        h = h - 12;

        this.DOM.a.querySelectorAll('.char')[0].querySelector('.n').innerHTML = 'P';
      }
    } else {
      this.DOM.a.querySelectorAll('.char')[0].querySelector('.n').innerHTML = 'A';
    }

    if (h < 10) {
      h = '0' + h;
    }

    const actualh = parseInt(
      this.DOM.h.querySelectorAll('.char')[0].querySelector('.n').innerHTML +
        this.DOM.h.querySelectorAll('.char')[1].querySelector('.n').innerHTML
    );

    this.DOM.h.querySelectorAll('.char')[0].querySelector('.n').innerHTML = h.toString()[0];
    this.DOM.h.querySelectorAll('.char')[1].querySelector('.n').innerHTML = h.toString()[1];

    if (h == actualh) {
      return h;
    }

    if (this.clockact == 1) {
      this.main.events.anim.detail.state = 1;
      this.main.events.anim.detail.el = this.DOM.h;
      document.dispatchEvent(this.main.events.anim);
    }

    return h;
  }
  async openMenu() {
    document.documentElement.classList.add('act-menu');
    document.dispatchEvent(this.main.events.openmenu);
  }
  async closeMenu() {
    document.documentElement.classList.remove('act-menu');
    document.dispatchEvent(this.main.events.closemenu);
  }

  async show() {
    this.DOM.el.style.opacity = 1;

    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = this.DOM.c;
    document.dispatchEvent(this.main.events.anim);

    this.DOM.c.onmouseenter = () => {
      this.main.events.anim.detail.state = 1;
      this.main.events.anim.detail.el = this.DOM.c;
      document.dispatchEvent(this.main.events.anim);
    };

    this.DOM.el.querySelector('.nav_clock_s').style.opacity = 1;

    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = this.DOM.city;
    document.dispatchEvent(this.main.events.anim);

    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = this.DOM.h;
    document.dispatchEvent(this.main.events.anim);

    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = this.DOM.m;
    document.dispatchEvent(this.main.events.anim);

    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = this.DOM.a;
    document.dispatchEvent(this.main.events.anim);

    for (let [i, a] of this.DOM.els.entries()) {
      this.main.events.anim.detail.el = a;
      this.main.events.anim.detail.state = 0;
      document.dispatchEvent(this.main.events.anim);
      this.main.events.anim.detail.state = 1;
      document.dispatchEvent(this.main.events.anim);

      a.onmouseenter = () => {
        this.main.events.anim.detail.el = a;
        this.main.events.anim.detail.state = 1;
        document.dispatchEvent(this.main.events.anim);
      };
    }

    this.clockact = 1;
  }
  async hide() {
    this.DOM.el.style.opacity = 0;
  }

  initEvents() {
    if (this.DOM.burger) {
      this.DOM.burger.onclick = () => {
        if (this.isOpen == 1) {
          this.closeMenu();
          this.isOpen = 0;
        } else {
          this.openMenu();
          this.isOpen = 1;
        }
      };
    }
    if (this.DOM.els) {
      this.els = [];
    }
  }

  onResize() {}
  update(time) {
    if (this.time + 60010 <= time) {
      this.time = time;

      this.setTime();
    }
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default Nav;
