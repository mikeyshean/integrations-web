import useSWR from 'swr'
import fetcher from './fetcher'
import { z } from "zod";

const IntegrationSchema = z.object({
    id: z.number(),
    name: z.string(),
    category_id: z.number()
})

const IntegrationsSchema = z.array(IntegrationSchema)


export default function useIntegrations () {
    const { data, isLoading, error } = useSWR('/api/integrations', fetcher)
    const result = IntegrationsSchema.safeParse(data)


    return {
        integrations: result.success ? result.data : null,
        isLoading,
        isError: error,
    }
}