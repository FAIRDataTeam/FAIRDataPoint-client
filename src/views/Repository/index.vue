<template>
  <div>
    <status-flash :status="status" />
    <page
      v-if="repository !== null"
      :title="repository.title"
    >
      <template v-slot:actions>
        <router-link
          v-if="isAdmin"
          class="btn btn-link"
          :to="`/edit`"
        >
          <fa :icon="['fas', 'edit']" />
          Edit
        </router-link>
      </template>
      <template v-slot:column>
        <entity-metadata :metadata="metadata" />
      </template>
      <template v-slot:content>
        <p class="description">
          {{ repository.description }}
        </p>
        <item-list
          title="Catalogs"
          :items="catalogs"
        />
      </template>
    </page>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import api from '../../api'
import ItemList from '../../components/ItemList'
import EntityMetadata from '../../components/EntityMetadata'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import Status from '../../utils/Status'
import metadata from '../../utils/metadata'


export default {
  name: 'Repository',
  components: {
    StatusFlash,
    ItemList,
    EntityMetadata,
    Page,
  },

  data() {
    return {
      repository: null,
      metadata: null,
      catalogs: null,
      status: new Status(),
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

        const response = await api.repository.getRepository()
        this.repository = response.data
        this.metadata = this.createMetadata(this.repository)
        this.catalogs = this.createCatalogs(this.repository)
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get repository data.')
      }
    },

    createMetadata(repository) {
      return [
        ...metadata.commonMetadata(repository),
        metadata.rdfLinks(),
      ]
    },

    createCatalogs(repository) {
      return repository.catalogs.map(catalog => ({
        title: catalog.title,
        link: `/catalog/${catalog.identifier}`,
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
