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
          v-if="isAdmin || permissions.hasWrite(catalog)"
          class="btn btn-link"
          :to="`/catalog/${catalog.identifier}/edit`"
        >
          <fa :icon="['fas', 'edit']" />
          Edit
        </router-link>
        <router-link
          v-if="isAdmin || permissions.hasWrite(catalog)"
          class="btn btn-link"
          :to="`/catalog/${catalog.identifier}/settings`"
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
import { mapGetters } from 'vuex'
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
import breadcrumbs from '../../utils/breadcrumbs'

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

        const response = await api.catalog.getCatalog(this.$route.params.id)
        this.catalog = response.data
        this.metadata = this.createMetadata(this.catalog)
        this.datasets = this.createDatasets(this.catalog)
        this.breadcrumbs = breadcrumbs.fromLinks(this.catalog.links)
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get catalog data.')
      }
    },

    createMetadata(catalog) {
      return [
        ...metadata.commonMetadata(catalog),
        metadata.fromField('Theme Taxonomies', catalog.themeTaxonomies),
        metadata.rdfLinks(),
      ]
    },

    createDatasets(catalog) {
      return catalog.datasets.map(dataset => ({
        title: dataset.title,
        link: `/dataset/${dataset.identifier}`,
        description: dataset.description,
        tags: dataset.themes,
        metadata: [
          metadata.fromField('Distributions:', dataset.distributionCount),
          metadata.fromField('Issued:', moment(dataset.issued).format('DD-MM-Y')),
          metadata.fromField('Modified:', moment(dataset.modified).format('DD-MM-Y')),
        ],
      }))
    },
  },
}
</script>
