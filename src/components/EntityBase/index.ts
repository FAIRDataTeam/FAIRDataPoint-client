import { defineComponent, PropType } from 'vue'
import Status from '@/utils/Status'
import { EntityConfig } from '@/entity/EntityConfig'
import { BreadcrumbItem } from '@/utils/breadcrumbs'
import Graph from '@/rdf/Graph'
import { DCT } from '@/rdf/namespaces'

export default defineComponent({
  props: {
    config: { type: Object as PropType<EntityConfig>, required: true },
  },
  data() {
    return {
      breadcrumbs: null as BreadcrumbItem[] | null,
      entity: null as { title: string; description: string } | null,
      graph: null as Graph | null,
      status: new Status(),
    }
  },
  computed: {
    entityId(): string {
      const { id } = this.$route.params
      return Array.isArray(id) ? id[0] : id
    },
    subject() {
      return this.config.subject(this.entityId)
    },
    isAdmin(): boolean {
      return this.$store.getters['auth/isAdmin']
    },
    isAuthenticated(): boolean {
      return this.$store.getters['auth/authenticated']
    },
  },
  watch: {
    $route: 'init',
  },
  created(): void {
    this.init()
  },
  methods: {
    resetBase() {
      this.status = new Status()
      this.breadcrumbs = null
      this.graph = null
      this.entity = null
    },
    async init(): Promise<void> {
      this.resetBase()
      this.reset()
      this.fetchData()
    },
    reset(): void {},
    async fetchData(): Promise<void> {
      return Promise.resolve()
    },
    buildGraph(data: string) {
      this.graph = new Graph(data, this.subject)
      this.createEntityData()
    },
    createEntityData() {
      if (!this.graph) {
        return
      }
      this.entity = {
        title: this.graph.findOne(DCT('title')) as string,
        description: this.graph.findOne(DCT('description')) as string,
      }
    },
  },
})
