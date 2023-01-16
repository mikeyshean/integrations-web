import { fetcher } from "./fetcher";
import { useQuery } from '@tanstack/react-query'
import { ModelsSchema, ModelSchema  } from "api/schema/models";

export const modelsRouter =  {
  useList: () => {
    const queryFn = async () => { 
      try {
        const response = await fetcher('/api/models')
        return ModelsSchema.parse(response)
      } catch (err) {
        throw new Error("List Models API Error")
      }
    }
    return useQuery({ queryKey: ['models'], queryFn: queryFn })
  },

  useGetItem: ({id, ...args }: {id: number, [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher(`/api/models/${id}`)
      return ModelSchema.parse(response)
    }
    return useQuery({ queryKey: ['models', id], queryFn: queryFn, ...args })
  },

}


