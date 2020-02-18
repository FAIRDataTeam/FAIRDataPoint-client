<template>
  <div class="breadcrumbs">
    <div class="breadcrumbs__container">
      <ul>
        <li
          v-for="(link, index) in links"
          :key="index"
          data-cy="breadcrumbs-link"
        >
          <router-link :to="link.to">
            {{ link.label }}
          </router-link>
        </li>
        <li data-cy="breadcrumbs-current">
          {{ current }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Breadcrumbs extends Vue {
  @Prop({ type: Array, required: true })
  readonly links: Array<any>

  @Prop({ type: String, required: true })
  readonly current: String
}
</script>
