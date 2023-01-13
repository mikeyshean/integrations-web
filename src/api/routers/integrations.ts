import { fetcher } from "./fetcher";
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ModelSchema } from "api/schema/models";

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

const IntegrationSchemaWithExtra = z.object({
  id: z.number(),
  name: z.string(),
  endpoint_count: z.number(),
  domains: z.object({id: z.number(), domain: z.string() }).array(),
  category: CategorySchema
})

const ListIntegrationsSchema = IntegrationSchemaWithExtra.array()

const EndpointSchema = z.object({
  id: z.number(),
  method: z.string(),
  path: z.string(),
  integration: BasicIntegrationSchema,
  model: z.object({id: z.string(), name: z.string()}).nullable()
})

const EndpointsSchema = EndpointSchema.array()


export const integationsRouter =  {
  useList: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/integrations')
      return ListIntegrationsSchema.parse(response)
    }
    return useQuery({ queryKey: ['integrations'], queryFn: queryFn })
  },
  
  useCreate: () => {
    const mutationFn = async (data: {name: string, category_id: number, domain: string}) => { 
      const response = await fetcher('/api/integrations', {method: "POST", data: data})
      return BasicIntegrationSchema.parse(response)
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

  useCreateEndpoint: () => {
    const mutationFn = async (data: {method: string, path: string, integrationId: number}) => { 
      const { integrationId, ...postData } = data
      const response = await fetcher(`/api/integrations/${data.integrationId}/endpoints`, {method: "POST", data: postData})
      return EndpointSchema.parse(response)
    }
    return useMutation({ mutationKey: ['integrations', 'endpoints'], mutationFn: mutationFn })
  },
  
  useGetIntegrationEndpoints:  ({id, ...args }: {id: number, [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher(`/api/integrations/${id}/endpoints`)
      return EndpointsSchema.parse(response)
    }
    return useQuery({ queryKey: ['integrations', id, 'endpoints'], queryFn: queryFn, ...args })
  },

  useListCategories: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/integration/categories')
      return CategoriesSchema.parse(response)
    }
    return useQuery({ queryKey: ['categories'], queryFn: queryFn })
  },

  useListEndpoints: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/endpoints')
      return EndpointsSchema.parse(response)
    }
    return useQuery({ queryKey: ['endpoints'], queryFn: queryFn })
  },

  useDelete: () => {
    const mutationFn = async (data: { id: number }) => { 
      const response = await fetcher(`/api/integrations/${data.id}`, { method: "DELETE" })
      return response
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },
 
  useDeleteEndpoint: () => {
    const mutationFn = async (data: { id: number }) => { 
      const response = await fetcher(`/api/endpoints/${data.id}`, { method: "DELETE" })
      return response
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

}


