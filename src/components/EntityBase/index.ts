import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'
import Status from '@/utils/Status'
import { EntityConfig } from '@/entity/EntityConfig'
import { BreadcrumbItem } from '@/utils/breadcrumbs'
import Graph from '@/rdf/Graph'
import { DCT } from '@/rdf/namespaces'


@Component({})
export default class EntityBase extends Vue {
  @Prop({ required: true })
  readonly config: EntityConfig

  breadcrumbs: BreadcrumbItem[] = null

  entity : { title: string, description: string} = null

  graph : Graph = null

  status: Status = new Status()

  get entityId(): string {
    return this.$route.params.id
  }

  get subject() {
    return this.config.subject(this.entityId)
  }

  get isAdmin(): boolean {
    return this.$store.getters['auth/isAdmin']
  }

  get isAuthenticated(): boolean {
    return this.$store.getters['auth/authenticated']
  }

  created(): void {
    this.init()
  }

  private resetBase() {
    this.status = new Status()
    this.breadcrumbs = null
    this.graph = null
    this.entity = null
  }

  @Watch('$route')
  async init(): Promise<void> {
    this.resetBase()
    this.reset()
    this.fetchData()
  }

  protected reset(): void {

  }

  protected async fetchData(): Promise<void> {
    return Promise.resolve()
  }

  buildGraph(data) {
    this.graph = new Graph(data, this.subject)
    this.createEntityData()
  }

  createEntityData() {
    this.entity = {
      title: this.graph.findOne(DCT('title')) as string,
      description: this.graph.findOne(DCT('description')) as string,
    }
  }
}
