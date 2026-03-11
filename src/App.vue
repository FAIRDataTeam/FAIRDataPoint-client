<template>
  <div id="app">
    <fdp-header />
    <router-view />
    <fdp-footer />
  </div>
</template>
<script lang="ts">
import FdpFooter from './components/FdpFooter/index.vue'
import FdpHeader from './components/FdpHeader/index.vue'

export default {
  components: {
    FdpFooter,
    FdpHeader,
  },
}
</script>
<style lang="scss">
@use "scss/main";
</style>
