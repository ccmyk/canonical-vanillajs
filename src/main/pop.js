import { IS_DEV } from '@/utils/env.js';

export function addPop() {}

export function onPopState(e) {
  if (this.isload == 1) {
    e.preventDefault();
    return false;
  }
  this.onChange({
    url: window.location.pathname,
    link: null,
  });
}

export async function onChange({ url = null, link = null }) {
  url = url.replace(window.location.origin, '');
  console.log('[pop.js onChange] Navigating to URL:', url);
  if (this.isload == 1 || this.url == url) return;
  this.lenis.stop();
  this.issame = 0;
  this.page.isVisible = false;
  this.isload = 1;

  if (this.mouse) {
    this.mouse.clean();
  }

  let time = 1200;

  this.url = url;

  let functowait = [];

  document.body.style.pointerEvents = 'none';

  const request = await window.fetch(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  console.log('[pop.js onChange] Fetch response URL:', request.url);
  console.log('[pop.js onChange] Fetch response status:', request.status);

  const response = await request.text();
  console.log('[pop.js onChange] Response HTML (first 500 chars):', response.substring(0, 500));
  var push = true;

  if (this.gl) {
    this.gl.cleanTemp();
  }

  let checkout = await this.page.animOut(link, this.lenis);

  if (Array.isArray(checkout)) {
    time = 0;
    document.querySelector('body').insertAdjacentHTML('afterbegin', '<div class="faketit c-vw nfo"></div>');
    let faketit = document.querySelector('.faketit');
    faketit.appendChild(checkout[0].cloneNode(true));
    faketit.appendChild(checkout[1].cloneNode(true));
    checkout[0].remove();
    checkout[1].remove();
  }

  await this.timeout(time);

  Promise.all([
    this.onRequest({
      push,
      response,
      url,
    }),
  ]).then(() => {
    this.newView();
  });
}

export async function onRequest({ push, response, url }) {
  const html = document.createElement('div');

  html.innerHTML = response;
  if (html.querySelector('title')) {
    document.title = html.querySelector('title').textContent;
  }
  this.content = html.querySelector('#content');

  if (!this.content || !this.content.dataset?.template || !this.pages.has(this.content.dataset.template)) {
    console.warn('[pop.js onRequest] Missing or unknown template; loading error fallback', this.content);
    try {
      const errorResponse = await fetch('/error/index.html', {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      if (errorResponse.ok) {
        const errorHtml = document.createElement('div');
        errorHtml.innerHTML = await errorResponse.text();
        const fallbackContent = errorHtml.querySelector('#content');
        if (fallbackContent) {
          this.content = fallbackContent;
        }
      } else {
        console.warn('[pop.js onRequest] Error fallback fetch failed:', errorResponse.status);
      }
    } catch (fallbackError) {
      console.error('[pop.js onRequest] Error loading fallback content:', fallbackError);
    }
  }

  console.log('[pop.js onRequest] #content element:', this.content);
  console.log('[pop.js onRequest] #content dataset:', this.content?.dataset);

  if (push) {
    window.history.pushState({}, document.title, url);
  }

  await this.page.hide();
  this.lenis.scrollTo(0, { immediate: true, lock: true, force: true });
  this.page.DOM.el.remove();

  const contentTarget = document.querySelector('#content');
  if (contentTarget) {
    contentTarget.dataset.template = this.content.dataset.template || '';
    contentTarget.dataset.id = this.content.dataset.id || '';
  }

  this.template = this.content.dataset.template;
  console.log('[pop.js onRequest] Extracted template:', this.template, 'from content:', this.content);
  console.log('[pop.js onRequest] Extracted id:', this.content.dataset.id);
  console.log('[pop.js onRequest] Available pages:', Array.from(this.pages.keys()));
  this.newpage = this.pages.get(this.template);
  if (!this.newpage) {
    console.warn('[pop.js onRequest] Template not registered, falling back to error view:', this.template);
    this.template = 'error';
    this.content.dataset.template = 'error';
    this.content.dataset.id = this.content.dataset.id || '1';
    this.newpage = this.pages.get(this.template);
  }
  console.log('[pop.js onRequest] Selected page:', this.newpage);
  this.newpage.id = this.content.dataset.id;

  this.newpage.ispop = 1;
  // Pass the HTML content from the fetched page as the third parameter
  await this.newpage.create(this.content, this.main, this.content.innerHTML);
  if (this.gl) {
    await this.gl.createTemp(this.template);
  }
}

export async function newView() {
  if (this.mouse) {
    this.mouse.reset();
  }

  document.body.style.pointerEvents = '';
  this.isload = 0;

  this.newpage.show(0);

  if (this.canvas) {
    this.canvas.show();
  }

  this.page = this.newpage;
  let state = this.page.start(0);
  if (this.gl) {
    this.gl.show();
  }

  this.newpage.ispop = 0;

  this.addControllers();
  this.lenis.start();
}

export function resetLinks() {
  const links = document.querySelectorAll('a');

  const actual = window.location.href;
  for (let link of links) {
    if (link.classList.contains('Awrite')) {
    }
    const origin = this.main?.origin || window.location.origin;
    let isLocal = link.href.startsWith(origin);
    const isAnchor = link.href.indexOf('#') > -1;

    if (link.dataset.type && !isAnchor) {
      // because our static HTML files are at their original paths (e.g., /index/ not /projects/)
      if (IS_DEV) {
        isLocal = true;
        // Don't rewrite href - keep the original path
      }
      link.removeAttribute('data-type');
    }

    if (isLocal || isAnchor) {
      link.onclick = async (event) => {
        event.preventDefault();

        if (!isAnchor) {
          this.onChange({
            url: link.href,
            id: link.dataset.id,
            link: link,
          });
        } else {
          if (this.nav.isOpen == 1) {
            this.nav.isOpen = 0;
            this.nav.closeMenu();
            await this.timeout(450);
          }
          if (link.href.split('#').length == 2) {
            this.lenis.scrollTo('#' + link.href.split('#')[1], { offset: -100 });
          }
        }
      };
    } else if (link.href.indexOf('mailto') == -1 && link.href.indexOf('tel') == -1) {
      link.rel = 'noopener';
      link.target = '_blank';
    }
    //CLEAN CLASS
    if (actual == link.href) {
      link.classList.add('actLink');
    } else {
      link.classList.remove('actLink');
    }
  }
}
