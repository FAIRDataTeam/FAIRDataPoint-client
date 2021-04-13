<template>
  <nav class="d-flex justify-content-center">
    <ul
      v-if="lastPage > 0"
      class="pagination"
    >
      <li
        v-if="currentPage > 0"
        class="page-item"
      >
        <a
          href=""
          class="page-link"
          :class="{'disabled': currentPage===0}"
          @click.prevent="selectPage(0)"
        >
          <fa :icon="['fas', 'angle-double-left']" />
          First
        </a>
      </li>
      <li :class="{'page-item': true, 'disabled': currentPage <= 0 }">
        <a
          href=""
          class="page-link"
          @click.prevent="selectPage(currentPage - 1)"
        >
          <fa :icon="['fas', 'angle-left']" />
          Prev
        </a>
      </li>
      <li
        v-if="currentPage - pageSelectionCount > 1"
        class="page-item disabled"
      >
        <a class="page-link">...</a>
      </li>
      <li
        v-for="page in pageRange"
        :key="page"
        :class="{'page-item': true, 'active': page === currentPage}"
      >
        <a
          href=""
          class="page-link"
          @click.prevent="selectPage(page)"
        >
          {{ page + 1 }}
        </a>
      </li>
      <li
        v-if="currentPage + pageSelectionCount < lastPage"
        class="page-item disabled"
      >
        <a class="page-link">...</a>
      </li>
      <li :class="{'page-item': true, 'disabled': currentPage >= lastPage }">
        <a
          href=""
          class="page-link"
          @click.prevent="selectPage(currentPage + 1)"
        >
          Next
          <fa :icon="['fas', 'angle-right']" />
        </a>
      </li>
      <li class="page-item">
        <a
          v-if="currentPage < lastPage"
          class="page-link"
          href=""
          @click.prevent="selectPage(lastPage)"
        >
          Last
          <fa :icon="['fas', 'angle-double-right']" />
        </a>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import _ from 'lodash'

@Component
export default class Pagination extends Vue {
  @Prop({ type: Number, required: true })
  readonly lastPage: number

  @Prop({ type: Number, required: true })
  readonly currentPage: number

  readonly pageSelectionCount = 3;

  get pageRange() {
    const start = Math.max(this.currentPage - this.pageSelectionCount, 0)
    const end = Math.min(this.currentPage + this.pageSelectionCount, this.lastPage)
    return _.range(start, end + 1)
  }

  selectPage(page) {
    if (page !== this.currentPage) {
      this.$emit('pageSelected', page)
    }
  }
}
</script>
