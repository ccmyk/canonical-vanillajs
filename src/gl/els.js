import {  Camera, Plane, Triangle,  Mesh, Geometry, Texture, Text, Renderer, Transform, Program,Post, Vec2 } from 'ogl'
//ASSETS

const PUBLIC_ROOT_URL = new URL('../../public/', import.meta.url)

const resolvePublicPath = (relativePath) => new URL(relativePath, PUBLIC_ROOT_URL).pathname

//LOADER

import Loader from './Loader/base.js'
import LoaderF from './Loader/Loader.fragment.main.glsl'
import LoaderV from './Loader/Loader.vertex.main.glsl'

//OIS

import Base from './Media/base.js'
import fractalF from './Media/Media.fragment.main.glsl'
import fractalV from './Media/Media.vertex.main.glsl'

import Bg from './Bg/base.js'
import BgF from './Bg/Bg.fragment.main.glsl'
import BgV from './Bg/Bg.vertex.main.glsl'

import Tt from './Tt/base.js'
import textF from './Tt/Tt.fragment.msdf.glsl'
import textV from './Tt/Tt.vertex.msdf.glsl'

import TtF from './TtF/base.js'
import textFF from './TtF/TtF.fragment.msdf.glsl'
import textpF from './TtF/TtF.fragment.parent.glsl'

import TtA from './TtA/base.js'
import textFA from './TtA/TtA.fragment.msdf.glsl'
import textpA from './TtA/TtA.fragment.parent.glsl'

import Sl from './Slider/base.js'
import SlF from './Slider/Slider.fragment.main.glsl'
import SlV from './Slider/Slider.vertex.main.glsl'
import SlPF from './Slider/Slider.fragment.parent.glsl'

import Roll from './Roll/base.js'
import SlSF from './Roll/Roll.fragment.single.glsl'
import SlVF from './Roll/Roll.vertex.single.glsl'

import PG from './Pg/base.js'
import PGs from './Pg/Pg.fragment.main.glsl'
import PGv from './Pg/Pg.vertex.main.glsl'

export async function createMSDF () {

  const assetRoot = this.main.assetRoot || ''
  const mapTexSrc = assetRoot ? `${assetRoot}/public/PPNeueMontreal-Medium.png` : resolvePublicPath('PPNeueMontreal-Medium.png')
  const jsonTexSrc = assetRoot ? `${assetRoot}/public/PPNeueMontreal-Medium.json` : resolvePublicPath('PPNeueMontreal-Medium.json')

  let rt = []

  //🔠🔠🔠🔠
  let fJson = await (await fetch(jsonTexSrc)).json()
  
  rt.push(fJson)

  
  //🔚🔚🔚🔚🔚

  return rt

}

export async function createAssets (texs) {
  

  //TtTtTtTtTtTt
  const fntAss = await this.createMSDF()
  

  this.fontMSDF = fntAss[0]

  const assetRoot = this.main.assetRoot || ''
  const mapTexSrc = assetRoot ? `${assetRoot}/public/PPNeueMontreal-Medium.png` : resolvePublicPath('PPNeueMontreal-Medium.png')
  this.fontTex = await this.loadImage(mapTexSrc)
  

  

  const video = document.createElement('video')
  video.isPlaying = false
  video.style.display = 'none'
  video.autoplay = true
  video.setAttribute('webkit-playsinline', 'webkit-playsinline')
  video.setAttribute('playsinline', 'playsinline')
  video.muted = true
  video.loop = true
  video.dataset.auto = true

  let promiseswait = []
  let lnt = Object.values(texs).length - 1

  for(let a in texs){

    if(Array.isArray(texs[a])){

      for(let [b,u] of texs[a].entries()){
        if(texs[a][b].i){
          promiseswait.push(this.loadImage(texs[a][b].i))

          
  
        }
        else if(texs[a][b].v){
          let vidclone = video.cloneNode()
          promiseswait.push(this.loadVideo(vidclone,texs[a][b].v))

        }
      }
    }
    else{
      if(texs[a].i){
        promiseswait.push(this.loadImage(texs[a].i))

      }
      else if(texs[a].v){
        let vidclone = video.cloneNode()
        promiseswait.push(this.loadVideo(vidclone,texs[a].v))
          
      }
    }

  }

  this.texs = []
  for(let [i,a] of promiseswait.entries()){

    this.texs.push(await Promise.resolve(a))
    
  }
 
   

    

}

export async function createTex(el=null,video=null){

  

}

export async function createEls(el=null){

  const temp = el.dataset.temp || 'base'
  const pos = el.dataset.oi

  //TtTtTtTtTtTt
  if(temp == 'tt' || temp == 'foot' || temp == 'about'){

    //🅰️🅰️🅰️🅰️
    //❗ HABRÁ QUE HACER UN IF PARA LOS TAMAÑOS
    //❗ HABRÁ QUE HACER UNA CALCULADORA DE TAMAÑOS

      
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),
      
      width: el.offsetWidth,
      height: el.offsetHeight,
    })

    const { gl } = renderer

    gl.canvas.classList.add('glF')
    el.parentNode.querySelector('.cCover').appendChild(gl.canvas)
    //📽️📽️📽️📽️📽️📽️📽️📽️
    const cam = this.createCamera(gl)

    let text = ''
    let siz = el.dataset.m

    if(temp == 'foot'){
      text = new Text({
        font:this.fontMSDF,
        text: el.dataset.text,
        align: 'center',
        letterSpacing: el.dataset.l,
        size: siz,
        lineHeight: 1,
      })
    }
    else if(temp == 'about'){
      let br= ' '
      let br2= ' '
      let w = (6.2 * el.dataset.m) / .6
      let ls = el.dataset.l
      let l = .995
      if(this.main.device < 2){
        br ='\n'
        br2 ='\n'
        w = 13.1
        l = 1.035
      }
      if(this.main.device == 2){

        w = 7.5
        l = 1.01
        ls = -.015
        siz *= .77
      }
      text = new Text({
        font:this.fontMSDF,
        text:'Enthusiastic about graphic design, typography, and the dynamic areas of motion and web-based animations.'+br+'Specialized in translating brands into unique and immersive digital'+br2+'user experiences.',

        width: w,
        align: 'center',
        letterSpacing: ls,
        size: siz,
        lineHeight: l,
      })

    }
    else{
      text = new Text({
        font:this.fontMSDF,
        text: el.dataset.text,
        align: 'center',
        letterSpacing: el.dataset.l,
        size: siz,
        lineHeight: 1,
      })
    } 

    //📐📐📐📐📐📐📐

    const geometry = new Geometry( gl, {
      position: { size: 3, data: text.buffers.position },
      uv: { size: 2, data: text.buffers.uv },
      id: { size: 1, data: text.buffers.id },
      index: { data: text.buffers.index },
    })
    geometry.computeBoundingBox()

    //📺📺📺📺📺📺📺
      const texTx = new Texture( gl, {
        generateMipmaps: false,
      })

    
    texTx.image = this.fontTex

    
    

    let program = ''

    if(temp == 'foot'){

      let shaderMod = textFF
      shaderMod = shaderMod.replaceAll('PITO',el.parentNode.querySelector('.Oiel').innerHTML.length)

      program = new Program(gl,{
        vertex:textV,
        fragment:shaderMod,
        uniforms:{
          uTime: { value: 0 },
          uColor: { value: 0. },
          tMap: { value: texTx },
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
      })

    }
    else if(temp == 'about'){

      let shaderMod = textFA
      shaderMod = shaderMod.replaceAll('PITO',el.parentNode.querySelector('.Oiel').innerHTML.length)

      program = new Program(gl,{
        vertex:textV,
        fragment:shaderMod,
        uniforms:{
          uTime: { value: 0 },
          uStart: { value: 1. },
          uColor: { value: 0. },
          tMap: { value: texTx },
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
      })

    }
    else{

      let shaderMod = textF
      shaderMod = shaderMod.replaceAll('PITO',el.parentNode.querySelector('.Oiel').innerHTML.length)
  
      program = new Program(gl,{
        vertex:textV,
        fragment:shaderMod,
        uniforms:{
          uTime: { value: 0 },
          uKey: { value: -2 },
          uPower: { value: 1 },
          uPowers: { value: [] },
          uWidth: { value: [] },
          uHeight: { value: [] },
          uCols: { value: 1.5 },
          uStart: { value: 1. },
          uColor: { value: 0. },
          tMap: { value: texTx },
          uMouse: { value: new Vec2(0,0) },
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
      })

    }
    
    const mesh = new Mesh( gl, { geometry, program })
    
    const scene = new Transform()
    mesh.setParent(scene)

    //❗ Posible borrada o reajuste para meterlo en medio
    let post = ''
    if(temp == 'foot'){
      
      mesh.position.y = text.height * 0.58

      post = new Post(gl)
      post.addPass({
        fragment:textpF,
        uniforms: {
          uTime: { value: 0},
          uStart: { value: 0 },
          uMouseT: { value: 0 },
          uMouse: { value: 0 },
          uOut: { value: 1. },
        },
      })
    }
    else if(temp == 'about'){
      
      mesh.position.y = text.height * 0.58

      post = new Post(gl)
      post.addPass({
        fragment:textpA,
        uniforms: {
          uTime: { value: .4},
          uStart: { value: -1. },
          uMouseT: { value: .4 },
          uMouse: { value: -1 },
        },
      })
    }
    else{

      mesh.position.y = text.height * 0.58
    }
    if(el.dataset.white){
    
      program.uniforms.uColor.value = 1
    
    }
    

    const obj = {
      el,
      pos,
      renderer,
      mesh,
      text,
      post,
      scene,
      cam,
      touch:this.main.isTouch,
      canvas:gl.canvas
    }

    if(temp == 'foot'){
      return new TtF(obj)

    }
    else if(temp == 'about'){
      return new TtA(obj)

    }
    else{
      return new Tt(obj)

    }
    
  }
  else if(temp == 'bg' || temp == 'loader'){
    //LoaderLoaderLoaderLoaderLoaderLoaderLoaderLoaderLoaderLoaderLoader
    
    const renderer = new Renderer({
      alpha:true,
      dpr: Math.min(window.devicePixelRatio, 2),
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const { gl } = renderer
    const geometry = new Triangle(gl)

    if(temp == 'loader'){
      gl.canvas.id = 'glLoader'
    
      document.body.appendChild(gl.canvas)

      const program = new Program(gl, {
        vertex:LoaderV,
        fragment:LoaderF,
        uniforms: {
          uTime: { value: 0 },
          //BORRAR
          uStart1: { value: .5 },
          //BORRAR
          uStart0: { value: 1 },
          uStart2: { value: 1 },
          uStartX: { value: 0 },
          uStartY: { value: 0.1 },
          uMultiX: { value: -.4 },
          uMultiY: { value: .45 },
          uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        },
      })

      const mesh = new Mesh(gl, { geometry, program: program })

      const obj = {
        el,
        pos,
        renderer,
        mesh,
        canvas:gl.canvas
      }

      return new Loader(obj)

    }
    else{

      gl.canvas.id = 'glBg'
      document.body.insertBefore(gl.canvas,document.querySelector('.Mbg'))

      const program = new Program(gl, {
        vertex:BgV,
        fragment:BgF,
        uniforms: {
          uTime: { value: 0 },
          //BORRAR
          uStart1: { value: .5 },
          //BORRAR
          uStart0: { value: 1 },
          uStart2: { value: 1 },
          uStartX: { value: 0 },
          uStartY: { value: 0.1 },
          uMultiX: { value: -.4 },
          uMultiY: { value: .45 },
          uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        },
      })

      const mesh = new Mesh(gl, { geometry, program: program })

      const obj = {
        el,
        pos,
        renderer,
        mesh,
        canvas:gl.canvas
      }

      return new Bg(obj)
    }
  }
  else if(temp=='roll') {
    
    const parent = document.querySelector('.cRoll')
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),
      
      width: parent.offsetWidth,
      height: parent.offsetHeight,
    })
    const { gl } = renderer
    //Slider
    const scene = new Transform()

    gl.canvas.classList.add('glRoll')
    parent.appendChild(gl.canvas)

    //📐📐📐📐📐📐📐

    const geometry = new Triangle(gl)

    const textures = []
    let medias = parent.parentNode.querySelectorAll('video,img')

    for(let [i,a] of medias.entries()){
      let texture = new Texture( gl, {
        generateMipmaps: false,
      })
      
      let url = a.dataset.src || a.dataset.oi
      let exists = this.texs.find((element)=> element.src == url)
    

      if(url.includes('.mp4')){
        if(exists){
          texture.image = exists
        }
        else{
          console.log('no fun')
          texture.image = await this.loadVideo(a,url)
        }
        
      }
      else{
        if(exists){
          texture.image = exists
        }
        else{
          console.log('no fun')
          texture.image = await this.loadImage(url)
        }
  
      }

      textures.push(texture)
      
      

    }

    const program = new Program(gl,{
      vertex:SlVF,
      fragment:SlSF,
      uniforms:{
        uStart: { value: 0 },
        uEnd: { value: 0 },
        uPos: { value: 0 },
        uChange: { value: 0 },
        tMap: { value: textures[0] },
        tMap2: { value: textures[0] },
        uCover: { value: new Vec2(0, 0) },
        uTextureSize: { value: new Vec2(0, 0) },
        uTextureSize2: { value: new Vec2(0, 0) },
      
      },
      
      
    })
    let mesh = new Mesh( gl, { geometry, program })

    const obj = {
      el,
      pos,
      renderer,
      mesh,
      medias,
      textures,
      canvas:gl.canvas
    }

    return new Roll(obj)

  }
  else if(temp=='slider') {

    //SliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSliderSlider

    //Inits
    
      
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),
      
      width: el.offsetWidth,
      height: el.offsetWidth,
    })

    const { gl } = renderer
    //Slider
    const scene = new Transform()

    gl.canvas.classList.add('glSlider')
    el.parentNode.querySelector('.cCover').appendChild(gl.canvas)
    

    //📽️📽️📽️📽️📽️📽️📽️📽️
    const cam = this.createCamera(gl)

    //📐📐📐📐📐📐📐

    const geometry = new Plane(gl,{
      heightSegments: 1,
      widthSegments:1
    })

    //👓👓👓👓👓👓👓
    

    const textures = []
    const meshes = []
    
    let medias = el.parentNode.querySelectorAll('video,img')

    for(let [i,a] of medias.entries()){
      let texture = new Texture( gl, {
        generateMipmaps: false,
      })

      let url = a.dataset.src || a.dataset.oi
      let exists = this.texs.find((element)=> element.src == url)
    

      if(url.includes('.mp4')){
        if(exists){
          texture.image = exists
        }
        else{
          console.log('no fun'+url)
          texture.image = await this.loadVideo(a,url)
        }
        
      }
      else{
        if(exists){
          texture.image = exists
        }
        else{
          console.log('no fun'+url)
          texture.image = await this.loadImage(url)
        }
  
      }
  

      textures.push(texture)
      const program = new Program(gl,{
        vertex:SlV,
        fragment:SlF,
        uniforms:{
          uStart: { value: 0 },
          uTime: { value: 0 },
          tMap: { value: texture },
          uCover: { value: new Vec2(0, 0) },
          uTextureSize: { value: new Vec2(0, 0) },
         
        },
        
      })
      let mesh = new Mesh( gl, { geometry, program })

      mesh.setParent(scene)
      meshes.push(mesh)
      

    }
    let post = null
    if(1==1){

      post = new Post(gl)
      post.addPass({

        fragment:SlPF,
        uniforms: {
          uTime: { value: 0},
          uStart: { value: 0 },
          uHover: { value: 0 },
        },
      })

    }
    //Single
    
    
       
      

    const obj = {
      el,
      pos,
      renderer,
      scene,
      meshes,
      medias,
      textures,
      post,
      cam,
      canvas:gl.canvas,
      dev:this.main.device
    }
    return new Sl(obj)
  }
  else if(temp=="pg"){
    //PgPgPgPgPgPg

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),
      
      width: window.innerWidth,
      height: el.innerHeight,
    })
    //📐📐📐📐📐📐📐

    const { gl } = renderer

    gl.canvas.classList.add('glPlay')
    document.body.appendChild(gl.canvas)
    //📽️📽️📽️📽️📽️📽️📽️📽️
    const cam = this.createCamera(gl)
    const scene = new Transform()

    const geometry = new Plane(gl,{
      heightSegments: 1,
      widthSegments:1
    })

    //📺📺📺📺📺📺📺
    const texture = new Texture( gl, {
      generateMipmaps: false,
    })

    
      
    
   

    const obj = {
      el,
      pos,
      cam,
      renderer,
      texture,
      scene,
      geometry,
      canvas:gl.canvas,
      touch:this.main.isTouch,
      device:this.main.device,
      rev:this.main.events.anim
    }

    return new PG(obj)

  }
  else if(temp=='pgel'){

    const obj = {
      el,
      pgid:el.dataset.pg,
      pos:document.querySelector('.Oi-pg').dataset.oi
    }
    return obj
  }
  else {
    //MediaMediaMediaMediaMediaMedia

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),
      
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    //📐📐📐📐📐📐📐

    const { gl } = renderer

    gl.canvas.classList.add('glMedia')
    el.parentNode.appendChild(gl.canvas)

    const geometry = new Triangle(gl,{
      heightSegments: 1,
      widthSegments:1
    })

    //📺📺📺📺📺📺📺
    const texture = new Texture( gl, {
      generateMipmaps: false,
    })

    let url = el.dataset.src

    let exists = this.texs.find((element)=> element.src == url)
    

    if(url.includes('.mp4')){
      if(exists){
        texture.image = exists
      }
      else{
        console.log('no fun')
        texture.image = await this.loadVideo(el.parentNode.querySelector('video'),url)
      }
      
    }
    else{
      if(exists){
        texture.image = exists
      }
      else{
        console.log('no fun')
        texture.image = await this.loadImage(url)
      }

    }

    
    const program = new Program(gl,{
      vertex:fractalV,
      fragment:fractalF,
      uniforms:{
        uTime: { value: 0 },
        uStart: { value: 0 },
        uStart1: { value: .5 },
        tMap: { value: texture },
        uCover: { value: new Vec2(0, 0) },
        uTextureSize: { value: new Vec2(texture.image.naturalWidth, texture.image.naturalHeight) },
        uMouse: { value: new Vec2(0,0) },
      },
      
    })
    const mesh = new Mesh(gl, { geometry ,  program })
    
   

    const obj = {
      el,
      pos,
      mesh,
      renderer,
      texture,
      canvas:gl.canvas,
      touch:this.main.isTouch
    }

    return new Base(obj)

  }

}
