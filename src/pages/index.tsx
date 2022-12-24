import useIntegrations from '../hooks/useIntegrations'
import Link from 'next/link'

export default function Home() {
  const { integrations } = useIntegrations()
  
  return (
    <div className="text-3xl font-bold underline">
      {
        integrations && integrations.map((integration) => {
          return (
            <div key={`integration-${integration.id}`}>
              <Link href={`/integrations/${integration.id}`}>
                  <span className="text-red-400">{integration.name}</span>
              </Link>
            </div>
          )
        })
      }
    </div>
  )
}