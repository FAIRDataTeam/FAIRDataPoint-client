<template>
  <div>
    <Breadcrumbs
      v-if="catalog !== null"
      :links="breadcrumbs"
      :current="catalog.title"
    />
    <StatusFlash :status="status" />
    <Page
      v-if="catalog !== null"
      :title="catalog.title"
    >
      <template v-slot:actions>
        <MembershipBadge :entity="catalog" />
        <router-link
          v-if="permissions.hasWrite(catalog)"
          class="btn btn-link"
          :to="`/fdp/catalog/${catalog.identifier}/settings`"
        >
          <fa :icon="['fas', 'cog']" />
          Settings
        </router-link>
      </template>
      <template v-slot:column>
        <Metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ catalog.description }}
        </p>
        <ItemList
          title="Datasets"
          :items="datasets"
        />
      </template>
    </Page>
  </div>
</template>
<script>
import moment from 'moment'
import * as api from '../../api'
import * as permissions from '../../utils/permissions'
import Breadcrumbs from '../../components/Breadcrumbs'
import ItemList from '../../components/ItemList'
import Metadata from '../../components/Metadata'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import Status from '../../utils/Status'
import metadata from '../../utils/metadata'
import trim from '../../utils/trim'
import MembershipBadge from '../../components/MembershipBadge'

export default {
  name: 'Catalog',
  components: {
    MembershipBadge,
    StatusFlash,
    Breadcrumbs,
    ItemList,
    Metadata,
    Page,
  },

  data() {
    return {
      catalog: null,
      metadata: null,
      datasets: null,
      breadcrumbs: null,
      status: new Status(),
      permissions,
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

      api.getCatalog(this.$route.params.id)
        .then((response) => {
          this.catalog = response.data
          this.metadata = this.createMetadata(this.catalog)
          this.datasets = this.createDatasets(this.catalog)
          this.breadcrumbs = this.createBreadcrumbs(this.catalog)
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to get catalog data.'))
    },

    createMetadata(catalog) {
      return [
        ...metadata.commonMetadata(catalog),
        metadata.fromField('Theme Taxonomies', catalog.themeTaxonomies),
        metadata.rdfLinks(catalog.uri),
      ]
    },

    createDatasets(catalog) {
      return catalog.datasets.map(dataset => ({
        title: dataset.title,
        link: `/fdp/dataset/${dataset.identifier}`,
        description: trim(dataset.description),
        tags: dataset.themes,
        metadata: [
          metadata.fromField('Distributions:', dataset.distributionCount),
          metadata.fromField('Issued:', moment(dataset.issued).format('DD-MM-Y')),
          metadata.fromField('Modified:', moment(dataset.modified).format('DD-MM-Y')),
        ],
      }))
    },

    createBreadcrumbs(catalog) {
      return [{
        label: catalog.links.repository.label,
        to: '/fdp',
      }]
    },
  },
}
</script>
