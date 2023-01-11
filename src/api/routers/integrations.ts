import { fetcher } from "./fetcher";
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'

const CategorySchema = z.object({
  id: z.number(),
  name: z.string()
})

const IntegrationSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: CategorySchema
}).array()

export const integationsRouter =  {
  list: () => {
    const queryFn = async () => { 
      try {
        const response = await fetcher('/api/integrations')
        return IntegrationSchema.parse(response)
      } catch (err) {
        throw new Error("Integrations List API Error")
      }
    }
    return useQuery({ queryKey: ['integrations'], queryFn: queryFn })
  },
  
  create: (data: {name: string, categoryId: number}) => {
    const queryFn = async () => { 
      try {
        const response = await fetcher('/api/integrations', {method: "POST", data: data})
        return IntegrationSchema.parse(response)
      } catch (err) {
        throw new Error("Integrations Create API Error")
      }
    }
    return useQuery({ queryKey: ['integrations'], queryFn: queryFn })
  }
}


