import * as $rdf from 'rdflib'
import { Shape, SHACLParser, Field } from '@/components/ShaclForm/Parser/SHACLParser'

export class ViewField extends Field<Shape<ViewField>> {
  viewer: string | null

  constructor(
    name: string,
    description: string | null,
    path: string,
    datatype: string,
    order: number | null,
    minCount: number | null,
    maxCount: number | null,
    nodeShape: Shape<ViewField> | null,
    group: string | null,
    viewer: string | null,
  ) {
    super(name, description, path, datatype, order, minCount, maxCount, nodeShape, group)
    this.viewer = viewer
  }
}

export class SHACLViewParser extends SHACLParser<ViewField, Shape<ViewField>> {
  protected createEmptyShape(): Shape<ViewField> {
    return new Shape<ViewField>([])
  }

  protected createShape(properties: ViewField[], shape: $rdf.ValueType): Shape<ViewField> {
    return new Shape<ViewField>(properties)
  }

  protected mergeShapes(shape1: Shape<ViewField>, shape2: Shape<ViewField>): Shape<ViewField> {
    return new Shape<ViewField>([
      ...shape1.fields,
      ...shape2.fields,
    ])
  }

  protected createField(
    name: string,
    description: string | null,
    path: string,
    datatype: string,
    order: number,
    minCount: number,
    maxCount: number,
    nodeShape: Shape<ViewField> | null,
    group: string | null,
    prop: $rdf.ValueType,
  ): ViewField[] {
    const viewer = this.getDashValue(prop, 'viewer')

    if (!viewer) {
      return []
    }

    return [new ViewField(
      name,
      description,
      path,
      datatype,
      order,
      minCount,
      maxCount,
      nodeShape,
      group,
      viewer,
    )]
  }
}

export function parseSHACLView(shacl: string, targetClasses: $rdf.ValueType[]): Shape<ViewField> {
  const parser = new SHACLViewParser(shacl)
  return parser.parse(targetClasses)
}
