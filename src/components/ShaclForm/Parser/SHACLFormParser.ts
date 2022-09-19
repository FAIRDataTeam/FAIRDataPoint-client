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
  nodeKind: string | null

  class: string | null

  editor: string | null

  defaultValue: string | null

  minLength: number | null

  maxLength: number | null

  in : string[] | null

  constructor(
    name: string,
    description : string | null,
    path: string,
    datatype: string | null,
    order: number | null,
    minCount: number | null,
    maxCount: number | null,
    nodeShape: FormShape | null,
    nodeKind: string | null,
    clazz: string | null,
    editor: string | null,
    defaultValue: string | null,
    minLength: number | null,
    maxLength: number | null,
    in_: string[] | null,
  ) {
    super(name, description, path, datatype, order, minCount, maxCount, nodeShape)
    this.nodeKind = nodeKind
    this.class = clazz
    this.minCount = minCount
    this.maxCount = maxCount
    this.editor = editor
    this.defaultValue = defaultValue
    this.minLength = minLength
    this.maxLength = maxLength
    this.in = in_
  }
}

export class SHACLFormParser extends SHACLParser<FormField, FormShape> {
  protected createEmptyShape(): FormShape {
    return new FormShape()
  }

  protected createShape(properties: FormField[], shape: $rdf.ValueType): FormShape {
    const targetClasses = this.store
      .match(shape, SHACL('targetClass'), null, null)
      .map((s) => s.object)

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
    description: string,
    path: string,
    datatype: string,
    order: number,
    minCount: number,
    maxCount: number,
    nodeShape: FormShape | null,
    prop: $rdf.ValueType,
  ): FormField[] {
    const editor = this.getDashValue(prop, 'editor')

    if (!editor) {
      return []
    }

    return [new FormField(
      name,
      description,
      path,
      datatype,
      order,
      minCount,
      maxCount,
      nodeShape,
      this.getShaclValue(prop, 'nodeKind'),
      this.getShaclValue(prop, 'class'),
      editor,
      this.getShaclValue(prop, 'defaultValue'),
      this.parseIntNumber(this.getShaclValue(prop, 'minLength')),
      this.parseIntNumber(this.getShaclValue(prop, 'maxLength')),
      this.getShaclCollectionValues(prop, 'in'),
    )]
  }
}
