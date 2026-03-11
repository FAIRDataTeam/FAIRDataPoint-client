import _ from 'lodash'
import { DEFAULT_URI, SHACL } from '@/rdf/namespaces'
import Graph from '@/rdf/Graph'
import type { Quad_Subject as QuadSubject } from 'rdflib/lib/tf-types'

export type ValidationReport = Record<string, Record<string, any>>

function parseResult(result: string | QuadSubject, graph: Graph): ValidationReport {
  const resultPath = graph.findOne(
    SHACL('resultPath'),
    { subject: result },
  ) as string | undefined
  if (resultPath) {
    const focusNode = graph.findOne(
      SHACL('focusNode'),
      { subject: result },
    ) as string | undefined
    const sourceConstraintComponent = graph.findOne(SHACL('sourceConstraintComponent'), {
      subject: result,
    })
    if (!focusNode) {
      return {}
    }
    return { [focusNode]: { [resultPath]: sourceConstraintComponent } }
  }

  const detail = graph.findOne(SHACL('detail'), { subject: result, value: false })
  if (detail) {
    return parseResult(detail as QuadSubject, graph)
  }

  return {}
}

export function parseValidationReport(rdf: string): ValidationReport {
  const graph = new Graph(rdf, DEFAULT_URI)
  return graph
    .findAll(SHACL('result'), { subject: null, value: false })
    .reduce((acc, result) => _.merge(acc, parseResult(result as QuadSubject, graph)), {})
}
