import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateScale,
  updateAnim

} from './position.js'

import {  Vec2 } from 'ogl'

class Base {
  constructor (obj) {

    this.el = obj.el
    this.pos = obj.pos
    this.mesh = obj.mesh
    this.tex = obj.texture
    this.renderer = obj.renderer
    this.touch = obj.touch
    this.canvas = obj.canvas
    

    this.active = -1
    this.isready = 0

    
    this.media = obj.el.parentNode.querySelector('img,video')
    
    if(this.tex.image.tagName == 'VIDEO'){
      this.isv = 1
      this.mesh.program.uniforms.uTextureSize.value = [this.media.width,this.media.height]

    }

    

    this.coords = [0, 0]
    this.norm = [0, 0]
    this.end = [0, 0]
    this.ease = .06

    this.ctr = {
      actual:0,
      current:0,
      limit:0,
      start:0,
      prog:0,
      progt:0,
      lerp:.065,
      stop:0
    }

    let xanim = .8
    if(this.el.dataset.op){

      xanim = -.8
    }

    this.animctr = gsap.timeline({paused:true})
    .fromTo(this.mesh.program.uniforms.uStart,{value:xanim},{value:0,ease:'power2.inOut',
    onComplete:()=>{ 
      this.ctr.stop = 1
      this.el.classList.add('act')
    }
    },0)
  }

  async load(){
    
    
    
    this.initEvents()

  }

  update(time,speed,pos){
    if(!this.mesh){
      return false
    }
    if(this.isready == 0 || this.active < 0 ){
      return false
    }

    this.end[0] = this.lerp(this.end[0],this.norm[0],this.ease)
    this.end[1] = this.lerp(this.end[1],this.norm[1],this.ease)
    
    

    this.mesh.program.uniforms.uMouse.value = this.end

    if(this.ctr.actual != pos){
      this.ctr.actual = pos
      this.updateY(pos)

    }
    if(this.ctr.stop != 1){
      this.updateAnim()

    }
    if(this.isv){
      if (this.tex.image.readyState >= this.tex.image.HAVE_ENOUGH_DATA) {
        
        if (!this.tex.image) this.tex.image = this.tex.image 
        
        this.tex.needsUpdate = true
      }
    }

    this.renderer.render({ scene: this.mesh })

    return true
    
  }
  initEvents(){
    this.mvFn = (e) =>{

      this.ease = .03
      this.coords[0] = e.touches ? e.touches[0].clientX : e.clientX

      //MAP SCREEN
      
       this.norm[0] = (this.coords[0] - this.bound[0])/this.bound[2]
        
      
       this.norm[0]-=.5
    }

    this.lvFn = (e) =>{
      this.ease = .01
      this.norm[0] = 0

    }

    if(this.touch == 0){

      this.el.onmousemove = (e) => this.mvFn(e)
      this.el.onmouseleave = (e) => this.lvFn(e)
      
    }
    else{
      this.ctr.lerp = 0.1
      this.el.style.touchAction='none'
      this.el.ontouchmove = (e) => this.mvFn(e)
      this.el.ontouchend = (e) => this.lvFn(e)

    }
    

  }
  removeEvents(){
    this.active = -2

    this.ease = .022
    this.norm[0] = -.5
    this.el.style.pointerEvents='none'

    gsap.timeline({
      onUpdate:()=>{

        this.end[0] = this.lerp(this.end[0],this.norm[0],this.ease)
        this.mesh.program.uniforms.uMouse.value = this.end
        this.renderer.render({ scene: this.mesh })

      },
      onComplete:()=>{
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
        this.canvas.remove()
      }
    })
    .to(this.canvas,{
        webkitFilter:'blur('+6+'px)',filter:'blur('+6+'px)',
        opacity:0,
        duration:.6,
       ease:'power2.inOut'
      } 
     ,.4)
  }
  onResize(viewport,screen){

    this.viewport = [viewport.w,viewport.h]
    this.screen = [screen.w,screen.h]

    let bound = this.media.getBoundingClientRect()
    this.bound = [bound.x,bound.y,bound.width,bound.height]

    let calc = 0
    
    let fix =  this.screen[1]*.2
    if(this.touch == 0){
      
      if(this.media.clientHeight > this.screen[1]*.7){
        calc = this.screen[1]*-.4
      }

    }
    else{
      if(this.screen[0] < this.screen[1]){
        fix = 0
        calc = 0
      }
    }

    this.ctr.start =  parseInt((bound.y - screen.h + window.scrollY + fix))
    this.ctr.limit = parseInt((this.media.clientHeight + calc + fix  ))

    if(this.mesh){
      
      this.updateY()

      this.renderer.setSize(bound.width,bound.height)

      this.mesh.program.uniforms.uCover.value = new Vec2(this.bound[2],this.bound[3])
      
      this.renderer.render({ scene: this.mesh })
    }
  }

  lerp(value1, value2, t){
    return value1 * (1 - t) + value2 * t
  }

}

Base.prototype.check = check
Base.prototype.start = start
Base.prototype.stop = stop
Base.prototype.updateX = updateX
Base.prototype.updateY = updateY
Base.prototype.updateAnim = updateAnim
Base.prototype.updateScale = updateScale

export default Base