function browserCheck() {
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
  }

  const isTouch =
    /Mobi|Andrdoid|Tablet|iPad|iPhone/.test(navigator.userAgent) ||
    ('MacIntel' == navigator.platform && 1 < navigator.maxTouchPoints);
  const w = window.innerWidth;
  const h = window.innerHeight;
  let devnum = 0;
  let devicec = '';

  if (!isTouch) {
    devicec = 'desktop';
    devnum = 0;
    document.documentElement.classList.add('D');

    if (w > 1780) {
      devnum = -1;
    }
  } else {
    devicec = 'mobile';
    devnum = 3;
    if (w > 767) {
      if (w > h) {
        devicec = 'tabletL';
        devnum = 1;
      } else {
        devicec = 'tabletS';
        devnum = 2;
      }
    }

    document.documentElement.classList.add('T');
    document.documentElement.classList.add(devicec);
  }

  console.log(devnum);

  //WebP
  const element = document.createElement('canvas');
  let isWebPCheck = false;
  let isWebgl = false;
  let file = '';
  if (element.getContext && element.getContext('2d')) {
    isWebPCheck = element.toDataURL('image/webp').indexOf('data:image/webp') == 0;
  }

  let isWebMCheck = true;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') != -1) {
    if (ua.indexOf('chrome') > -1) {
    } else {
      isWebMCheck = false;
    }
  }

  let autoplay = true;
  const video = document.createElement('video');
  video.isPlaying = false;
  video.src =
    'data:video/mp4;base64,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';
  video.load();
  video.style.display = 'none';
  video.autoplay = true;
  video.setAttribute('webkit-playsinline', 'webkit-playsinline');
  video.setAttribute('playsinline', 'playsinline');
  video.muted = true;

  video.onplay = () => {
    video.isPlaying = true;
  };
  video.oncanplay = () => {
    if (video.isPlaying) {
      autoplay = true;
    } else {
      autoplay = false;
    }
    video.pause();
    video.remove();
  };
  if (isTouch != true) {
    video
      .play()
      .then(() => {
        // autoplay supported
      })
      .catch((err) => {
        console.warn('[browserCheck] Autoplay detection video play interrupted:', err.name || err);
      });
  } else {
    video.setAttribute('autoplay', 'true');
  }

  if (ua.indexOf('firefox') > -1) {
    document.documentElement.classList.add('CBff');
  }

  return {
    deviceclass: devicec,
    device: devnum,
    isTouch: isTouch,
    webp: +isWebPCheck,
    webm: +isWebMCheck,
    vidauto: +autoplay,
  };
}

function revCheck() {
  const checkfix = document.createElement('div');
  checkfix.className = 'checkfix';
  checkfix.insertAdjacentHTML('afterbegin', '<div class="checkfix_t"></div>');

  document.querySelector('body').appendChild(checkfix);
  let ratio = ((window.innerWidth * 9) / window.innerHeight).toFixed(2);
  let zoom = window.innerWidth != window.outerWidth;
  document.querySelector('.checkfix_t').innerHTML =
    'Width: ' +
    window.innerWidth +
    '<br>Height: ' +
    window.innerHeight +
    '<br>Ratio: ' +
    ratio +
    '/9<br>' +
    (16 / ratio).toFixed(3) +
    '<br>Zoom: ' +
    zoom;

  window.addEventListener('resize', () => {
    let zoom = window.innerWidth != window.outerWidth;
    let ratio = ((window.innerWidth * 9) / window.innerHeight).toFixed(2);
    document.querySelector('.checkfix_t').innerHTML =
      'Width: ' +
      window.innerWidth +
      '<br>Height: ' +
      window.innerHeight +
      '<br>Ratio: ' +
      ratio +
      '/9<br>' +
      (16 / ratio).toFixed(3) +
      '<br>Zoom: ' +
      zoom;
  });
}

function glCheck() {
  try {
    var canvas = document.createElement('canvas');

    if (!!window.WebGL2RenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) {
      return 'webgl2';
    }
    if (!!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) {
      return 'webgl';
    }
  } catch (e) {
    return false;
  }
}

export default { browserCheck, revCheck, glCheck };
