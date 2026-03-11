import { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<any>
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}

export {}
