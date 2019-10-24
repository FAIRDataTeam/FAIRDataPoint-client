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
        <Metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ distribution.description }}
        </p>
        <p class="distribution-links">
          <a
            v-if="distribution.downloadUrl"
            class="btn btn--with-icon btn--rounded"
            :href="distribution.downloadUrl"
          >
            <fa :icon="['fa', 'download']" />
            Download
          </a>
          <a
            v-if="distribution.accessUrl"
            class="btn btn--with-icon btn--rounded"
            :href="distribution.accessUrl"
          >
            <fa :icon="['fa', 'external-link-alt']" />
            Access Online
          </a>
        </p>
      </template>
    </Page>
  </div>
</template>
<script>
import * as api from '../api'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Metadata from '../components/Metadata.vue'
import Page from '../components/Page.vue'
import StatusFlash from '../components/StatusFlash.vue'
import Status from '../utils/Status'
import metadata from '../utils/metadata'

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
    fetchData() {
      this.status.setPending()

      api.getDistribution(this.$route.params.id)
        .then((response) => {
          this.distribution = response.data
          this.metadata = this.createMetadata(this.distribution)
          this.breadcrumbs = this.createBreadcrumbs(this.distribution)
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to get distribution data.'))
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
<style scoped lang="scss">
@import "../scss/variables";

.distribution-links {
  margin-top: $space-lg;

  .btn {
    margin-right: $space-md;
  }
}
</style>
