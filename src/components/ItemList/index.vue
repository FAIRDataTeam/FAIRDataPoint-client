<template>
  <div class="item-list">
    <div class="item-list__header">
      <h2>
        {{ title }}
      </h2>
      <router-link
        v-if="createLink"
        class="btn btn-link"
        :to="createLink"
        data-cy="create"
      >
        <fa :icon="['fas', 'plus']" />
        Create
      </router-link>
    </div>
    <div
      v-if="status.isError()"
      class="status-flash__alert status-flash__alert--danger"
    >
      {{ status.message }}
    </div>
    <div v-if="status.isDefault()">
      <div
        v-if="items.length === 0"
        class="item-list__empty"
      >
        {{ emptyText }}
      </div>
      <item
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        data-cy="item"
      />

      <pagination
        :current-page="currentPage"
        :last-page="lastPage"
        @pageSelected="loadPage"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import _ from 'lodash'
import parseLinkHeader from 'parse-link-header'
import { ChildSpec, EntityConfig } from '@/entity/EntityConfig'
import Status from '@/utils/Status'
import Graph from '@/rdf/Graph'
import Pagination from '@/components/Pagination/index.vue'
import Item from '../Item/index.vue'

export default defineComponent({
  components: { Item, Pagination },
  props: {
    config: { type: Object as PropType<EntityConfig>, required: true },
    childSpec: { type: Object as PropType<ChildSpec>, required: true },
    meta: { type: Object as PropType<any>, required: true },
    childUrlPrefix: { type: String, required: true },
    entityId: { type: [String, Number] as PropType<any>, required: true },
    title: { type: String, required: true },
    createLink: { type: String, required: false, default: null },
  },
  data() {
    return {
      status: new Status(),
      items: [] as Array<any>,
      currentPage: null as number | null,
      firstPage: null as number | null,
      lastPage: null as number | null,
      prevPage: null as number | null,
      nextPage: null as number | null,
    }
  },
  computed: {
    emptyText() {
      return `There are no ${_.toLower(this.title)}.`
    },
  },
  watch: {
    $route: 'init',
  },
  created(): void {
    this.init()
  },
  methods: {
    async init(): Promise<void> {
      await this.fetchData()
    },
    async fetchData(): Promise<void> {
      await this.loadPage(0)
    },
    async loadPage(pageNumber): Promise<void> {
      if (this.currentPage === pageNumber) return

      try {
        this.status.setPending()
        const response = await this.config.api.getChildren(
          this.entityId,
          this.childUrlPrefix,
          pageNumber,
        )
        const graph = new Graph(response.data, this.config.subject(this.entityId))

        const linkHeader = parseLinkHeader(_.get(response.headers, 'link'))

        this.currentPage = pageNumber

        const parsePage = (page) => {
          const pageString = _.get(linkHeader, `${page}.page`)
          return pageString ? parseInt(pageString, 10) : pageString
        }

        this.firstPage = parsePage('first')
        this.lastPage = parsePage('last')
        this.prevPage = parsePage('prev')
        this.nextPage = parsePage('next')

        const { resourceDefinitionUuid } = this.childSpec
        const childEntityConfig = this.$store.getters['entities/configByUuid'](resourceDefinitionUuid)
        this.items = this.config.createChildrenList(
          childEntityConfig.spec,
          this.childSpec,
          graph,
          this.meta,
        )

        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to load data')
      }
    },
  },
})
</script>
