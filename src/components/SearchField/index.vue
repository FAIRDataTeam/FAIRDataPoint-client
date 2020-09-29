<template>
  <form
    class="search-field"
    @submit.prevent="submit"
  >
    <fa :icon="['fas', 'search']" />
    <input
      v-model="q"
      type="text"
      placeholder="Search FAIR Data Point..."
    >
  </form>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SearchField extends Vue {
  q: string = ''

  submit() {
    this.$router.push(`/search?q=${this.q}`)
  }
}
</script>
