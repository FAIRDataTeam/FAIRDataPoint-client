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
@import "./scss/bootstrap";


h1 {
  @include typography-default-32-bold;
  margin-top: $space-lg;
  margin-bottom: $space-md;
}

h2 {
  @include typography-default-24-bold;
  margin-top: $space-lg;
  margin-bottom: $space-md;
}

body {
  background: $color-background;
  font-family: $font-family;
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
}

a {
  cursor: pointer;
  color: $color-primary;

  &:hover {
    color: $color-primary-lighter;
  }
}

.color-danger {
  color: $color-danger;

  &:hover {
    color: $color-danger-lighter;
  }
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


.form {
  margin-bottom: 6rem;

  &__group {
    margin-bottom: $space-lg;

    label {
      @include typography-default-14-semibold;
      display: block;
      margin-bottom: $space-xs;
    }

    input, select {
      @include typography-default-18;
      padding: $space-xs 0;
      width: 100%;
      box-sizing: border-box;
      border: none;
      border-bottom: 2px solid $color-text-light;
      outline: none;

      &::placeholder {
        color: $color-text-light;
      }
    }

    select {
      background: none;
      border-radius: 0;
      -webkit-appearance: none;
    }

    .invalid-feedback {
      display: none;
    }

    &--error {
      label {
        color: $color-danger;
      }

      input {
        border-bottom-color: $color-danger;
      }

      .invalid-feedback {
        @include typography-danger-14;
        display: block;
        margin: $space-xs 0;
      }
    }
  }
}

</style>
