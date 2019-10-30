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
          <b-dropdown
            v-else
            right
            variant="link"
          >
            <template v-slot:button-content>
              <UserAvatar
                :user="user"
                smaller
              />
            </template>
            <template v-if="user.role === 'ADMIN'">
              <b-dropdown-header>
                FAIR Data Point
              </b-dropdown-header>
              <b-dropdown-item @click="$router.push('/users')">
                <fa :icon="['fas', 'user-friends']" />
                Manage users
              </b-dropdown-item>
              <b-dropdown-divider />
            </template>
            <b-dropdown-header>
              {{ user.firstName }} {{ user.lastName }}
            </b-dropdown-header>
            <b-dropdown-item
              v-if="user.role === 'ADMIN'"
              @click="$router.push(`/users/${user.uuid}`)"
            >
              <fa :icon="['fas', 'user-edit']" />
              Edit profile
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              <fa :icon="['fas', 'sign-out-alt']" />
              Log out
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
    <Separator />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Separator from './Separator.vue'
import UserAvatar from './UserAvatar.vue'

export default {
  name: 'Header',
  components: {
    UserAvatar,
    Separator,
  },
  computed: {
    ...mapGetters('auth', {
      authenticated: 'authenticated',
      user: 'user',
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
<style lang="scss">
@import "../scss/variables";
@import "../scss/mixins";
@import "../scss/typography";

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
    @include typography-primary-32-bold;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: $header-logo-width + $header-logo-indent;
    background: url($header-logo-url) left center no-repeat;
    background-size: $header-logo-width $header-logo-height;
    text-decoration: none;

    &:hover {
      color: $color-primary;
      text-decoration: none;
    }
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__menu {
    margin-left: $space-md;

    & > a {
      @include typography-default-16-semibold;
      white-space: nowrap;
      text-decoration: none;

      &:not(:last-child) {
        margin-right: $space-md;
      }

      &:hover {
        color: $color-primary !important;
      }
    }

    .dropdown {
      .btn-link {
        text-decoration: none !important;
        display: flex;
        align-items: center;

        &:hover {
          text-decoration: none !important;
        }
      }

      .dropdown-menu {
        min-width: 17rem;

        svg {
          min-width: 1.5rem;
        }
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
      @include typography-default-16;
      border: none;
      width: 100%;
      padding: 0 $header-search-input-padding-right 0 $header-search-input-padding-left;
      height: 100%;
      outline: none;
      background: none;
      box-sizing: border-box;

      &::placeholder {
        @include typography-light-16;
      }
    }
  }
}
</style>
