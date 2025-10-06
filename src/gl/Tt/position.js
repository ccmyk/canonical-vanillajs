export function check(entry){
    let vis = false
      
    vis = entry.isIntersecting
    
    if(vis == 1){
      this.start()

    }
    else if(vis == 0){
      this.stop()
    }
    return vis

}

export function start(){
    if(this.active == 1){
      return false
    }

    if(this.active == -1){

      let arr = [.8,2,2]
      if(this.el.dataset.nome){

        arr = [.8,2,2]
      }
      this.animstart = gsap.timeline({paused:true})
      .fromTo(this.mesh.program.uniforms.uStart,
       {value:1},
       {
        value:0,
        duration:arr[0],
        ease:'power4.inOut'
       } 
      ,0)
      .fromTo(this.mesh.program.uniforms.uPower,
        {value:.5},
        {
         value:0,
         duration:arr[1],
         ease:'power2.inOut'
        } 
       ,0)
       .set(this.mesh.program.uniforms.uKey,
         
         {
          value:-1,
          onComplete:()=>{

            this.tt.classList.add('act')
            this.stopt = 1
            this.actualChar = -1
          }
         } 
        ,'>')

        this.animstart.play()

        

        

    }
    this.active = 1
   
}

export function stop(){

  if(this.animstart){

    if(this.animstart.progress()!=1){
      
      return false
    }

  }
  if(this.active < 1  ){
    return false
  }

  this.active = 0
  
}
export function updateX (x = 0) {
  
  
}
export function updateY (y = 0) {

  
} 

export function updateScale () {

}