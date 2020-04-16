import * as $rdf from 'rdflib'
import { Field, SHACLParser, Shape } from '@/components/ShaclForm/Parser/SHACLParser'
import { SHACL } from '@/rdf/namespaces'


export class FormShape extends Shape<FormField> {
  targetClasses: $rdf.Node[]

  constructor(field: FormField[] = [], targetClasses: $rdf.Node[] = []) {
    super(field)
    this.targetClasses = targetClasses
  }
}


export class FormField extends Field<FormShape> {
  datatype: string | null

  nodeKind: string | null

  class: string | null

  minCount: number | null

  maxCount: number | null

  editor: string | null

  constructor(
    name: string,
    path: string,
    nodeShape: FormShape | null,
    datatype: string | null,
    nodeKind: string | null,
    clazz: string | null,
    minCount: number | null,
    maxCount: number | null,
    editor: string | null,
  ) {
    super(name, path, nodeShape)
    this.datatype = datatype
    this.nodeKind = nodeKind
    this.class = clazz
    this.minCount = minCount
    this.maxCount = maxCount
    this.editor = editor
  }
}


export class SHACLFormParser extends SHACLParser<FormField, FormShape> {
  protected createEmptyShape(): FormShape {
    return new FormShape()
  }

  protected createShape(properties: FormField[], shape: $rdf.ValueType): FormShape {
    const targetClasses = this.store
      .match(shape, SHACL('targetClass'), null, null)
      .map(s => s.object)

    return new FormShape(properties, targetClasses)
  }

  protected mergeShapes(shape1: FormShape, shape2: FormShape): FormShape {
    return new FormShape(
      [...shape1.fields, ...shape2.fields],
      [...shape1.targetClasses, ...shape2.targetClasses],
    )
  }

  protected createField(
    name: string,
    path: string,
    nodeShape: FormShape | null,
    prop: $rdf.ValueType,
  ): FormField[] {
    const editor = this.getDashValue(prop, 'editor')

    if (!editor) {
      return []
    }

    return [new FormField(
      name,
      path,
      nodeShape,
      this.getShaclValue(prop, 'datatype'),
      this.getShaclValue(prop, 'nodeKind'),
      this.getShaclValue(prop, 'class'),
      this.parseIntNumber(this.getShaclValue(prop, 'minCount')),
      this.parseIntNumber(this.getShaclValue(prop, 'maxCount')),
      editor,
    )]
  }
}
