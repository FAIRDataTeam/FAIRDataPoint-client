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
@import "./scss/typography";

// 3rd party SCSS
@import "./scss/bootstrap";
@import "./scss/vue-select";

// Application SCSS
@import "./scss/common";
@import "./scss/form";
@import "./scss/item-list";

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
