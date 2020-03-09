<template>
  <div>
    <breadcrumbs
      v-if="breadcrumbs !== null"
      :links="breadcrumbs"
      :current="entity.title"
    />
    <status-flash :status="status" />
    <page
      v-if="entity !== null"
      :title="entity.title"
    >
      <template v-slot:actions>
        <membership-badge :entity="membership" />
        <router-link
          v-if="actionEnabled('edit') && (isAdmin || permissions.hasWrite(membership))"
          class="btn btn-link"
          :to="actionUrl('edit')"
          data-cy="edit"
        >
          <fa :icon="['fas', 'edit']" />
          Edit
        </router-link>
        <router-link
          v-if="actionEnabled('settings') && (isAdmin || permissions.hasWrite(membership))"
          class="btn btn-link"
          :to="actionUrl('settings')"
          data-cy="settings"
        >
          <fa :icon="['fas', 'cog']" />
          Settings
        </router-link>
      </template>
      <template v-slot:column>
        <p>
          <a
            v-for="action in extraActions"
            :key="action.url"
            class="btn btn-primary btn-rounded mr-3 mb-3"
            :href="action.url"
            target="_blank"
          >
            <fa :icon="action.icon" />
            {{ action.label }}
          </a>
        </p>
        <entity-metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ entity.description }}
        </p>
        <item-list
          v-if="itemList !== null"
          :title="itemList.title"
          :items="itemList.items"
          :data-cy="itemList.dataCy"
        />
      </template>
    </page>
  </div>
</template>
<script lang="ts">

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'
import axios from 'axios'
import _ from 'lodash'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import EntityMetadata from '@/components/EntityMetadata/index.vue'
import Graph from '@/rdf/Graph'
import ItemList from '@/components/ItemList/index.vue'
import MembershipBadge from '@/components/MembershipBadge/index.vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'
import metadata from '@/utils/metadata'
import permissions from '@/utils/permissions'
import { DCT } from '@/rdf/namespaces'

@Component({
  components: {
    Breadcrumbs,
    EntityMetadata,
    ItemList,
    MembershipBadge,
    Page,
    StatusFlash,
  },
})
export default class EntityView extends Vue {
  @Prop({ required: true })
  readonly config: any

  breadcrumbs: any = null

  entity: any = null

  metadata: any = null

  itemList: any = null

  status: Status = new Status()

  membership: any = null

  extraActions: any[] = []

  get entityId(): string {
    return this.$route.params.id
  }

  get isAdmin(): boolean {
    return this.$store.getters['auth/isAdmin']
  }

  get permissions() {
    return permissions
  }

  actionEnabled(action: string): boolean {
    return _.includes(this.config.actions, action)
  }

  actionUrl(action: string): string {
    const { path } = this.$route
    return _.endsWith('/', path) ? `${path}${action}` : `${path}/${action}`
  }

  created(): void {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData(): Promise<void> {
    try {
      this.status.setPending()

      const requests = [
        this.config.getEntity(this.entityId),
        this.config.getMembership(this.entityId),
      ]

      const [entity, membership] = await axios.all(requests)

      const graph = new Graph(entity.data, this.config.getSubject(this.entityId))

      this.membership = membership.data
      this.metadata = this.createMetadata(graph)
      this.entity = this.createEntityData(graph)

      if (this.config.getExtraActions) {
        this.extraActions = this.config.getExtraActions(graph)
      }

      if (this.config.createItemList) {
        this.itemList = this.config.createItemList(graph)
      }

      if (this.config.createBreadcrumbs) {
        this.breadcrumbs = this.config.createBreadcrumbs(graph)
      }

      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get data.')
    }
  }

  createEntityData(graph) {
    return {
      title: graph.findOne(DCT('title')),
      description: graph.findOne(DCT('description')),
    }
  }

  createMetadata(graph) {
    return [
      ...metadata.commonMetadata(graph),
      ...this.config.getEntityMetadata(graph),
      metadata.rdfLinks(),
    ]
  }
}
</script>
