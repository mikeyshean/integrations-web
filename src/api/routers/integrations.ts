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
  model: z.object({id: z.number(), name: z.string()}).nullable()
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
    const mutationFn = async (data: {name: string, categoryId: number, domain: string}) => { 
      const postData = { ...data, category_id: data.categoryId }
      const response = await fetcher('/api/integrations', {method: "POST", data: postData})
      return BasicIntegrationSchema.parse(response)
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

  useEdit: () => {
    const mutationFn = async (data: { id: number,  name: string, categoryId: number, domainId: number, domain: string}) => { 
      const putData = { ...data, category_id: data.categoryId, domain_id: data.domainId }
      const response = await fetcher(`/api/integrations/${data.id}`, { method: "PATCH", data: putData })
      return response
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

  useCreateEndpoint: () => {
    const mutationFn = async (data: {method: string, path: string, integrationId: number}) => { 
      const { integrationId, ...postData } = data
      const response = await fetcher(`/api/integrations/${integrationId}/endpoints`, {method: "POST", data: postData})
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
  
  useListEndpointModels: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/endpoints/models')
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
  
  useEditEndpoint: () => {
    const mutationFn = async (data: { id: number,  method: string, path: string, integrationId: number}) => { 
      const putData = { ...data, integration_id: data.integrationId}
      const response = await fetcher(`/api/endpoints/${data.id}`, { method: "PATCH", data: putData })
      return response
    }
    return useMutation({ mutationKey: ['integrations'], mutationFn: mutationFn })
  },

}


