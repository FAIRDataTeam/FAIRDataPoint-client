<template>
  <div class="header">
    <div class="header__container">
      <router-link
        to="/"
        class="header__fdp-name"
      >
        FAIR Data Point
      </router-link>
      <div class="header__nav">
        <div class="header__search-field">
          <fa :icon="['fas', 'search']" />
          <input
            type="text"
            placeholder="Search FAIR Data Point..."
          >
        </div>
        <div class="header__menu">
          <router-link
            v-if="!authenticated"
            to="/login"
          >
            Log in
          </router-link>
          <template v-else>
            <router-link to="/users">
              Users
            </router-link>
            <a @click="logout">
              Log out
            </a>
          </template>
        </div>
      </div>
    </div>
    <Separator />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Separator from './Separator.vue'

export default {
  name: 'Header',
  components: {
    Separator,
  },
  computed: {
    ...mapGetters('auth', {
      authenticated: 'authenticated',
    }),
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      if (this.$router.currentRoute.path !== '/fdp') {
        this.$router.push('/fdp')
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/mixins";
@import "../scss/text-styles";

.header {
  width: 100%;
  height: $header-height;

  &__container {
    max-width: $container-max-width;
    padding: 0 $container-padding;
    margin: auto;
    height: $header-height - $separator-colorful-height;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__fdp-name {
    @include text-style-primary-32-bold;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: $header-logo-width + $header-logo-indent;
    background: url($header-logo-url) left center no-repeat;
    background-size: $header-logo-width $header-logo-height;
    text-decoration: none;
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__menu {
    margin-left: $space-lg;

    a {
      @include text-style-default-16-semibold;
      white-space: nowrap;
      text-decoration: none;

      &:not(:last-child) {
        margin-right: $space-md;
      }

      &:hover {
        color: $color-primary;
      }
    }
  }

  &__search-field {
    @include border-radius($border-radius-full);
    background: $color-background-highlighted;
    width: $header-search-width;
    height: $header-search-height;
    position: relative;

    @media (max-width: $breakpoint-small - 1px) {
      display: none;
    }

    .svg-inline--fa {
      position: absolute;
      left: 13px;
      top: 50%;
      margin-top: -8px;
      color: $color-text-lighter;
    }

    input {
      @include text-style-default-16;
      border: none;
      width: 100%;
      padding: 0 $header-search-input-padding-right 0 $header-search-input-padding-left;
      height: 100%;
      outline: none;
      background: none;
      box-sizing: border-box;

      &::placeholder {
        @include text-style-light-16;
      }
    }
  }
}
</style>
