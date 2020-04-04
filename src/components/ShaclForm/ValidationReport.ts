import _ from 'lodash'
import { DEFAULT_URI, SHACL } from '@/rdf/namespaces'
import Graph from '@/rdf/Graph'

export type ValidationReport = Record<string, Record<string, any>>


export function parseValidationReport(rdf: string) {
  const graph = new Graph(rdf, DEFAULT_URI)
  const report = {}
  const results = graph.findAll(SHACL('result'), { subject: null, value: false })
  results.forEach((result) => {
    const focusNode = graph.findOne(SHACL('focusNode'), { subject: result }) as string
    const resultPath = graph.findOne(SHACL('resultPath'), { subject: result }) as string
    const sourceConstraintComponent = graph.findOne(SHACL('sourceConstraintComponent'), { subject: result })

    if (!_.has(report, focusNode)) {
      report[focusNode] = {}
    }

    report[focusNode][resultPath] = sourceConstraintComponent
  })
  return report
}
