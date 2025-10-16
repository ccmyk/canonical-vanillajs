export default class {
  constructor(el, device) {
    this.DOM = {
      el: el,
      num: el.querySelector('.cnt_n .tt3'),
      title: el.querySelector('.cnt_t .tt3'),
    };
    this.device = device;
    this.active = 0;

    this.create();
  }

  async create() {}

  async start() {
    this.DOM.num.classList.add('stview', 'inview');
    this.DOM.title.classList.add('stview', 'inview');
    await window.waiter(600);
  }
  set() {
    this.DOM.num.classList.add('notran');
    this.DOM.title.classList.add('notran');
    this.DOM.num.classList.add('stview', 'inview');
    this.DOM.title.classList.add('stview', 'inview');
    document.querySelector('.faketit').remove();

    setTimeout(() => {
      this.DOM.num.classList.remove('notran');
      this.DOM.title.classList.remove('notran');
    }, 1000);
  }
  initEvents() {}

  removeEvents() {}

  onResize() {}
}
