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
      :content-only="true"
    >
      <template
        v-if="isRepository && isIndex"
        #pagenav
      >
        <ul class="nav nav-tabs nav-fill mb-4 mt-4">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{'active': viewIndex}"
              href="#"
              @click.prevent="setViewIndex(true)"
            >Index</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{'active': !viewIndex}"
              href="#"
              @click.prevent="setViewIndex(false)"
            >Metadata</a>
          </li>
        </ul>
      </template>
      <template
        v-if="!viewIndex"
        #actions
      >
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
      <template
        v-if="viewIndex"
        #content
      >
        <fair-data-points />
      </template>
      <template
        v-else
        #content
      >
        <p class="description">
          {{ entity.description }}
        </p>
        <p class="external-links">
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

        <div class="mt-4">
          <a
            class="btn btn-outline-primary btn-rounded mr-2"
            :href="`${subject}?format=ttl`"
            target="_blank"
          ><fa :icon="['fas', 'download']" /> ttl</a>
          <a
            class="btn btn-outline-primary btn-rounded mr-2"
            :href="`${subject}?format=rdf`"
            target="_blank"
          ><fa :icon="['fas', 'download']" /> rdf+xml</a>
          <a
            class="btn btn-outline-primary btn-rounded mr-2"
            :href="`${subject}?format=jsonld`"
            target="_blank"
          ><fa :icon="['fas', 'download']" /> json-ld</a>
        </div>

        <ul
          v-if="itemLists && itemLists.length > 1"
          class="nav nav-tabs item-list-nav"
        >
          <li
            v-for="(itemList, index) in itemLists"
            :key="`item-menu-${index}`"
            class="nav-item"
          >
            <a
              class="nav-link"
              :class="{'active': activeItemList == itemList}"
              @click.prevent="setActiveItemList(itemList)"
            >
              {{ itemList.title }}
            </a>
          </li>
        </ul>
        <item-list
          v-if="activeItemList"
          :key="activeItemList.childUrlPrefix"
          :config="config"
          :child-spec="activeItemList.childSpec"
          :meta="meta"
          :child-url-prefix="activeItemList.childUrlPrefix"
          :entity-id="entityId"
          :title="activeItemList.title"
          :create-link="activeItemList.createLink"
          data-cy="item-list"
        />
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
import FairDataPoints from '@/components/FairDataPoints/index.vue'
import config from '@/config'

@Component({
  components: {
    FairDataPoints,
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

  activeItemList: any = null

  meta: any = null

  metadata: any = null

  groups: any = null

  viewIndex: any = null

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
    if (this.viewIndex) return 'FAIR Data Points'
    return this.isDraft ? `[DRAFT] ${this.entity.title}` : this.entity.title
  }

  get isRepository() {
    return this.config.isRepository
  }

  get isIndex() {
    return config.isIndex()
  }

  actionEnabled(action: string): boolean {
    return _.includes(this.config.viewActions, action)
  }

  actionUrl(action: string): string {
    const { path } = this.$route
    return _.endsWith('/', path) ? `${path}${action}` : `${path}/${action}`
  }

  setActiveItemList(itemList) {
    this.activeItemList = itemList
  }

  setViewIndex(value) {
    this.viewIndex = value
  }

  reset() {
    this.metadata = null
    this.itemLists = null
    this.activeItemList = null
    this.meta = null
    this.extraLinks = []
    this.createLink = null
    this.groups = null
  }

  async fetchData(): Promise<void> {
    try {
      this.viewIndex = this.isIndex && this.isRepository

      this.status.setPending()
      const [entity, spec, meta] = await this.loadData()

      this.buildGraph(entity.data)
      this.groups = parseSHACLView(spec.data, this.config.targetClasses)

      this.meta = meta.data
      this.metadata = this.createMetadata()
      this.extraLinks = this.config.getLinks(this.graph)
      this.breadcrumbs = this.config.createBreadcrumbs(this.meta.path, this.subject)

      if (this.config.hasChildren) {
        this.itemLists = this.config.createChildrenLists(this.canCreateChild, this.entityId)
        this.activeItemList = _.first(this.itemLists)
      }

      this.status.setDone()
    } catch (error) {
      this.status.setErrorFromResponse(error, 'Unable to get data.')
    }
  }

  async loadData() {
    return axios.all([
      this.config.api.get(this.entityId),
      this.config.api.getSpec(),
      this.config.api.getMeta(this.entityId),
    ])
  }

  createMetadata() {
    return [
      ...metadata.commonMetadata(this.graph),
      ...this.createLocalMetadata(),
    ]
  }

  createLocalMetadata() {
    return this.groups
      .map((group) => ({
        fields: group.fields
          .map((field) => metadata.fromShaclField(this.graph, field))
          .filter((field) => field !== null),
        label: group.label,
        comment: group.comment,
      }))
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
