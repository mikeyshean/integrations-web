import { fetcher } from "./fetcher";
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'

const CategorySchema = z.object({
  id: z.number(),
  name: z.string()
})

const CategoriesSchema = CategorySchema.array()

const IntegrationSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: CategorySchema
})

const IntegrationsSchema = IntegrationSchema.array()

export const integationsRouter =  {
  list: () => {
    const queryFn = async () => { 
      try {
        const response = await fetcher('/api/integrations')
        return IntegrationsSchema.parse(response)
      } catch (err) {
        throw new Error("Integrations List API Error")
      }
    }
    return useQuery({ queryKey: ['integrations'], queryFn: queryFn })
  },
  
  create: () => {
    const mutationFn = async (data: {name: string, category_id: number}) => { 
      try {
        const response = await fetcher('/api/integrations', {method: "POST", data: data})
        return IntegrationSchema.parse(response)
      } catch (err) {
        console.log(err)
        throw new Error("Integrations Create API Error")
      }
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

  listCategories: () => {
    const queryFn = async () => { 
      try {
        const response = await fetcher('/api/integration-categories')
        return CategoriesSchema.parse(response)
      } catch (err) {
        throw new Error("Integrations Create API Error")
      }
    }
    return useQuery({ queryKey: ['categories'], queryFn: queryFn })
  },

}


