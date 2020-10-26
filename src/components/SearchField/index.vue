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
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class SearchField extends Vue {
  q: string = ''

  submit() {
    if (this.q.length > 0) {
      this.$router.push(`/search?q=${this.q}`)
    }
  }

  created(): void {
    this.setQ()
  }

  @Watch('$route')
  setQ() {
    this.q = _.get(this.$route, 'query.q', '')
  }
}
</script>
