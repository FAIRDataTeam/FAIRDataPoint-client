<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>
<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

export default {
  components: {
    Footer,
    Header,
  },
}
</script>
<style lang="scss">
@import "./scss/variables";
@import "./scss/mixins";

body {
  background: $color-background;
  font-family: $font-family;
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
