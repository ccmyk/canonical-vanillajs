export function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loadAppData(url,id='',temp=''){

  if(import.meta.env.DEV == true){
    console.log('Loading page data for ID:', id, 'from URL:', url)
  }

  // Fetch the page-specific JSON content
  // NOTE: The 'url' parameter is provided for compatibility with original WordPress code
  // but we ignore it and use our static JSON files instead
  try {
    const response = await fetch(`/content/pages/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load page ${id}: ${response.status}`);
    }
    const pageData = await response.json();

    // Return the page data matching the structure the original WordPress version returned
    // The original returned: { csskfields: { main: "...", textures: {...} }, ... }
    return {
      ...pageData,
      device: this.main?.device || 0,
      webp: this.main?.webp || 0,
      webgl: this.main?.webgl || 1,
      template: temp || pageData.template || ''
    };
  } catch (error) {
    console.error('Error loading page data:', error);
    // Return minimal data to prevent complete failure
    return {
      device: this.main?.device || 0,
      webp: this.main?.webp || 0,
      webgl: this.main?.webgl || 1,
      template: temp || '',
      csskfields: {
        main: '',
        textures: {}
      }
    };
  }
}

export async function loadImages(){
  this.DOM.images = document.querySelectorAll('img')
  const imageswait = document.querySelectorAll('img.Wait')
  const imagesnowait = document.querySelectorAll('img:not(.Wait)')
  let promiseswait = []
  for(let path of imageswait){
    
    promiseswait.push(this.loadImage(path))
    

  }

  await Promise.all(promiseswait)
  this.scaleLoads(imagesnowait)
}


export async function scaleLoads(elswait){

  for(let path of elswait){

    if(path.tagName=='IMG'){
      if(!path.dataset.lazy){
        await this.loadImage(path)

      }
    }
    else if(path.tagName=='VIDEO'){
      if(!path.dataset.lazy){
        await this.loadVideo(path)
        path.classList.add('Ldd')
      }
    }
  }
  
}


export async function newImages(){
  const newimages = document.querySelectorAll('img')
  let images1 = Array.prototype.slice.call(newimages)
  let images2 = Array.prototype.slice.call(this.DOM.images)
  let imagesfiltered = images1.filter(val => !images2.includes(val))
  let promises = []
  for(let path of imagesfiltered){
    if(path.classList.contains('Wait')){
      promises.push(this.loadImage(path))

    }
    else{
      this.loadImage(path,1)
    }

  }

  await Promise.all(promises)
  this.DOM.images = this.DOM.el.querySelectorAll('img')
}


export async function loadImage(elem,nowait = null) {
  
    return new Promise((resolve, reject) => {
      
      if(elem.getAttribute('src')){
        resolve(elem)
        return false
      }
      let img = new Image()
      let url = ''
      if(elem.dataset.src){
        
        url = elem.dataset.src
      }
     


      
      let gif=0
      if(/\.(gif)$/.test(url)){
        gif=1
      }

      elem.onload = () => {
        elem.classList.add('Ldd')
        delete elem.dataset.src
        resolve(elem)
      }

      elem.onerror = () => {
        resolve(elem)
      }

      img.onload = () =>{
        elem.src = url
      }

      img.onerror = () =>{
        elem.src = url
        resolve(elem)
      }

      img.src = url
      if(gif==1){
        elem.src = url
        elem.classList.add('Ldd')
      }
      
      
    })


}

export async function loadVideos(){
  this.DOM.videos = this.DOM.el.querySelectorAll('video')
  const videoswait = this.DOM.el.querySelectorAll('video.Wait')
  const videosnowait = this.DOM.el.querySelectorAll('video:not(.Wait)')
  
  let promiseswait = []
  for(let path of videoswait){
   
    promiseswait.push(this.loadVideo(path))

  }
  await Promise.all(promiseswait)
  this.scaleLoads(videosnowait)
}


export async function newVideos(){
  const newvideos = this.DOM.el.querySelectorAll('video')
  let videos1 = Array.prototype.slice.call(newvideos)
  let videos2 = Array.prototype.slice.call(this.DOM.videos)
  let videosfiltered = videos1.filter(val => !videos2.includes(val))
  let promises = []

  for(let path of videosfiltered){
    if(path.classList.contains('Wait')){
      promises.push(this.loadVideo(path))

    }
    else{
      this.loadVideo(path,1)
    }

  }
  await Promise.all(promises)
  this.DOM.videos = this.DOM.el.querySelectorAll('video')
}


function cleanVid(elem){
  elem.oncanplay = null
  elem.onplay = null
  elem.currentTime=0

  let isPlaying = elem.currentTime > 0 && !elem.paused && !elem.ended 
  && elem.readyState > elem.HAVE_CURRENT_DATA


  if(!isPlaying && !elem.dataset.auto){
    elem.pause()
  }
}
export async function loadVideo(elem, nowait = false) {

  return new Promise((resolve, reject) => {
    if(elem.dataset.loop){
      elem.loop = false
    }
    else{
      elem.loop = true
    }
    elem.muted = true
    elem.autoplay = true
    elem.setAttribute('webkit-playsinline', 'webkit-playsinline')
    elem.setAttribute('playsinline', 'playsinline')
    elem.onplay = () => {

      elem.isPlaying = true
      
    }
    
    elem.oncanplay = () => {
      if (elem.isPlaying) {
        elem.classList.add('Ldd')
        cleanVid(elem)
        resolve(elem)
      }
    }
    if(elem.dataset.opac){
      if(this.main.webm==true){
        elem.src = elem.dataset.src+'.webm'
      }
      else{
        elem.src = elem.dataset.src+'.mp4'

      }
    }
    else{
      elem.src = elem.dataset.src

    }
    elem.onerror = () =>{
      resolve(elem)
    }
    
    elem.play()
    
  })

}
