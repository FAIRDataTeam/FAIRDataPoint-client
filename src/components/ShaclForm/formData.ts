import * as $rdf from 'rdflib'
import _ from 'lodash'
import { DCT, R3D, RDF } from '@/rdf/namespaces'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import { FormShape } from '@/components/ShaclForm/SHACLParser'

export type FormData = {
  subject: $rdf.Node,
  data: Record<string, FormDataValue>
}

export type FormDataValue = FormData | $rdf.NamedNode | string


export function fromRdf(form: FormShape, subject: $rdf.Node, rdf: $rdf.IndexedFormula): FormData {
  const data = {}
  form.fields.forEach((field) => {
    const statements = rdf.match(subject, $rdf.namedNode(field.path), null, null)
    if (statements.length > 0) {
      data[field.path] = []
      statements.forEach((statement) => {
        if (field.nodeForm) {
          data[field.path].push(fromRdf(field.nodeForm, statement.object, rdf))
        } else if (fieldUtils.isIRI(field)) {
          try {
            data[field.path].push($rdf.namedNode(statement.object.value))
          } catch {
            // nothing to do
          }
        } else {
          data[field.path].push(statement.object.value)
        }
      })
    }
  })
  return { subject, data }
}


function isFormData(value: object): value is FormData {
  return _.isObject(value) && _.get(value, 'data', false)
}


function createQuads(data: FormData): $rdf.Statement[] {
  const targetClasses = _.get(data, 'targetClasses', [])
    .map(tc => $rdf.quad(data.subject, RDF('type'), tc, null))

  const quads = Object.entries(data.data).flatMap(([key, values]) => {
    if (_.isArray(values)) {
      return values.flatMap((value) => {
        if (isFormData(value)) {
          const nestedQuads = createQuads(value)

          if (nestedQuads.length > 0) {
            return [
              $rdf.quad(data.subject, $rdf.namedNode(key), _.get(value, 'subject'), null),
              ...nestedQuads,
            ]
          }

          return []
        }

        return _.isEmpty(value) ? [] : [$rdf.quad(data.subject, $rdf.namedNode(key), value, null)]
      })
    }
    return []
  })

  return targetClasses.concat(quads)
}


export function toRdf(
  rdf: $rdf.IndexedFormula,
  data: FormData,
  subject: string,
  skippedFields: string[] = [],
): string {
  const graph = $rdf.graph()

  const subjectNode = $rdf.namedNode(subject)
  graph.addAll(rdf.match(subjectNode, null, null, null))

  Object.entries(data.data).forEach(([key, value]) => {
    graph.removeMany(subjectNode, $rdf.namedNode(key))
  })

  skippedFields.forEach((key) => {
    graph.removeMany(subjectNode, $rdf.namedNode(key))
  })

  graph.addAll(createQuads(data))
  let result = ''

  // @ts-ignore
  $rdf.serialize(null, graph, subject, 'text/turtle', (err, turtle) => {
    result = turtle as string
  })

  return result
}
