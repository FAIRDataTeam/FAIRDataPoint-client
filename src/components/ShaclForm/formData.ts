import * as $rdf from 'rdflib'
import _ from 'lodash'
import { RDF } from '@/rdf/namespaces'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import { FormShape } from '@/components/ShaclForm/Parser/SHACLFormParser'

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
        if (field.nodeShape) {
          data[field.path].push(fromRdf(field.nodeShape, statement.object, rdf))
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


export function toRdf(rdf: $rdf.IndexedFormula, data: FormData, subject: string): string {
  const quads = createQuads(data)

  quads.forEach((quad) => {
    rdf.removeMany(quad.subject, quad.predicate)
  })

  rdf.addAll(createQuads(data))

  let result = ''

  // @ts-ignore
  $rdf.serialize(undefined, rdf, subject, 'text/turtle', (err, turtle) => {
    result = turtle as string
  })

  return result
}
