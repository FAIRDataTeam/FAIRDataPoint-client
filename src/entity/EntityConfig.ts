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

export type EntitySpecLink = {
  label: string,
  relation: string,
  icon: string[],
}

export type EntitySpec = {
  name: string,
  targetClasses: string[],
  children: {
    title: string,
    name: string,
    relation: string,
    tags: string,
    metadata: {
      label: string,
      property: string,
    }[],
  },
  hierarchy: string [],
  links: EntitySpecLink[] | null
}


export class EntityConfig {
  protected spec: EntitySpec

  protected enityApi: any

  constructor(spec: EntitySpec) {
    this.spec = spec
    this.enityApi = this.buildApi()
  }

  public get name(): string {
    return this.spec.name
  }

  public get parentEntity(): string {
    return _.last(this.spec.hierarchy)
  }

  // API --

  protected buildApi(): any {
    return api.builder.build(this.spec.name)
  }

  public get api() {
    return this.enityApi
  }

  // Navigation --

  public toUrl(enityId) {
    return this.createUrl(this.spec.name, enityId)
  }

  // Memberships --

  public get entityType() {
    return this.spec.name.toUpperCase()
  }

  // RDF --

  public subject(entityId) {
    return `${config.persistentURL()}/${this.spec.name}/${entityId}`
  }

  public get targetClasses() {
    return this.spec.targetClasses.map($rdf.namedNode)
  }

  // VIEW --

  public get viewActions() {
    return ['edit', 'settings', 'delete']
  }

  public getLinks(graph: Graph) {
    if (this.spec.links === null) {
      return null
    }

    return this.spec.links.flatMap((link) => {
      const url = graph.findOne($rdf.namedNode(link.relation))
      if (!url) return []

      return [{
        label: link.label,
        icon: link.icon,
        url,
      }]
    })
  }

  public get hasChildren() {
    return this.spec.children !== null
  }

  public canCreateChild(authenticated, entity) {
    return authenticated && permissions.hasCreate(entity)
  }

  public createChildUrl(entityId) {
    return `/${this.spec.name}/${entityId}/create-${this.spec.children.name}`
  }

  public createChildrenList(graph: Graph) {
    const children = graph.findAll($rdf.namedNode(this.spec.children.relation), { value: false })
      .map((child) => {
        const id = rdfUtils.pathTerm(_.get(child, 'value'))
        const options = { subject: child }

        const tags = this.spec.children.tags
          ? graph.findAll($rdf.namedNode(this.spec.children.tags), options)
            .map(metadata.itemFromPath)
          : null

        const extraMetadata = this.spec.children.metadata
          ? this.spec.children.metadata.map((m) => {
            const value = graph.findOne($rdf.namedNode(m.property), options)
            return metadata.field(m.label, value)
          })
          : []

        return {
          title: graph.findOne(DCT('title'), options),
          link: `/${this.spec.children.name}/${id}`,
          description: graph.findOne(DCT('description'), options),
          tags,
          metadata: [
            metadata.dateField('Issued', graph.findOne(FDPO('metadataIssued'), options)),
            metadata.dateField('Modified', graph.findOne(FDPO('metadataModified'), options)),
          ].concat(extraMetadata),
        }
      })

    return {
      title: this.spec.children.title,
      items: children,
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

  public createBreadcrumbs(graph: Graph, entityId) {
    const buildBreadcrumbs = (list, subject) => {
      if (list.length === 0) {
        return []
      }

      const entityType = list.pop()
      const parent = graph.findOne(DCT('isPartOf'), { value: false, subject })
      const title = graph.findOne(DCT('title'), { subject: parent }) as string
      const parentId = rdfUtils.pathTerm(_.get(parent, 'value'))
      const parentUrl = this.createUrl(entityType, parentId)
      const item = breadcrumbs.createItem(title, parentUrl)

      return buildBreadcrumbs(list, parent).concat([item])
    }

    return buildBreadcrumbs(
      this.spec.hierarchy.slice(),
      $rdf.namedNode(this.subject(entityId)),
    )
  }

  createUrl(entityType, entityId) {
    if (entityType === 'repository') {
      return '/'
    }
    return `/${entityType}/${entityId}`
  }
}
