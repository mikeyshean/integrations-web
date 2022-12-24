import useIntegrations from '../hooks/useIntegrations'
import fetcher from '../hooks/fetcher'

export default function Home() {
  const integrations = useIntegrations()
  
  return (
    <div className="text-3xl font-bold underline">
      {
        integrations && integrations.map((integration) => {
          console.log(integration.id)
          return (
            <div key={integration.id}>
              <span className="text-red-400">{integration.name}</span>
            </div>
          )
        })
      }
    </div>
  )
}