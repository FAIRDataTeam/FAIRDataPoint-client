import './polyfills'
import _ from 'lodash'
import { createApp } from 'vue'
import { Components, Directives, createBootstrap } from 'bootstrap-vue-next'
import vSelect from 'vue-select'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'prismjs/themes/prism.css'
import 'vue-prism-editor/dist/prismeditor.min.css'
import 'vue-select/dist/vue-select.css'
import 'prismjs'
import 'prismjs/components/prism-turtle'
import 'prismjs/components/prism-sparql'
import { createEntityConfigs } from '@/entity/entityConfigs'
import type { EntitySpec } from '@/entity/EntityConfig'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import api from './api'
import { registerFontAwesome } from './font-awesome'

let entitySpecs: EntitySpec[] = []

api.configs.getBootstrap()
  .then((config) => {
    // default to remote config from FDP API, but allow override via local public/config.js file
    ['persistentURL', 'appTitle', 'appSubtitle', 'index'].forEach(
      (prop) => {
        if (!_.has(window, `config.${prop}`)) {
          _.set(window, `config.${prop}`, _.get(config, `data.${_.camelCase(prop)}`))
        }
      },
    )
    // use resource definitions from remote config without possibility to override
    entitySpecs = _.get(config, 'data.resourceDefinitions', [])
  })
  .finally(() => {
    const entityConfigs = createEntityConfigs(entitySpecs)
    const store = createStore(entityConfigs)
    const router = createRouter(store)

    const app = createApp(App)

    registerFontAwesome(app)
    app.use(createBootstrap())
    Object.entries(Components).forEach(([name, component]) => {
      app.component(name, component as any)
    })
    const directiveMap: Record<string, string> = {
      vBColorMode: 'b-color-mode',
      vBModal: 'b-modal',
      vBPopover: 'b-popover',
      vBScrollspy: 'b-scrollspy',
      vBToggle: 'b-toggle',
      vBTooltip: 'b-tooltip',
    }
    Object.entries(Directives).forEach(([key, directive]) => {
      const name = directiveMap[key] || key
      app.directive(name, directive)
    })
    app.component('VSelect', vSelect)
    app.use(store)
    app.use(router)

    app.mount('#app')
  })
