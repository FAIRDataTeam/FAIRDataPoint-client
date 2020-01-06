<template>
  <div id="app">
    <fdp-header />
    <router-view />
    <fdp-footer />
  </div>
</template>
<script>
import FdpFooter from './components/FdpFooter'
import FdpHeader from './components/FdpHeader'

export default {
  components: {
    FdpFooter,
    FdpHeader,
  },
}
</script>
<style lang="scss">
@import "scss/main";
</style>
