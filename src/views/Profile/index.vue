<template>
  <div>
    <status-flash :status="status" />
    <page
      v-if="profile"
      :title="title"
    >
      <template v-slot:content>
        <prism-editor
          v-model="profile"
          language="turtle"
          :readonly="true"
        />
      </template>
      <template v-slot:column>
        <entity-metadata :metadata="metadata" />
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import * as $rdf from 'rdflib'
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrismEditor from 'vue-prism-editor'
import api from '@/api'
import EntityMetadata from '@/components/EntityMetadata/index.vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import { PROF, RDFS } from '@/rdf/namespaces'
import config from '@/config'
import rdfUtils from '@/rdf/utils'

@Component({
  components: {
    EntityMetadata, Page, PrismEditor, StatusFlash,
  },
})
export default class Profile extends Vue {
  profile: any = null

  title: string = null

  status: Status = new Status()

  metadata: any = null

  get profileId(): string {
    return this.$route.params.id
  }

  created(): void {
    this.init()
  }

  @Watch('$route')
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
  }
}
</script>
