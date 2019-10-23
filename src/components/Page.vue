<template>
  <div class="page">
    <h1 v-if="title">
      {{ title }}
    </h1>
    <div class="page__content-wrapper">
      <div class="page__column">
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
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/text-styles";

.page {
  width: 100%;
  max-width: $container-max-width;
  padding: 0 $container-padding;
  margin: auto;

  h1 {
    @include text-style-default-32-bold;
    margin-bottom: 0;
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
    padding: $space-md 0;

    @media (min-width: $breakpoint-small) {
      width: 63%;
    }

    .description {
      @include text-style-default-18;
      margin: 0;
      text-align: justify;

      @media (max-width: $breakpoint-small - 1px) {
        margin: $space-lg 0;
      }
    }
  }
}
</style>
