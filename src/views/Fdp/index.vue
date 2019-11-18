<template>
  <div>
    <StatusFlash :status="status" />
    <Page
      v-if="fdp !== null"
      class="mt-5"
    >
      <template v-slot:column>
        <Metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ fdp.description }}
        </p>
        <ItemList
          title="Catalogs"
          :items="catalogs"
        />
      </template>
    </Page>
  </div>
</template>
<script>
import moment from 'moment'
import api from '../../api'
import ItemList from '../../components/ItemList'
import Metadata from '../../components/Metadata'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import Status from '../../utils/Status'
import metadata from '../../utils/metadata'


export default {
  name: 'Fdp',
  components: {
    StatusFlash,
    ItemList,
    Metadata,
    Page,
  },

  data() {
    return {
      fdp: null,
      metadata: null,
      catalogs: null,
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

      api.getFdp()
        .then((response) => {
          this.fdp = response.data
          this.metadata = this.createMetadata(this.fdp)
          this.catalogs = this.createCatalogs(this.fdp)
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to get FDP data.'))
    },

    createMetadata(fdp) {
      return [
        ...metadata.commonMetadata(fdp),
        metadata.rdfLinks(fdp.uri),
      ]
    },

    createCatalogs(fdp) {
      return fdp.catalogs.map(catalog => ({
        title: catalog.title,
        link: `/fdp/catalog/${catalog.identifier}`,
        description: catalog.description,
        tags: catalog.themeTaxonomies,
        metadata: [
          metadata.fromField('Datasets:', catalog.distributionCount),
          metadata.fromField('Issued:', moment(catalog.issued).format('DD-MM-Y')),
          metadata.fromField('Modified:', moment(catalog.modified).format('DD-MM-Y')),
        ],
      }))
    },
  },
}
</script>
