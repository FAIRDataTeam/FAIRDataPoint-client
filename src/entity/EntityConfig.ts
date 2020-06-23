import * as $rdf from 'rdflib'
import _ from 'lodash'
import config from '@/config'
import api from '@/api'
import Graph from '@/rdf/Graph'
import permissions from '@/utils/permissions'
import rdfUtils from '@/rdf/utils'
import { DCT, FDPO } from '@/rdf/namespaces'
import metadata from '@/utils/metadata'
import breadcrumbs from '@/utils/breadcrumbs'

export type ChildSpec = {
  resourceDefinitionUuid: string,
  relationUri: string,
  listView: {
    title: string,
    tagsUri: string,
    metadata: {
      title: string,
      propertyUri: string,
    }[],
  },
}

export type EntitySpec = {
  uuid: string,
  name: string,
  urlPrefix: string,
  targetClassUris: string[],
  children: ChildSpec[],
  externalLinks: {
    title: string,
    propertyUri: string,
  }[],
}


export class EntityConfig {
  protected spec: EntitySpec

  protected specs: Record<string, EntitySpec>

  protected enityApi: any

  constructor(spec: EntitySpec, specs: Record<string, EntitySpec>) {
    this.spec = spec
    this.specs = specs
    this.enityApi = this.buildApi()
  }

  public get urlPrefix(): string {
    return this.spec.urlPrefix
  }

  public get uuid(): string {
    return this.spec.uuid
  }

  get children() {
    return this.spec.children
  }

  // API --

  protected buildApi(): any {
    return api.builder.build(this.spec.urlPrefix)
  }

  public get api() {
    return this.enityApi
  }

  // Navigation --

  public toUrl(enityId) {
    return this.createUrl(this.spec.urlPrefix, enityId)
  }

  // RDF --

  public subject(entityId) {
    return `${config.persistentURL()}/${this.spec.urlPrefix}/${entityId}`
  }

  public get targetClasses() {
    return this.spec.targetClassUris.map($rdf.namedNode)
  }

  // VIEW --

  public get viewActions() {
    return ['publish', 'edit', 'settings', 'delete']
  }

  public getLinks(graph: Graph) {
    if (this.spec.externalLinks === null) {
      return null
    }

    return this.spec.externalLinks.flatMap((link) => {
      const url = graph.findOne($rdf.namedNode(link.propertyUri))
      if (!url) return []

      const icon = link.propertyUri.indexOf('download') > -1
        ? ['fas', 'download']
        : ['fas', 'external-link-alt']

      return [{ label: link.title, icon, url }]
    })
  }

  public get hasChildren() {
    return this.spec.children.length > 0
  }

  public getChildUrlPrefix(child: ChildSpec) {
    return this.specs[child.resourceDefinitionUuid].urlPrefix
  }

  public canCreateChild(authenticated, entity) {
    return authenticated && permissions.hasCreate(entity)
  }

  public createChildUrl(child: ChildSpec, entityId: string) {
    return `/${this.spec.urlPrefix}/${entityId}/create-${this.getChildUrlPrefix(child)}`
  }

  public createChildrenLists(graph: Graph, meta = null, canCreateChild = false, entityId = null) {
    return this.spec.children.map(child => this.createChildrenList(
      child, graph, meta, canCreateChild, entityId,
    ))
  }

  public createChildrenList(
    child: ChildSpec,
    graph: Graph,
    meta = null,
    canCreateChild = false,
    entityId = null,
  ) {
    const children = graph.findAll($rdf.namedNode(child.relationUri), { value: false })
      .map((c) => {
        const id = rdfUtils.pathTerm(_.get(c, 'value'))
        const options = { subject: c }

        const tags = child.listView.tagsUri
          ? graph.findAll($rdf.namedNode(child.listView.tagsUri), options)
            .map(metadata.itemFromPath)
          : null

        const extraMetadata = child.listView.metadata
          ? child.listView.metadata.map((m) => {
            const value = graph.findOne($rdf.namedNode(m.propertyUri), options)
            return metadata.field(m.title, value)
          })
          : []

        const stateChildren = _.get(meta, 'state.children', {})
        const prefix = stateChildren[c.value] === 'DRAFT' ? '[DRAFT] ' : ''

        return {
          title: prefix + graph.findOne(DCT('title'), options),
          link: `/${this.getChildUrlPrefix(child)}/${id}`,
          description: graph.findOne(DCT('description'), options),
          tags,
          metadata: [
            metadata.dateField('Issued', graph.findOne(FDPO('metadataIssued'), options)),
            metadata.dateField('Modified', graph.findOne(FDPO('metadataModified'), options)),
          ].concat(extraMetadata),
        }
      })

    return {
      title: child.listView.title,
      items: children,
      createLink: canCreateChild ? this.createChildUrl(child, entityId) : null,
    }
  }

  // BREADCRUMBS --

  public createBreadcrumbsWithSelf(graph: Graph, entityId) {
    return [
      ...this.createBreadcrumbs(graph, entityId),
      breadcrumbs.createItem(
        graph.findOne(DCT('title')) as string,
        this.toUrl(entityId),
      ),
    ]
  }

  public createBreadcrumbs(graph: Graph, entityId: string) {
    const buildBreadcrumbs = (spec, subject) => {
      if (!spec) {
        return []
      }

      const parent = graph.findOne(DCT('isPartOf'), { value: false, subject })
      const title = graph.findOne(DCT('title'), { subject: parent }) as string
      const parentId = rdfUtils.pathTerm(_.get(parent, 'value'))
      const parentUrl = this.createUrl(spec.urlPrefix, parentId)
      const item = breadcrumbs.createItem(title, parentUrl)

      const parentSpec = this.getParentOf(spec.uuid)
      return buildBreadcrumbs(parentSpec, parent).concat([item])
    }

    return buildBreadcrumbs(
      this.getParentOf(this.spec.uuid),
      $rdf.namedNode(this.subject(entityId)),
    )
  }

  getParentOf(specUuid: string): EntitySpec {
    return Object.values<EntitySpec>(this.specs).reduce((parentSpec, spec) => {
      if (spec.children.some(child => child.resourceDefinitionUuid === specUuid)) {
        return spec
      }
      return parentSpec
    }, null)
  }

  createUrl(urlPrefix, entityId) {
    if (urlPrefix === '') {
      return '/'
    }
    return `/${urlPrefix}/${entityId}`
  }
}
