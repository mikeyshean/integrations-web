import { z } from 'zod'

export const FieldSchema = z.object({
  id: z.number(),
  name: z.string()
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