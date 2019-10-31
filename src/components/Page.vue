<template>
  <div
    class="page"
    :class="{
      'page--content-only': contentOnly,
      'page--small': small,
    }"
  >
    <div class="page__title">
      <h1 v-if="title">
        {{ title }}
      </h1>
      <div class="page__actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="page__content-wrapper">
      <div
        v-if="!contentOnly"
        class="page__column"
      >
        <slot name="column" />
      </div>
      <div class="page__content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Page',
  props: {
    title: {
      validator: value => typeof value === 'string' || value === null,
      default: null,
    },
    contentOnly: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/typography";

.page {
  width: 100%;
  max-width: $container-max-width;
  padding: 0 $container-padding;
  margin: auto;
  box-sizing: border-box;

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &__content-wrapper {
    @media (min-width: $breakpoint-small) {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
    }
  }

  &__column {
    @media (min-width: $breakpoint-small) {
      width: 32%;
    }
  }

  &__content {
    @media (min-width: $breakpoint-small) {
      width: 63%;
    }

    .description {
      @include typography-default-18;
      margin: 0;
      text-align: justify;

      @media (max-width: $breakpoint-small - 1px) {
        margin: $space-lg 0;
      }
    }
  }

  &--content-only {
    .page__content {
      width: 100%;
    }
  }

  &--small {
    max-width: $container-small-max-width;
  }
}
</style>
