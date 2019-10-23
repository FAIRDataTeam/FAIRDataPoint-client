<template>
  <a
    class="button"
    :class="{'button--with-icon': !!icon}"
    :href="href"
    target="_blank"
  >
    <fa
      v-if="!!icon"
      :icon="icon"
    />
    {{ title }}
  </a>
</template>
<script>
export default {
  name: 'Button',
  props: {
    icon: {
      validator: Array.isArray,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/mixins";
@import "../scss/text-styles";

.button {
  @include text-style-light-18-bold;
  @include transition-default(background);
  @include border-radius($border-radius-full);
  padding: .75rem 1rem;
  text-decoration: none;
  font-weight: bold;
  background: $color-primary;

  &:hover {
    background: $color-primary-lighter;
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
</style>
