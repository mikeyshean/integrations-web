import { z } from 'zod'


export const ObjectModelSchema = z.object({
  id: z.number(),
  name: z.string()
})

export const FieldSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  list_item_type: z.string().nullable(),
  object_model: ObjectModelSchema.nullable()
}).transform((field) => {
  const { object_model: objectModel, list_item_type: listItemType, ...rest } = field

  return {
    ...rest,
    objectModel: objectModel,
    listItemType: listItemType
  }
})

export const FieldsSchema = FieldSchema.array()

export const ModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  fields: FieldsSchema
})

export const ModelsSchema = z.object({
  id: z.number(),
  name: z.string(),
  fields: FieldsSchema
}).array()

// Types

export type Field = z.infer<typeof FieldSchema>
export type Model = z.infer<typeof ModelSchema>