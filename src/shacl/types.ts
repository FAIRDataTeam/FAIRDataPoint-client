type Opaque<K, T > = T & { __TYPE__: K }

export type Shacl = Opaque<'Shacl', string>

export type Turtle = Opaque<'Turtle', string>

export type FormBuilderFilter = (field: string) => boolean
