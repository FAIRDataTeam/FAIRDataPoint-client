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
    <small><router-link to="/search">Advanced</router-link></small>
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
      this.$router.push({ path: '/search', query: { q: this.q } }).catch(() => {})
    }
  }

  created(): void {
    this.setQ()
  }

  @Watch('$route')
  setQ() {
    this.routeQ = _.get(this.$route, 'query.q', '') as string
    this.q = this.routeQ
  }
}
</script>
