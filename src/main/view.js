//VIEWS
import Home from '../views/Home/home.js'
import Projects from '../views/Projects/projects.js'
import Project from '../views/Project/project.js'
import About from '../views/About/about.js'
import Error from '../views/Error/error.js'
import Playground from '../views/Playground/playground.js'

export function createViews(){

  this.pages = new Map()
    this.pages.set('home', new Home(this.main))
    this.pages.set('projects', new Projects(this.main))
    this.pages.set('project', new Project(this.main))
    this.pages.set('about', new About(this.main))
    this.pages.set('error', new Error(this.main))
    this.pages.set('playground', new Playground(this.main))

}