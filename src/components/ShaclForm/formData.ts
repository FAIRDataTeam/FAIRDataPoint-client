import * as $rdf from 'rdflib'
import _ from 'lodash'
import { PREFIXES, RDF, XSD } from '@/rdf/namespaces'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import { FormShape } from '@/components/ShaclForm/Parser/SHACLFormParser'

export type FormData = {
  subject: $rdf.Node,
  data: Record<string, FormDataValue>
}

export type FormDataValue = FormData | $rdf.NamedNode | string

export function fromRdf(
  form: FormShape,
  subject: $rdf.Node,
  rdf: $rdf.IndexedFormula,
  defaults = false,
): FormData {
  const data = {}
  form.fields.forEach((field) => {
    const statements = rdf.match(subject, $rdf.namedNode(field.path), null, null)
    if (statements.length > 0) {
      data[field.path] = []
      statements.forEach((statement) => {
        if (field.nodeShape) {
          data[field.path].push(fromRdf(field.nodeShape, statement.object, rdf, defaults))
        } else if (fieldUtils.isIRI(field)) {
          try {
            data[field.path].push($rdf.namedNode(statement.object.value))
          } catch {
            // nothing to do
          }
        } else if (fieldUtils.isDatetime(field)) {
          try {
            data[field.path].push(new Date(statement.object.value))
          } catch {
            // nothing to do
          }
        } else {
          data[field.path].push(statement.object.value)
        }
      })
    } else if (defaults && field.defaultValue) {
      if (fieldUtils.isIRI(field)) {
        try {
          data[field.path] = [$rdf.namedNode(field.defaultValue)]
        } catch {
          // nothing to do
        }
      } else if (fieldUtils.isDatetime(field)) {
        try {
          data[field.path] = [new Date(field.defaultValue)]
        } catch {
          // nothing to do
        }
      } else {
        data[field.path] = [field.defaultValue]
      }
    } else if (defaults && field.nodeShape) {
      data[field.path] = [fromRdf(field.nodeShape, $rdf.blankNode(''), rdf, defaults)]
    }
  })
  return { subject, data }
}

function isFormData(value: object): value is FormData {
  return _.isObject(value) && _.get(value, 'data', false)
}

function createQuads(
  data: FormData,
  originalRdf: $rdf.IndexedFormula,
  shape: FormShape,
): $rdf.Statement[] {
  // Add RDF type statements only if they are not present in original RDF
  const targetClasses = _.get(data, 'targetClasses', [])
    .filter((tc) => originalRdf.statementsMatching(data.subject, RDF('type'), tc).length === 0)
    .map((tc) => $rdf.quad(data.subject, RDF('type'), tc, null))

  const findField = (key) => shape.fields.find((field) => field.path === key)

  const quads = Object.entries(data.data).flatMap(([key, values]) => {
    if (_.isArray(values)) {
      return values.flatMap((value) => {
        if (isFormData(value)) {
          const nestedQuads = createQuads(value, originalRdf, shape)

          if (nestedQuads.length > 0) {
            return [
              $rdf.quad(data.subject, $rdf.namedNode(key), _.get(value, 'subject'), null),
              ...nestedQuads,
            ]
          }

          return []
        }

        const extraQuads = []
        const field = findField(key)
        const isBoolean = field && field.datatype === XSD('boolean').value
        const hasBooleanValue = isBoolean && (value === true || value === false)
        const hasValue = !_.isEmpty(value) || _.isObject(value) || hasBooleanValue

        // If the field uses class, we need to add extra triple telling that the value of that
        // field is an instance of the field class
        if (field && field.class && hasValue) {
          extraQuads.push($rdf.quad(value, RDF('type'), $rdf.namedNode(field.class), null))
        }

        return hasValue
          ? [$rdf.quad(data.subject, $rdf.namedNode(key), value, null)].concat(extraQuads)
          : []
      })
    }
    return []
  })

  return targetClasses.concat(quads)
}

export function toRdf(
  rdf: $rdf.IndexedFormula,
  data: FormData,
  subjectStr: string,
  shape: FormShape,
): string {
  const store = $rdf.graph()
  store.addAll(rdf.statementsMatching(undefined, undefined, undefined))

  const clear = (subject, fields) => {
    fields.forEach((field) => {
      if (field.nodeShape) {
        store
          .statementsMatching(subject, $rdf.namedNode(field.path))
          .forEach((statement) => clear(statement.object, field.nodeShape.fields))
      }
      store.removeMany(subject, $rdf.namedNode(field.path))
    })
  }
  clear($rdf.namedNode(subjectStr), shape.fields)

  store.addAll(createQuads(data, rdf, shape))

  // @ts-ignore
  const serializer = $rdf.Serializer(rdf)
  serializer.setFlags('sir')

  Object.entries(PREFIXES).forEach(([prefix, url]) => {
    serializer.suggestPrefix(prefix, url)
  })

  // @ts-ignore
  const statements = store.statementsMatching(undefined, undefined, undefined)
  return serializer.statementsToN3(statements)
}
