import { fetcher } from "./fetcher";
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'

const FieldSchema = z.object({
  id: z.number(),
  name: z.string()
})

const FieldsSchema = FieldSchema.array()

const ModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  fields: FieldsSchema
})

export const jsonMapperRouter =  {
  useCreateModelFromJson: () => {
    const mutationFn = async (data: {json: string, model_name: string, integration_id: number}) => { 
      try {
        const response = await fetcher('/api/mappers/json/model-from-payload/', {method: "POST", data: data})
        return ModelSchema.parse(response)
      } catch (err) {
        throw new Error("JSON Create Model API Error")
      }
    }
    return useMutation({ mutationKey: ['json-mapper/models'], mutationFn: mutationFn })
  },
}


