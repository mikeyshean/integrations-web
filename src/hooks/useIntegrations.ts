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
    const { data } = useSWR('/api/integrations', fetcher)
    console.log(`DATA ${data}`)
    const result = IntegrationsSchema.safeParse(data)

    if (result.success) {
        return result.data
    } else {
        console.log("Validation error")
    }
}