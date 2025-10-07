import browser from './browser.js'
import { loadBootstrapData } from './firstload.js'

import App from '../main/index.js'
import { IS_DEV } from '../utils/env.js'

// Import from CDN for vanilla.js compatibility
// These will be loaded from CDN in index.html instead

console.log('Constructor.js loaded');

// import { Power2,Power4 } from "./ease.js"

if (window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual'
}

document.documentElement.style.setProperty("--ck_hvar", window.innerHeight+'px')
document.documentElement.classList.add('lenis-stopped')

if(IS_DEV){

  document.documentElement.classList.add('dev')
  
  
}

const global = browser.browserCheck()
// Re-enable WebGL for proper site operation

// Original WebGL detection code (restored)
if(browser.glCheck()==false){
  global.webgl = 0
  document.documentElement.classList.add('AND')
}
else{
  if(navigator.userAgent.toLowerCase().indexOf("android") > -1){
    global.webgl = 0
    document.documentElement.classList.add('AND')
  }
  else{
    global.webgl = 1
  }
}

window.gsap = window.gsap || gsap
gsap.ticker.remove(gsap.updateRoot)

window.SplitType = window.SplitType || SplitType

const datasetValue = (document.body.dataset.js ?? '').trim()
const isAbsoluteBase = /^https?:\/\//.test(datasetValue)
let normalizedPath = ''
let resolvedBase = window.location.origin

if (isAbsoluteBase) {
  resolvedBase = datasetValue.replace(/\/+$/,'')
} else if (datasetValue) {
  const stripped = datasetValue.replace(/^\/+|\/+$/g,'')
  normalizedPath = `/${stripped}`
  resolvedBase = `${window.location.origin}${normalizedPath}`
}

global.pathPrefix = normalizedPath
global.base = resolvedBase
global.assetRoot = global.pathPrefix || ''

global.design = {
  L:{
    w : 1440,
    h : 800,
    multi:.4,
    total:0,
    ratio:5.56,
    wide:((window.innerHeight*10)/window.innerWidth).toFixed(2),
    
  },
  P:{
    w:390,
    h:640,
    multi:.4,
    total:0
  }
}

global.design.L.total = ( ( global.design.L.w / window.innerWidth ) * 10 )
global.design.L.total = 10 - ((10 - global.design.L.total) * global.design.L.multi)
global.design.L.total = Math.min(10,global.design.L.total)

global.design.P.total = ( ( global.design.P.w / window.innerWidth ) * 10 )
global.design.P.total = 10 - ((10 - global.design.P.total) * global.design.P.multi)
global.design.P.total = Math.min(10,global.design.P.total)

//MULTI PARA EL WIDE

document.documentElement.style.setProperty("--ck_multiL", global.design.L.total)
document.documentElement.style.setProperty("--ck_multiP", global.design.P.total)

document.documentElement.style.setProperty("--ck_accent", '#fff')
document.documentElement.style.setProperty("--ck_other", '#050505')

//SIZES : Explicados en guides🔪🔪🔪
if(global.isTouch == 1){

  document.documentElement.style.setProperty("--ck_hscr", window.screen.height+'px')
  document.documentElement.style.setProperty("--ck_hvar", window.innerHeight+'px')
  document.documentElement.style.setProperty("--ck_hmin", document.documentElement.clientHeight+'px')
  
}
else{

  document.documentElement.style.setProperty("--ck_hscr", window.innerHeight+'px')
  document.documentElement.style.setProperty("--ck_hvar", window.innerHeight+'px')
  document.documentElement.style.setProperty("--ck_hmin", window.innerHeight+'px')

}

const bootstrap = async () => {
  console.log('Bootstrap starting...');
  try {
    console.log('Loading bootstrap data...');
    const data = await loadBootstrapData()
    console.log('Bootstrap data loaded:', data);
    console.log('Creating App...');
    new App([global, data])
    console.log('App created successfully');
  } catch (error) {
    console.error('Failed to initialise app', error)
  }
}

bootstrap()


  window.lerp = function(p1, p2, t) {
    return p1 + (p2 - p1) * t

  }

  window.clamp = function(min, max, num) {return Math.min(Math.max(num, min), max)}

  window.waiter = function (ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }
