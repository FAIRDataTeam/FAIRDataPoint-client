import _ from 'lodash'
import rdfUtils from '@/rdf/utils'

export abstract class FormDefinition {
  name: string

  path: string

  minCount: number | null

  maxCount: number | null

  getName(): string {
    const pathToName = path => _.upperFirst(_.lowerCase(rdfUtils.pathTerm(this.path)))
    return this.name ? _.capitalize(this.name) : pathToName(this.path)
  }

  isList(): boolean {
    return this.maxCount !== 1
  }

  isRequired(): boolean {
    return this.minCount > 1
  }
}
