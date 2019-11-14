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
