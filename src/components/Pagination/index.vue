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
          :class="{ disabled: currentPage === 0 }"
          @click.prevent="selectPage(0)"
        >
          <fa :icon="['fas', 'angle-double-left']" />
          First
        </a>
      </li>
      <li :class="{ 'page-item': true, disabled: currentPage <= 0 }">
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
        :class="{ 'page-item': true, active: page === currentPage }"
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
      <li :class="{ 'page-item': true, disabled: currentPage >= lastPage }">
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
import { defineComponent } from 'vue'
import _ from 'lodash'

export default defineComponent({
  props: {
    lastPage: { type: Number, required: true },
    currentPage: { type: Number, required: true },
  },
  emits: ['pageSelected'],
  data() {
    return {
      pageSelectionCount: 3,
    }
  },
  computed: {
    pageRange() {
      const start = Math.max(this.currentPage - this.pageSelectionCount, 0)
      const end = Math.min(this.currentPage + this.pageSelectionCount, this.lastPage)
      return _.range(start, end + 1)
    },
  },
  methods: {
    selectPage(page) {
      if (page !== this.currentPage) {
        this.$emit('pageSelected', page)
      }
    },
  },
})
</script>
