import useSWR from 'swr'
import fetcher from './fetcher'
import { z } from "zod";
import Integration from '../pages/integrations/[id]';

const IntegrationSchema = z.object({
    id: z.number(),
    name: z.string(),
    category_id: z.number()
})


export default function useIntegration (id?: string) {
    const { data, error, isLoading, mutate} = useSWR(id ? `/api/integrations/${id}` : null, id ? fetcher : null)
    const result = IntegrationSchema.safeParse(data)

    return {
        integration: result.success ? result.data : null,
        isLoading,
        isError: error,
        mutate: mutate
    }
}