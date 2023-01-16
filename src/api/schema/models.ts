import { z } from 'zod'

export const FieldSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string()
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