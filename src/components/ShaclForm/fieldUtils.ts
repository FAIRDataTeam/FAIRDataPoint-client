import _ from 'lodash'
import { SHACL, XSD } from '@/rdf/namespaces'
import rdfUtils from '@/rdf/utils'
import { FormField } from '@/components/ShaclForm/Parser/SHACLFormParser'

function getName(field: FormField): string {
  const pathToName = (path) => _.upperFirst(_.lowerCase(rdfUtils.pathTerm(path)))
  return field.name ? _.capitalize(field.name) : pathToName(field.path)
}

function isDatetime(field: FormField): boolean {
  // todo: rename to isDate(), consistent with the JS Date type
  const dateDataTypes = [
    XSD('dateTime').value,
    XSD('date').value,
  ]
  return dateDataTypes.includes(field.datatype)
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

function isBoolean(field: FormField): boolean {
  return field.datatype === XSD('boolean').value
}

function isInteger(field: FormField): boolean {
  const integerDataTypes = [
    XSD('integer').value,
    XSD('long').value,
    XSD('short').value,
  ]
  return integerDataTypes.includes(field.datatype)
}

function isDecimal(field: FormField): boolean {
  const decimalDataTypes = [
    XSD('decimal').value,
    XSD('double').value,
    XSD('float').value,
  ]
  return decimalDataTypes.includes(field.datatype)
}

export default {
  getName,
  isDatetime,
  isIRI,
  isList,
  isLiteral,
  isRequired,
  isBoolean,
  isInteger,
  isDecimal,
}
