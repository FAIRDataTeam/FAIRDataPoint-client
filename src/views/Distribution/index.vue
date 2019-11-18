<template>
  <div>
    <Breadcrumbs
      v-if="distribution !== null"
      :links="breadcrumbs"
      :current="distribution.title"
    />
    <StatusFlash :status="status" />
    <Page
      v-if="distribution !== null"
      :title="distribution.title"
    >
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
        <Metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ distribution.description }}
        </p>
      </template>
    </Page>
  </div>
</template>
<script>
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs'
import Metadata from '../../components/Metadata'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import Status from '../../utils/Status'
import metadata from '../../utils/metadata'

export default {
  name: 'Distribution',
  components: {
    StatusFlash,
    Breadcrumbs,
    Metadata,
    Page,
  },

  data() {
    return {
      distribution: null,
      metadata: null,
      breadcrumbs: null,
      status: new Status(),
    }
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

        const response = await api.getDistribution(this.$route.params.id)
        this.distribution = response.data
        this.metadata = this.createMetadata(this.distribution)
        this.breadcrumbs = this.createBreadcrumbs(this.distribution)
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get distribution data.')
      }
    },

    createMetadata(distribution) {
      return [
        ...metadata.commonMetadata(distribution),
        metadata.fromField('Media Type', distribution.mediaType),
        metadata.rdfLinks(distribution.uri),
      ]
    },

    createBreadcrumbs(distribution) {
      return [{
        label: distribution.links.repository.label,
        to: '/fdp',
      }, {
        label: distribution.links.catalog.label,
        to: `/fdp/catalog/${distribution.links.catalog.identifier}`,
      }, {
        label: distribution.links.dataset.label,
        to: `/fdp/dataset/${distribution.links.dataset.identifier}`,
      }]
    },
  },
}
</script>
