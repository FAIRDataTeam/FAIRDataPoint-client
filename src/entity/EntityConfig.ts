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

  public get isRepository() {
    return false
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

  get entitySpec() {
    return this.spec
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

  public createChildrenLists(canCreateChild = false, entityId = null) : any[] {
    return this.spec.children.map((child) => this.createChildrenListSpec(
      child,
      canCreateChild,
      entityId,
    ))
  }

  private createChildrenListSpec(
    child: ChildSpec,
    canCreateChild = false,
    entityId = null,
  ) {
    const childSpec = this.specs[child.resourceDefinitionUuid]

    return {
      title: child.listView.title,
      childUrlPrefix: childSpec.urlPrefix,
      childSpec: child,
      createLink: canCreateChild ? this.createChildUrl(child, entityId) : null,
    }
  }

  public createChildrenList(
    entity: EntitySpec,
    child: ChildSpec,
    graph: Graph,
    meta = null,
  ) {
    const typePredicate = $rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
    const typeNode = $rdf.namedNode(_.first(entity.targetClassUris))

    return graph.store.match(null, typePredicate, typeNode)
      .map((c) => {
        const id = rdfUtils.pathTerm(_.get(c.subject, 'value'))
        const options = { subject: c.subject }

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
        const prefix = stateChildren[c.subject.value] === 'DRAFT' ? '[DRAFT] ' : ''

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
  }

  // BREADCRUMBS --

  public createBreadcrumbsWithSelf(path, entityIri: string) {
    return this.buildBreadcrumbs(path, entityIri)
  }

  public createBreadcrumbs(path, entityIri: string) {
    return this.buildBreadcrumbs(path, _.get(path[entityIri], 'parent'))
  }

  buildBreadcrumbs(path, iri) {
    if (!iri) return []

    const pathItem = _.get(path, iri)
    const spec = _.get(this.specs, pathItem.resourceDefinitionUuid)

    const id = rdfUtils.pathTerm(iri)
    const url = this.createUrl(spec.urlPrefix, id)
    const item = breadcrumbs.createItem(pathItem.title, url)

    return this.buildBreadcrumbs(path, pathItem.parent).concat([item])
  }

  createUrl(urlPrefix, entityId) {
    if (urlPrefix === '') {
      return '/'
    }
    return `/${urlPrefix}/${entityId}`
  }
}
