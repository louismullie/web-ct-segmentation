// Import global scripts
import './scripts/app.js'

// Import config
import './scripts/config.js'

// Import Vue and middleware
import Vue from 'vue'
import VueRouter from 'vue-router'

// Plug middleware
Vue.use(VueRouter)

// Load app and components
import App from './App'

// Root level routes
import Uploader from './routes/Uploader/Uploader'
import Steps from './routes/Steps/Steps'

// Steps subroutes
import Serie from './routes/Steps/Serie/Serie'
import Level from './routes/Steps/Level/Level'
import Select from './routes/Steps/Select/Select'
import Regions from './routes/Steps/Regions/Regions'

// Init router
let router = new VueRouter({
  // Use an internal mode that dosen't update urls
  abstract: true
})

// Define routes
router.map({
  '/': {

    component: Uploader

  },
  '/steps': {

    component: Steps,

    subRoutes: {

      '/serie': { component: Serie },
      '/level': { component: Level },
      '/select': { component: Select },
      '/regions': { component: Regions },

    }

  }
})

// Plug app on <app></app> element
router.start(App, 'app')
