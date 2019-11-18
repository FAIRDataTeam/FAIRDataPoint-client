<template>
  <div>
    <Breadcrumbs
      v-if="dataset !== null"
      :links="breadcrumbs"
      :current="dataset.title"
    />
    <StatusFlash :status="status" />
    <Page
      v-if="dataset !== null"
      :title="dataset.title"
    >
      <template v-slot:actions>
        <MembershipBadge :entity="dataset" />
        <router-link
          v-if="permissions.hasWrite(dataset)"
          class="btn btn-link"
          :to="`/fdp/dataset/${dataset.identifier}/settings`"
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
          {{ dataset.description }}
        </p>
        <ItemList
          title="Distributions"
          :items="distributions"
        />
      </template>
    </Page>
  </div>
</template>
<script>
import moment from 'moment'
import api from '../../api'
import permissions from '../../utils/permissions'
import Breadcrumbs from '../../components/Breadcrumbs'
import ItemList from '../../components/ItemList'
import Metadata from '../../components/Metadata'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import Status from '../../utils/Status'
import metadata from '../../utils/metadata'
import MembershipBadge from '../../components/MembershipBadge'

export default {
  name: 'Dataset',
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
      dataset: null,
      metadata: null,
      distributions: null,
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
    async fetchData() {
      try {
        this.status.setPending()

        const response = await api.getDataset(this.$route.params.id)
        this.dataset = response.data
        this.metadata = this.createMetadata(this.dataset)
        this.distributions = this.createDistributions(this.dataset)
        this.breadcrumbs = this.createBreadcrumbs(this.dataset)
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get dataset data.')
      }
    },

    createMetadata(dataset) {
      return [
        ...metadata.commonMetadata(dataset),
        metadata.fromField('Themes', dataset.themes),
        metadata.fromField('Keywords', dataset.keywords.map(label => ({ label }))),
        metadata.rdfLinks(dataset.uri),
      ]
    },

    createDistributions(dataset) {
      return dataset.distributions.map(distribution => ({
        title: distribution.title,
        link: `/fdp/distribution/${distribution.identifier}`,
        description: distribution.description,
        metadata: [
          metadata.fromField('Media Type:', distribution.mediaType),
          metadata.fromField('Issued:', moment(distribution.issued).format('DD-MM-Y')),
          metadata.fromField('Modified:', moment(distribution.modified).format('DD-MM-Y')),
        ],
      }))
    },

    createBreadcrumbs(dataset) {
      return [{
        label: dataset.links.repository.label,
        to: '/fdp',
      }, {
        label: dataset.links.catalog.label,
        to: `/fdp/catalog/${dataset.links.catalog.identifier}`,
      }]
    },
  },
}
</script>
