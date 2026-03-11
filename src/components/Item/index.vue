<template>
  <div class="item">
    <router-link
      :to="item.link"
      class="item__title"
    >
      {{ item.title }}
    </router-link>
    <p
      v-if="item.description"
      class="item__description"
    >
      {{ truncate(item.description) }}
    </p>
    <div
      v-if="item.tags"
      class="item__tags"
    >
      <a
        v-for="(tag, index) in item.tags"
        :key="index"
        :href="tag.uri"
        class="item__tags__tag"
        target="_blank"
      >
        {{ tag.label }}
      </a>
    </div>
    <dl
      v-if="item.metadata"
      class="item__metadata"
    >
      <div
        v-for="(metadata, index) in item.metadata"
        :key="index"
        class="item__metadata__row"
      >
        <dt>
          {{ metadata.label }}
        </dt>
        <dd>
          {{ metadata.value }}
        </dd>
      </div>
    </dl>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { truncate } from '@/filters'

export default defineComponent({
  props: {
    item: { type: Object as PropType<any>, required: true },
  },
  methods: {
    truncate(value: string) {
      return truncate(value)
    },
  },
})
</script>
