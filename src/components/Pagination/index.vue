<template>
  <nav class="d-flex justify-content-center">
    <ul
      v-if="data.totalPages > 1"
      class="pagination"
    >
      <li class="page-item">
        <router-link
          v-if="currentPage > 1"
          :to="`${baseUrl}&page=1`"
          class="page-link"
        >
          <fa :icon="['fas', 'angle-double-left']" />
          First
        </router-link>
      </li>
      <li :class="{'page-item': true, 'disabled': currentPage <= 1 }">
        <router-link
          :to="`${baseUrl}&page=${currentPage - 1}`"
          class="page-link"
        >
          <fa :icon="['fas', 'angle-left']" />
          Prev
        </router-link>
      </li>
      <li
        v-if="currentPage - 4 > 1"
        class="page-item disabled"
      >
        <a class="page-link">...</a>
      </li>
      <li
        v-for="page in pageRange"
        :key="page"
        :class="{'page-item': true, 'active': page === currentPage}"
      >
        <router-link
          :to="`${baseUrl}&page=${page}`"
          :class="{'page-link': true, 'active': page === currentPage}"
        >
          {{ page }}
        </router-link>
      </li>
      <li
        v-if="currentPage + 4 < lastPage"
        class="page-item disabled"
      >
        <a class="page-link">...</a>
      </li>
      <li :class="{'page-item': true, 'disabled': currentPage >= lastPage }">
        <router-link
          :to="`${baseUrl}&page=${currentPage + 1}`"
          class="page-link"
        >
          Next
          <fa :icon="['fas', 'angle-right']" />
        </router-link>
      </li>
      <li class="page-item">
        <router-link
          v-if="currentPage < lastPage"
          :to="`${baseUrl}&page=${data.lastPage}`"
          class="page-link"
        >
          Last
          <fa :icon="['fas', 'angle-double-right']" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import _ from 'lodash'

@Component
export default class Pagination extends Vue {
  @Prop({ type: Object, required: true })
  readonly data: any

  @Prop({ type: String, required: true })
  readonly baseUrl: string


  @Prop({ type: Number, required: true })
  readonly currentPage: number

  get pageRange() {
    const start = Math.max(this.currentPage - 4, 1)
    const end = Math.min(this.currentPage + 4, this.lastPage)
    return _.range(start, end + 1)
  }

  get lastPage() {
    return this.data.totalPages
  }
}
</script>
