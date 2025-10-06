import Page from '../../js/pagemain.js'

//COMPS
import Intro from './0Intro'

class Home extends Page {
  constructor (main) {
    super(main)
  }

  async create(content,main,temp=undefined) {
    super.create(content,main)
    if(temp!=undefined){

      document.querySelector('#content').insertAdjacentHTML('afterbegin',temp)
    }
    else{
      let data = await this.loadRestApi({
        type:'pages',
        id:content.dataset.id,
        template:content.dataset.template
      })
      document.querySelector('#content').insertAdjacentHTML('afterbegin',data.csskfields.main)
    }
    this.el = document.querySelector('main')
    

    this.DOM = {
      el:this.el
    }

    

    await this.createComps()
    await this.createIos()
    

    await this.getReady()
  }
  iOpage(animobj){
   
    
    return animobj
  }

  
  
  async createComps(){
   

    await super.createComps()
    if(this.DOM.el.querySelector('.error_intro')){
      this.components.intro = new Intro(this.DOM.el.querySelector('.error_intro'),this.main.device)
    
    }
    
    

  }

  async animIntro(val){

    
    if(this.components.intro){
      this.components.intro.start()
    }

    return val
   
  }

  async animOut(){
    
    super.animOut()

  }

}

export default Home
