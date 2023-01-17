import { fetcher } from "./fetcher";
import { useQuery } from '@tanstack/react-query'
import { ModelsSchema, ModelSchema  } from "api/schema/models";

export const modelsRouter =  {
  useList: ({categoryId, ...args}: {categoryId?: number, [key: string]: any}) => {
    const queryFn = async () => { 
      try {
        let path = '/api/models'
        if (categoryId) {
          const data = { categoryId: String(categoryId) }
          path += "?" + new URLSearchParams(data)
        }
        const response = await fetcher(path)
        return ModelsSchema.parse(response)
      } catch (err) {
        throw new Error("List Models API Error")
      }
    }
    return useQuery({ queryKey: [ 'models?category', categoryId ], queryFn: queryFn, ...args })
  },

  useGetItem: ({id, ...args }: {id: number, [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher(`/api/models/${id}`)
      return ModelSchema.parse(response)
    }
    return useQuery({ queryKey: ['models', id], queryFn: queryFn, ...args })
  },
}


