export default class {
  constructor(obj, touch, canplay, animev) {
    this.el = obj.el;

    this.pos = obj.pos;
    this.touch = touch;
    this.canplay = canplay;
    this.animev = animev;

    this.DOM = {
      el: obj.el,
      video: obj.el.parentNode.querySelector('video'),
    };
    this.auto = false;
    if (this.DOM.video.dataset.auto) {
      this.auto = true;

      this.DOM.video.loop = true;
      this.DOM.video.muted = true;
      this.DOM.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
      this.DOM.video.setAttribute('playsinline', 'playsinline');

      if (this.touch) {
        this.DOM.video.load();
      }
    }

    this.active = 0;

    this.isloaded = 0;

    this.create();
  }

  create() {
    this.toggleAudio = async (out = null) => {
      if (!this.DOM.b || this.togglein == 1) {
        return false;
      }
      this.togglein = 1;

      if (out == 1 || this.DOM.video.muted == false) {
        this.DOM.video.muted = true;

        this.animev.detail.state = -1;
        this.animev.detail.el = this.DOM.bOn;
        document.dispatchEvent(this.animev);

        await window.waiter(64);

        this.animev.detail.state = 1;
        this.animev.detail.el = this.DOM.bOff;
        document.dispatchEvent(this.animev);
      } else {
        this.DOM.video.muted = false;

        this.animev.detail.state = -1;
        this.animev.detail.el = this.DOM.bOff;
        document.dispatchEvent(this.animev);

        await window.waiter(64);

        this.animev.detail.state = 1;
        this.animev.detail.el = this.DOM.bOn;
        document.dispatchEvent(this.animev);
      }

      await window.waiter(320);

      this.togglein = 0;
    };

    if (this.DOM.el.parentNode.querySelector('button.cAudio')) {
      this.DOM.b = this.DOM.el.parentNode.querySelector('button.cAudio');

      this.DOM.bOn = this.DOM.b.querySelector('.on');
      this.DOM.bOff = this.DOM.b.querySelector('.off');

      this.animev.detail.state = 0;
      this.animev.detail.el = this.DOM.bOn;
      document.dispatchEvent(this.animev);

      this.animev.detail.state = 0;
      this.animev.detail.el = this.DOM.bOff;
      document.dispatchEvent(this.animev);

      this.animev.detail.state = 1;
      this.animev.detail.el = this.DOM.bOff;
      document.dispatchEvent(this.animev);

      this.DOM.b.onclick = () => this.toggleAudio();
    }
  }
  check(entry, pos) {
    let vis = false;
    let isPlaying = false;

    if (entry.isIntersecting == undefined) {
      // this.DOM.video.pause()
      return false;
    } else if (entry.isIntersecting == true) {
      this.start();
      if (this.isloaded == 1) {
        if (this.touch == 0) {
          this.DOM.video.play().catch((e) => {
            if (e?.name !== 'AbortError') {
              console.warn('Video play failed:', e);
            }
          });
        } else {
          this.DOM.video.setAttribute('autoplay', 'true');
        }
      } else {
        // Validate video source before setting
        const videoSrc = this.DOM.video.dataset.lazy;
        if (videoSrc && typeof videoSrc == 'string' && videoSrc.trim() != '') {
          this.DOM.video.src = videoSrc;
          if (this.touch == 0) {
            this.DOM.video.play().catch((e) => {
              if (e?.name !== 'AbortError') {
                console.warn('Video play failed for:', videoSrc, e);
              }
            });
          } else {
            this.DOM.video.setAttribute('autoplay', 'true');
          }
        } else {
          console.warn('Invalid video source:', videoSrc);
          return false;
        }
      }
    } else {
      this.stop();
      isPlaying =
        this.DOM.video.currentTime > 0 &&
        !this.DOM.video.paused &&
        !this.DOM.video.ended &&
        this.DOM.video.readyState > this.DOM.video.HAVE_CURRENT_DATA;
      if (isPlaying) {
        if (this.touch == 1) {
          this.DOM.video.setAttribute('autoplay', 'false');
          this.toggleAudio(1);
        } else {
          this.DOM.video.pause();
          this.toggleAudio(1);
        }
      }
    }

    return false;
  }

  start() {
    this.active = 1;
    this.DOM.video.classList.add('ivi');
  }

  stop() {
    this.active = 0;
    this.DOM.video.classList.remove('ivi');
  }

  initEvents() {
    this.DOM.video.oncanplay = () => {
      this.isloaded = 1;
      this.DOM.video.classList.add('Ldd');
    };
    this.DOM.video.onplay = () => {
      this.DOM.video.isPlaying = true;
    };
  }
  removeEvents() {
    this.DOM.video.pause();
    this.DOM.video.muted = true;
  }
  update() {}

  onResize(scrollCurrent) {
    this.h = window.innerHeight;
    this.max = this.el.clientHeight;

    this.checkobj = {
      firstin: Math.min(this.h, this.el.clientHeight) * 0.92,
      firstout: this.h * 0.92,
      secout: this.el.clientHeight * -1,
      limit: this.el.clientHeight,
    };
  }
}
