<template>
  <div>
    <status-flash :status="status" />
    <page
      v-if="profile"
      :title="title"
    >
      <template #content>
        <prism-editor
          v-model="profile"
          language="turtle"
          :readonly="true"
        />
      </template>
      <template #column>
        <entity-metadata :metadata="metadata" />
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as $rdf from 'rdflib'
import PrismEditor from '@/components/PrismEditor/index.vue'
import api from '@/api'
import EntityMetadata from '@/components/EntityMetadata/index.vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import { PROF, RDFS } from '@/rdf/namespaces'
import config from '@/config'
import rdfUtils from '@/rdf/utils'

export default defineComponent({
  components: {
    EntityMetadata, Page, PrismEditor, StatusFlash,
  },
  data() {
    return {
      profile: null,
      title: null,
      status: new Status(),
      metadata: null,
    }
  },
  computed: {
    profileId(): string {
      const { id } = this.$route.params
      return Array.isArray(id) ? id[0] : id
    },
  },
  watch: {
    $route: 'init',
  },
  created(): void {
    this.init()
  },
  methods: {
    async init(): Promise<void> {
      try {
        this.status.setPending()

        const profile = await api.profiles.getProfile(this.profileId)

        this.profile = profile.data

        const subject = `${config.persistentURL()}/profile/${this.profileId}`
        const graph = new Graph(profile.data, subject)
        this.title = graph.findOne(RDFS('label')) as string

        const resources = graph.findAll(PROF('hasResource'))
        const links = resources.map((r) => {
          const shapeUri = graph.findOne(PROF('hasArtifact'), { subject: $rdf.blankNode(r) }) as string
          const shapeName = graph.findOne(RDFS('label'), { subject: $rdf.blankNode(r) }) as string

          return {
            label: shapeName || rdfUtils.pathTerm(shapeUri),
            labelResolved: true,
            uri: shapeUri.replace(config.persistentURL(), config.clientURL),
          }
        })
        this.metadata = [{
          label: 'Shapes',
          items: links,
        }]

        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get profile.')
      }
    },
  },
})
</script>
