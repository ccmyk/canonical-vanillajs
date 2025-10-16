export default class {
  constructor(el, device) {
    this.DOM = {
      el: el,
    };
    this.device = device;
    this.active = 0;

    this.create();
  }

  async create() {}

  async start() {}
  initEvents() {}

  removeEvents() {}

  onResize() {}
}
