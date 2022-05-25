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

  routeQ: string = null

  submit() {
    if (this.q.length > 0) {
      if (this.routeQ === this.q) {
        this.$router.go(0)
      } else {
        this.$router.push(`/search?q=${this.q}`)
      }
    }
  }

  created(): void {
    this.setQ()
  }

  @Watch('$route')
  setQ() {
    this.routeQ = _.get(this.$route, 'query.q', '')
    this.q = this.routeQ
  }
}
</script>
