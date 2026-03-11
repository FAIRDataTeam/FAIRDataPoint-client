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
import { defineComponent } from 'vue'
import _ from 'lodash'

export default defineComponent({
  data() {
    return {
      q: '' as string,
      routeQ: '' as string,
    }
  },
  watch: {
    $route: 'setQ',
  },
  created(): void {
    this.setQ()
  },
  methods: {
    submit() {
      if (this.q.length > 0) {
        this.$router.push({ path: '/search', query: { q: this.q } }).catch(() => {})
      }
    },
    setQ() {
      this.routeQ = _.get(this.$route, 'query.q', '') as string
      this.q = this.routeQ
    },
  },
})
</script>
