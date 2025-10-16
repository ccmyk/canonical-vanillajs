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
    img.crossOrigin = 'anonymous';

    // For MSDF font textures, we need special handling
    const isMSDFTexture = url.includes('PPNeueMontreal-Medium');

    img.onload = () => {
      if (isMSDFTexture) {
        console.log('MSDF texture loaded successfully:', url);
      }
      resolve(img);
    };

    img.onerror = (e) => {
      console.warn(`Failed to load image: ${url}`, e);
      // For MSDF textures, this is critical - create a placeholder
      if (isMSDFTexture) {
        console.error('MSDF texture failed to load, creating fallback');
        // Create a small placeholder texture for MSDF to prevent shader errors
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 512, 512);
        img.src = canvas.toDataURL();
      } else {
        resolve(img);
      }
    };

    // Set the source after establishing event handlers
    img.src = url;
  });
}

function cleanVid(elem) {
  elem.oncanplay = null;
  elem.onplay = null;
  elem.currentTime = 0;

  let isPlaying = elem.currentTime > 0 && !elem.paused && !elem.ended && elem.readyState > elem.HAVE_CURRENT_DATA;

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
