import * as $rdf from 'rdflib'
import { FormDefinition } from '@/shacl/FormDefinition'
import { Field } from '@/components/ShaclForm/SHACLParser'

export class FormGroupDefinition extends FormDefinition {
  targetClasses: $rdf.Node[]

  fields: Field[]
}
