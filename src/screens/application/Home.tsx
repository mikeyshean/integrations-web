import Link from "next/link";

export default function AppHome() {
  
  return (
    <div className="py-10 px-5 lg:px-80 2xl:px-96">
      <div className="min-w-64">
      <h1 className="text-2xl font-semibold text-gray-900 pb-5">
        Integrations Builder: <span className="font-normal">An API Mapping Tool</span>
      </h1>

    
      <div className="mt-5">
        <h1 className="text-xl font-semibold text-gray-900">
          What is it?
        </h1>

        <div className="p-5">
          <ul className="list-disc">
            <li>A <i>no-code</i> tool for building REST API integrations</li>
            <li>Pulls data from external APIs and merges it into a common data model</li>
            <li>Provides a UI to define the necessary resources:
              <ul className="ml-5 list-disc">
                <li>Integrations</li>
                <li>API Endpoints</li>
                <li>Expected data model</li>
                <li>Mappings between the source model to an internal target data model</li>
                <li>Transformations to apply during mapping</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h1 className="text-xl font-semibold text-gray-900">
          Use Cases
        </h1>

        <div className="p-5">
          <ul className="list-disc">
            <li>Your software needs to integrate with APIs that all provide relatively similar data, but in a variety of formats</li>
            <li>You want to build a product like <Link href="https://plaid.com" className="underline">Plaid</Link>, <Link className="underline" href="https://merge.dev">Merge.dev</Link>, or <Link className="underline" href="https://tryfinch.com">Finch</Link>, that 
            requires the ability to quickly add new integrations across several categories</li>
            <li>You are a B2B SaaS and your customers are asking if you have <i>X</i> integration.  Do you build them one at a time from scratch?</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h1 className="text-xl font-semibold text-gray-900">
          Quick Start Guide
        </h1>
        <div className="pt-5">
          Use the sidebar on the left to step through the following workflow.  At the moment, this is a Proof of Concept (POC) that is under development. 
          The steps below will be updated to indicate what is currently available.  
        </div>

        <div className="p-5">
          <ol className="list-decimal">
            <li><b>Integrations:</b> Define an integration with a name, category, and a base/root domain for the API </li>
            <li><b>Endpoints:</b> Define specific API endpoints by their resource path and HTTP method. <br/><i>Note: For the scope of this POC, we will only consider the GET requests use case for data syncing.</i></li>
            <li><b>Models:</b> Generate a Model from a sample JSON payload.  This will parse and define the Model&apos;s fields and data types to be used during mapping to the target model.</li>
            <li><b>Mapper:</b> <span className="text-red-600 italic">(Coming Soon)</span>  Here we will display the generated Model in the previous step.  
                Based on the category that this Model&apos;s integration is associated with, you can pick which target
                  model to map to. During this process, you will also be able to assign a data transformation to apply to each field if necessary, for example: Uppercase/Lowercase, DateTime conversions, etc.</li>
            <li><b>Test:</b> <span className="text-red-600 italic">(Coming Soon)</span> Validate your mappings and transformations with more sample JSON data from the integration API</li>
          </ol>
        </div>
      </div>
    </div>
    </div>
  )
}
