import { fetcher } from "./fetcher";
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'

const CategorySchema = z.object({
  id: z.number(),
  name: z.string()
})

const CategoriesSchema = CategorySchema.array()

const BasicIntegrationSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: CategorySchema
})

const IntegrationSchema = z.object({
  id: z.number(),
  name: z.string(),
  endpoint_count: z.number(),
  category: CategorySchema
})

const IntegrationsSchema = IntegrationSchema.array()

export const integationsRouter =  {
  useList: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/integrations')
      return IntegrationsSchema.parse(response)
    }
    return useQuery({ queryKey: ['integrations'], queryFn: queryFn })
  },
  
  useCreate: () => {
    const mutationFn = async (data: {name: string, category_id: number}) => { 
      const response = await fetcher('/api/integrations', {method: "POST", data: data})
      return BasicIntegrationSchema.parse(response)
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

  useListCategories: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/integration-categories')
      return CategoriesSchema.parse(response)
    }
    return useQuery({ queryKey: ['categories'], queryFn: queryFn })
  },

  useDelete: () => {
    const mutationFn = async (data: { id: number }) => { 
      const response = await fetcher(`/api/integrations/${data.id}`, { method: "DELETE" })
      return response
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

}


