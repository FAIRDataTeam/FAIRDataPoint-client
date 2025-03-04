<template>
  <div
    class="page"
    :class="{
      'page--content-only': contentOnly,
      'page--small': small,
    }"
  >
    <slot name="pagenav" />
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
<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Page extends Vue {
  @Prop({ type: String, default: null })
  readonly title?: string

  @Prop({ type: Boolean, default: false })
  readonly contentOnly: boolean

  @Prop({ type: Boolean, default: false })
  readonly small: boolean
}
</script>
