import { FormDefinition } from '@/shacl/FormDefinition'
import { SHACL } from '@/rdf/namespaces'

export class FormFieldDefinition extends FormDefinition {
  datatype: string | null

  nodeKind: string | null

  class: string | null

  editor: string | null

  fieldType: string

  nodeForm: FormDefinition | null

  isIRI(): boolean {
    return this.nodeKind === SHACL('IRI').value || !!this.class
  }

  isLiteral(): boolean {
    return this.nodeKind === SHACL('Literal').value
  }
}
