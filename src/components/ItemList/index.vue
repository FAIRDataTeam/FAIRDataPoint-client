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
import _ from 'lodash'
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'
import parseLinkHeader from 'parse-link-header'
import Item from '../Item/index.vue'
import { ChildSpec, EntityConfig, EntitySpec } from '@/entity/EntityConfig'
import Status from '@/utils/Status'
import Graph from '@/rdf/Graph'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  components: { Item, Pagination },
})
export default class ItemList extends Vue {
  @Prop({ required: true })
  readonly config: EntityConfig

  @Prop({ required: true })
  readonly childSpec: ChildSpec

  @Prop({ required: true })
  readonly meta: any

  @Prop({ type: String, required: true })
  readonly childUrlPrefix: string

  @Prop({ required: true })
  readonly entityId: any

  @Prop({ type: String, required: true })
  readonly title: string

  @Prop({ type: String, required: false, default: null })
  readonly createLink: string

  status: Status = new Status()

  items: Array<any> = []

  currentPage: number = null

  firstPage: number = null

  lastPage: number = null

  prevPage: number = null

  nextPage: number = null

  get emptyText() {
    return `There are no ${_.toLower(this.title)}.`
  }

  created(): void {
    this.init()
  }

  @Watch('$route')
  async init(): Promise<void> {
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    await this.loadPage(0)
  }

  async loadPage(pageNumber): Promise<void> {
    if (this.currentPage === pageNumber) return

    try {
      this.status.setPending()
      const response = await this.config.api.getChildren(
        this.entityId, this.childUrlPrefix, pageNumber,
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


      const childEntityConfig = this.$store.getters['entities/configByUuid'](this.childSpec.resourceDefinitionUuid)
      this.items = this.config.createChildrenList(
        childEntityConfig.spec, this.childSpec, graph, this.meta,
      )

      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to load data')
    }
  }
}
</script>
