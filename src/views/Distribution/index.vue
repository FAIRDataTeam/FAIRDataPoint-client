<template>
  <div>
    <breadcrumbs
      v-if="distribution !== null"
      :links="breadcrumbs"
      :current="distribution.title"
    />
    <status-flash :status="status" />
    <page
      v-if="distribution !== null"
      :title="distribution.title"
    >
      <template v-slot:actions>
        <membership-badge :entity="distribution" />
        <router-link
          v-if="isAdmin || permissions.hasWrite(distribution)"
          class="btn btn-link"
          :to="`/distribution/${distribution.identifier}/edit`"
          data-cy="edit"
        >
          <fa :icon="['fas', 'edit']" />
          Edit
        </router-link>
        <router-link
          v-if="isAdmin || permissions.hasWrite(distribution)"
          class="btn btn-link"
          :to="`/distribution/${distribution.identifier}/settings`"
          data-cy="settings"
        >
          <fa :icon="['fas', 'cog']" />
          Settings
        </router-link>
      </template>
      <template v-slot:column>
        <p class="distribution-links">
          <a
            v-if="distribution.downloadUrl"
            class="btn btn-primary btn-rounded mr-3 mb-3"
            :href="distribution.downloadUrl"
            target="_blank"
          >
            <fa :icon="['fa', 'download']" />
            Download
          </a>
          <a
            v-if="distribution.accessUrl"
            class="btn btn-primary btn-rounded mr-3 mb-3"
            :href="distribution.accessUrl"
            target="_blank"
          >
            <fa :icon="['fa', 'external-link-alt']" />
            Access Online
          </a>
        </p>
        <entity-metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ distribution.description }}
        </p>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { mapGetters } from 'vuex'
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import MembershipBadge from '../../components/MembershipBadge/index.vue'
import EntityMetadata from '../../components/EntityMetadata/index.vue'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'
import Status from '../../utils/Status'
import metadata from '../../utils/metadata'
import breadcrumbs from '../../utils/breadcrumbs'
import permissions from '../../utils/permissions'


export default {
  name: 'Distribution',
  components: {
    MembershipBadge,
    StatusFlash,
    Breadcrumbs,
    EntityMetadata,
    Page,
  },

  data() {
    return {
      distribution: null,
      metadata: null,
      breadcrumbs: null,
      status: new Status(),
      permissions,
    }
  },

  computed: {
    ...mapGetters('auth', {
      isAdmin: 'isAdmin',
    }),
  },

  watch: {
    $route: 'fetchData',
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        this.status.setPending()

        const response = await api.distribution.getDistribution(this.$route.params.id)
        this.distribution = response.data
        this.metadata = this.createMetadata(this.distribution)
        this.breadcrumbs = breadcrumbs.fromLinks(this.distribution.links)
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get distribution data.')
      }
    },

    createMetadata(distribution) {
      return [
        ...metadata.commonMetadata(distribution),
        metadata.fromField('Media Type', distribution.mediaType),
        metadata.rdfLinks(),
      ]
    },
  },
}
</script>
