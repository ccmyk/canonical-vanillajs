import { create, createScene, createCamera, cleanTemp, createTemp, createIos, show } from './create.js';

import { createEls, createMSDF, createTex, createAssets } from './els.js';

import { callIos, loadIos, showIos, checkIo } from './ios.js';

import { onResize, update, timeout, loadImage, loadVideo } from './events.js';

class Canvas {
  constructor(main) {
    this.main = main;

    this.viewport = {
      w: 1,
      h: 1,
    };

    this.isVisible = 0;

    this.ios = [];
    this.iosmap = new Map();
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async changeSlides(st = 0) {
    let foot = null;
    if (st == 1) {
      for (let [i, a] of this.iosmap.entries()) {
        if (a.name == 'Slides') {
          a.changeState(st);
        }
      }

      await window.waiter(1400);

      for (let [i, a] of this.iosmap.entries()) {
        if (a.name == 'Roll') {
          a.changeState(st);
        } else if (a.name == 'Footer') {
          foot = a;
        }
      }
    } else {
      for (let [i, a] of this.iosmap.entries()) {
        if (a.name == 'Roll') {
          a.changeState(st);
        }
      }

      for (let [i, a] of this.iosmap.entries()) {
        if (a.name == 'Slides') {
          a.changeState(st);
        } else if (a.name == 'Footer') {
          foot = a;
        }
      }
      await window.waiter(800);
    }

    if (foot) {
      foot.onResize(this.viewport, this.main.screen);
    }
  }
}

Canvas.prototype.create = create;
Canvas.prototype.createScene = createScene;
Canvas.prototype.createCamera = createCamera;
Canvas.prototype.cleanTemp = cleanTemp;
Canvas.prototype.createTemp = createTemp;
Canvas.prototype.createIos = createIos;
Canvas.prototype.show = show;

Canvas.prototype.createMSDF = createMSDF;
Canvas.prototype.createAssets = createAssets;
Canvas.prototype.createEls = createEls;
Canvas.prototype.createTex = createTex;

Canvas.prototype.callIos = callIos;
Canvas.prototype.loadIos = loadIos;
Canvas.prototype.showIos = showIos;
Canvas.prototype.checkIo = checkIo;

Canvas.prototype.onResize = onResize;
Canvas.prototype.update = update;
Canvas.prototype.timeout = timeout;
Canvas.prototype.loadImage = loadImage;
Canvas.prototype.loadVideo = loadVideo;

export default Canvas;
