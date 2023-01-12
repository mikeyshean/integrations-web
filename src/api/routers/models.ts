import { fetcher } from "./fetcher";
import { useQuery } from '@tanstack/react-query'
import { ModelsSchema  } from "api/schema/models";

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
  }
}


