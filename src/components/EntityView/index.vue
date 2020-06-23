<template>
  <div>
    <breadcrumbs
      v-if="breadcrumbs && breadcrumbs.length > 0"
      :links="breadcrumbs"
      :current="entity.title"
    />
    <status-flash :status="status" />
    <page
      v-if="entity !== null"
      :title="title"
    >
      <template v-slot:actions>
        <membership-badge :entity="meta" />
        <button
          v-if="actionEnabled('publish') && isDraft && (isAdmin || permissions.hasWrite(meta))"
          class="btn btn-link"
          data-cy="publish"
          @click="publishEntity"
        >
          <fa :icon="['fas', 'file-export']" />
          Publish
        </button>
        <router-link
          v-if="actionEnabled('edit') && (isAdmin || permissions.hasWrite(meta))"
          class="btn btn-link"
          :to="actionUrl('edit')"
          data-cy="edit"
        >
          <fa :icon="['fas', 'edit']" />
          Edit
        </router-link>
        <router-link
          v-if="actionEnabled('settings') && (isAdmin || permissions.hasWrite(meta))"
          class="btn btn-link"
          :to="actionUrl('settings')"
          data-cy="settings"
        >
          <fa :icon="['fas', 'cog']" />
          Settings
        </router-link>
        <a
          v-if="actionEnabled('delete') && isAdmin"
          class="btn btn-link text-danger"
          data-cy="delete"
          @click="deleteEntity"
        >
          <fa :icon="['far', 'trash-alt']" />
          Delete
        </a>
      </template>
      <template v-slot:column>
        <p>
          <a
            v-for="link in extraLinks"
            :key="link.url"
            class="btn btn-primary btn-rounded mr-3 mb-3"
            :href="link.url"
            target="_blank"
            data-cy="external-link"
          >
            <fa :icon="link.icon" />
            {{ link.label }}
          </a>
        </p>
        <entity-metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ entity.description }}
        </p>
        <template v-if="itemLists !== null">
          <item-list
            v-for="(itemList, index) in itemLists"
            :key="index"
            :title="itemList.title"
            :items="itemList.items"
            :create-link="itemList.createLink"
            data-cy="item-list"
          />
        </template>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import axios from 'axios'
import _ from 'lodash'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import EntityMetadata from '@/components/EntityMetadata/index.vue'
import ItemList from '@/components/ItemList/index.vue'
import MembershipBadge from '@/components/MembershipBadge/index.vue'
import Page from '@/components/Page/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import metadata from '@/utils/metadata'
import permissions from '@/utils/permissions'
import { parseSHACLView } from '@/components/ShaclForm/Parser/SHACLViewParser'
import EntityBase from '@/components/EntityBase'


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
export default class EntityView extends EntityBase {
  createLink: string = null

  extraLinks: any[] = []

  itemLists: any = null

  meta: any = null

  metadata: any = null

  shape: any = null

  get permissions() {
    return permissions
  }

  get canCreateChild() {
    return this.config.hasChildren
      && (this.isAdmin || this.config.canCreateChild(this.isAuthenticated, this.meta))
  }

  get isDraft() {
    return _.get(this.meta, 'state.current') === 'DRAFT'
  }

  get title() {
    return this.isDraft ? `[DRAFT] ${this.entity.title}` : this.entity.title
  }

  actionEnabled(action: string): boolean {
    return _.includes(this.config.viewActions, action)
  }

  actionUrl(action: string): string {
    const { path } = this.$route
    return _.endsWith('/', path) ? `${path}${action}` : `${path}/${action}`
  }

  reset() {
    this.metadata = null
    this.itemLists = null
    this.meta = null
    this.extraLinks = []
    this.createLink = null
    this.shape = null
  }

  async fetchData(): Promise<void> {
    try {
      this.status.setPending()
      const [entity, spec, meta] = await this.loadData()

      this.buildGraph(entity.data)

      this.shape = parseSHACLView(spec.data, this.config.targetClasses)
      this.meta = meta.data
      this.metadata = this.createMetadata()
      this.extraLinks = this.config.getLinks(this.graph)
      this.breadcrumbs = this.config.createBreadcrumbs(this.graph, this.entityId)

      if (this.config.hasChildren) {
        this.itemLists = this.config.createChildrenLists(
          this.graph,
          this.meta,
          this.canCreateChild,
          this.entityId,
        )
      }

      this.status.setDone()
    } catch (error) {
      this.status.setErrorFromResponse(error, 'Unable to get data.')
    }
  }

  async loadData() {
    return axios.all([
      this.config.api.getExpanded(this.entityId),
      this.config.api.getSpec(),
      this.getMeta(),
    ])
  }

  getMeta() {
    return this.isAuthenticated
      ? this.config.api.getMeta(this.entityId)
      : Promise.resolve({ data: {} })
  }

  createMetadata() {
    return [
      ...metadata.commonMetadata(this.graph),
      ...this.createLocalMetadata(),
      metadata.rdfLinks(this.subject),
    ]
  }

  createLocalMetadata() {
    return this.shape.fields
      .map(field => metadata.fromShaclField(this.graph, field))
      .filter(field => field !== null)
  }

  async deleteEntity() {
    if (window.confirm(`Are you sure you want to delete ${this.entity.title}?`)) {
      try {
        await this.config.api.delete(this.entityId)
        const parent = _.get(_.last(this.breadcrumbs), 'to', '/')
        await this.$router.push(parent)
      } catch (err) {
        this.status.setError('Unable to delete data.')
      }
    }
  }

  async publishEntity() {
    if (window.confirm(`Are you sure you want to publish ${this.entity.title}?`)) {
      try {
        this.status.setPending()
        await this.config.api.putMetaState(this.entityId, { current: 'PUBLISHED' })
        await this.fetchData()
      } catch (err) {
        this.status.setError('Unable to publish data.')
      }
    }
  }
}
</script>
