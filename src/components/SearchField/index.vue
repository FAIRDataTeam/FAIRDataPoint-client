<template>
  <div class="search-field">
    <fa :icon="['fas', 'search']" />
    <input
      type="text"
      placeholder="Search FAIR Data Point..."
    >
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SearchField extends Vue {
}
</script>
