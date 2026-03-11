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
          <span>{{ current }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    links: { type: Array, required: true },
    current: { type: String, required: true },
  },
})
</script>
