import Link from "next/link";

export default function AppHome() {
  
  return (
    <div className="p-10 pr-60">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 pb-5">
          Integrations Builder: <span className="font-normal">An API Mapping Tool</span>
        </h1>
      </div>

      <div className="px-10">

      
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
              <li>Your software needs to integrate with many API providers with relatively similar data in a variety of formats</li>
              <li>You want to build a product like <Link href="https://plaid.com">Plaid</Link>, <Link href="https://merge.dev">Merge.dev</Link>, or <Link href="https://tryfinch.com">Finch</Link>, that requires quickly adding new integrations in multiple categories</li>
              <li>You are a B2B SaaS and your customers are asking if you have <i>X</i> integration.  Do you build them one at a time from scratch?</li>
            </ul>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Quick Start Guide
          </h1>
          <div className="pt-5">
            Use the sidebar on left to step through the following workflow.  At the moment, this is a Proof of Concept (POC) that is under active development. 
            I'll keep the steps below updated to indicate what is currently available.  
          </div>

          <div className="p-5">
            <ol className="list-decimal">
              <li><b>Integrations:</b> Define an integration by name, category, and provide a base/root domain for their API </li>
              <li><b>Integrations {'>'} Endpoints:</b> Define specific endpoints, their path to be used in combination with the base domain, and the HTTP method. <br/><i>Note: we will only work with GET requests for the data sync use case in this POC.</i></li>
              <li><b>Models:</b> Create a Model with a real JSON payload.  We will parse and create a model, field, and data type representation of it to be used to map to an internal target model.</li>
              <li><b>Mapper:</b> <span className="text-red-600 italic">(Coming Soon)</span>  Here we will display the Model generated in the previous step.  
                  Based on the category this Model's integration is associated with, you can pick which target
                   model to map to. During this process, you will also be able to assign a data transformation to apply for example: Uppercase/Lowercase, DateTime conversions, etc.</li>
              <li><b>Test:</b> <span className="text-red-600 italic">(Coming Soon)</span> Validate your mappings and transformations with more sample JSON data from the integration</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
