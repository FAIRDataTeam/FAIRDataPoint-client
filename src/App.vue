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
@import "./scss/text-styles";

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

.text-right {
  text-align: right;
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

.btn {
  @include text-style-inverse-16;
  @include transition-default(background);
  @include border-radius($border-radius-default);
  padding: .75rem 1rem;
  text-decoration: none;
  font-weight: bold;
  background: $color-primary;
  cursor: pointer;
  outline: none;
  border: none;

  &:hover {
    background: $color-primary-lighter;
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;

    &:hover {
      background: $color-primary;
    }
  }

  &--rounded {
    @include border-radius($border-radius-full);
  }

  &--full {
    width: 100%;
  }

  &--with-icon {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    justify-content: space-around;
    padding: $space-sm $space-lg;

    svg {
      max-width: $space-md;
      max-height: $space-md;
      margin-right: $space-sm;
    }
  }
}

.form {
  &__group {
    margin-bottom: $space-lg;

    label {
      @include text-style-default-14-semibold;
      display: block;
      margin-bottom: $space-xs;
    }

    input {
      @include text-style-default-18;
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
        @include text-style-danger-14;
        display: block;
        margin: $space-xs 0;
      }
    }
  }
}
</style>
