import _ from 'lodash'
import { SHACL } from '@/rdf/namespaces'
import rdfUtils from '@/rdf/utils'
import { FormField } from '@/components/ShaclForm/Parser/SHACLFormParser'


function getName(field: FormField): string {
  const pathToName = path => _.upperFirst(_.lowerCase(rdfUtils.pathTerm(path)))
  return field.name ? _.capitalize(field.name) : pathToName(field.path)
}


function isIRI(field: FormField): boolean {
  return field.nodeKind === SHACL('IRI').value || !!field.class
}


function isList(field: FormField): boolean {
  return field.maxCount !== 1
}


function isLiteral(field: FormField): boolean {
  return field.nodeKind === SHACL('Literal').value
}


function isRequired(field: FormField): boolean {
  return field.minCount > 0
}


export default {
  getName,
  isIRI,
  isList,
  isLiteral,
  isRequired,
}
