export function onResize() {
  for (let [i, a] of this.iosmap.entries()) {
    if (a.onResize) a.onResize(this.viewport, this.main.screen);
  }
  if (this.loader) {
    this.loader.onResize(this.viewport, this.main.screen);
  }
}

export function update(time, wheel, pos) {
  if (this.loader) {
    if (this.loader.active != 0) {
      this.loader.update(time, wheel, pos);
    } else if (this.loader.active == 0) {
      this.loader.removeEvents();
      delete this.loader;
    }
  }
  if (this.isVisible == 0) {
    return false;
  }

  let renderme = 0;

  if (this.ios) {
    for (let [i, a] of this.iosmap.entries()) {
      if (a.active == 1) {
        a.update(time, wheel, pos);
      }
    }
  }
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadImage(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = '';

    img.onload = () => {
      resolve(img);
    };

    img.src = url;

    img.onerror = (e) => {
      resolve(img);
    };
  });
}

function cleanVid(elem) {
  elem.oncanplay = null;
  elem.onplay = null;
  elem.currentTime = 0;

  let isPlaying =
    elem.currentTime > 0 && !elem.paused && !elem.ended && elem.readyState > elem.HAVE_CURRENT_DATA;

  elem.pause();
}

export async function loadVideo(elem, url) {
  return new Promise((resolve, reject) => {
    // Safety check for elem parameter
    if (!elem) {
      console.warn('loadVideo called with undefined element');
      resolve(null);
      return;
    }

    if (elem.dataset && elem.dataset.loop) {
      elem.loop = false;
    } else {
      elem.loop = true;
    }
    elem.muted = true;
    elem.autoplay = true;
    elem.setAttribute('webkit-playsinline', 'webkit-playsinline');
    elem.setAttribute('playsinline', 'playsinline');
    elem.onplay = () => {
      elem.isPlaying = true;
    };

    elem.oncanplay = () => {
      if (elem && elem.isPlaying) {
        elem.classList?.add('Ldd');
        cleanVid(elem);
        resolve(elem);
      }
    };
    elem.src = url;

    elem.onerror = () => {
      resolve(elem);
    };

    elem.play();
  });
}
