import useIntegration from '../../hooks/useIntegration'
import useIntegrations from '../../hooks/useIntegrations'
import { useRouter } from "next/router";
import Link from 'next/link';
import { useEffect } from 'react';

export default function Integration() {
    const { query } = useRouter()
    const { id } = query
    const { integrations } = useIntegrations()
    const { integration, mutate} = useIntegration(id as string)

    if (!integration) {
        mutate(integrations?.find(x => x.id == parseInt(id as string, 10)))
    }
    
    return (
        <div className="text-3xl font-bold underline">
            { integration && integration.name } <br></br>
            <Link href="/">Back</Link>
        </div>
    )
}