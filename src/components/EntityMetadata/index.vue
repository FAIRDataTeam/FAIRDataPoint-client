<template>
  <div class="entity-metadata">
    <div
      v-for="(group, groupIndex) in filteredMetadata"
      :key="groupIndex"
      class="entity-metadata__group"
    >
      <div
        v-if="group.label"
        class="entity-metadata__group__title"
      >
        <h2>{{ group.label }}</h2>
        <p v-if="group.comment">
          {{ group.comment }}
        </p>
      </div>

      <div
        v-for="(data, dataIndex) in group.fields"
        :key="`${groupIndex}-${dataIndex}`"
        class="entity-metadata__item"
      >
        <h3>{{ data.label }}</h3>
        <p>
          <template v-if="data.links">
            <a
              v-for="(link, linkIndex) in data.links"
              :key="linkIndex"
              :href="link.uri"
              target="_blank"
              class="link"
            >
              {{ link.label }}
            </a>
          </template>
          <template v-else-if="data.items">
            <ul>
              <li
                v-for="(item, itemIndex) in viewItems(`${groupIndex}-${dataIndex}`, data.items)"
                :key="itemIndex"
              >
                <rdf-link
                  v-if="item.uri"
                  :uri="item.uri"
                  :label="item.label"
                  :label-resolved="item.labelResolved"
                />
                <template v-else>
                  {{ item.label }}
                </template>
              </li>
            </ul>
            <a
              v-if="showMoreActive(`${groupIndex}-${dataIndex}`, data.items)"
              class="show-more-link"
              @click.prevent="addViewAll(`${groupIndex}-${dataIndex}`)"
            >
              <fa :icon="['fas', 'chevron-down']" />
              Show more
            </a>
            <a
              v-if="showLessActive(`${groupIndex}-${dataIndex}`, data.items)"
              class="show-more-link"
              @click.prevent="removeViewAll(`${groupIndex}-${dataIndex}`)"
            >
              <fa :icon="['fas', 'chevron-up']" />
              Show less
            </a>
          </template>
          <template v-else>
            <rdf-link
              v-if="data.uri"
              :uri="data.uri"
              :label="data.value"
              :label-resolved="data.labelResolved"
            />
            <template v-else>
              {{ data.value }}
            </template>
          </template>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import RdfLink from '@/components/RdfLink/index.vue'

export default defineComponent({
  components: { RdfLink },
  props: {
    metadata: { type: Array, default: () => [] },
  },
  data() {
    return {
      viewAll: [],
    }
  },
  computed: {
    filteredMetadata() {
      if (!this.metadata) return []
      return this.metadata.filter((group) => group.fields.length > 0)
    },
  },
  methods: {
    viewItems(key, items) {
      if (this.showMoreActive(key, items)) {
        return items.slice(0, 3)
      }
      return items
    },
    showMoreActive(key, items) {
      return items.length > 4 && !this.getViewAll(key)
    },
    showLessActive(key, items) {
      return items.length > 4 && this.getViewAll(key)
    },
    getViewAll(key) {
      return _.includes(this.viewAll, key)
    },
    addViewAll(key) {
      this.viewAll.push(key)
    },
    removeViewAll(key) {
      this.viewAll = this.viewAll.filter((i) => i !== key)
    },
  },
})
</script>
