import { useEffect, useState, Fragment, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { JSONEditor } from '../json-editor/JsonEditor'
import { Button } from '@/components/Button'
import { classNames } from '@/components/utils'


type SelectEndpoint = { id: number, path: string, method: string }
type SelectIntegration = { id: number, name: string }

export default function CreateModelTab() {
  const { data: integrations } = api.integrations.useList()
  const apiCreateModelFromJson = api.jsonMapper.useCreateModelFromJson()
  const queryClient = useQueryClient()
  const [selectedIntegration, setSelectedIntegration] = useState<SelectIntegration>({id: 0, name: ''})
  const [selectedEndpoint, setSelectedEndpoint] = useState<SelectEndpoint|null>(null)
  const { data: integrationEndpoints } = api.integrations.useGetIntegrationEndpoints({ id: selectedIntegration.id, enabled: !!selectedIntegration.id })
  const [modelName, setModelNameValue] = useState('')
  
  //  Form state
  const [isValidName, setIsValidName] = useState(true)
  const [isValidIntegration, setIsValidIntegration] = useState(true)
  const [isValidEndpoint, setIsValidEndpoint] = useState(true)
  const jsonRef = useRef<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidJson, setIsValidJson] = useState(true)

  const updateJsonRef = (json: string) => {
    jsonRef.current = json
  }
  
  const updateIsValidJson = (isValid: boolean) => {
    setIsValidJson(isValid)
  }

  async function handleCreate() {
    setIsLoading(true)
    const integrationId = selectedIntegration?.id
    let isValid = true
    let json = jsonRef.current
    
    if (!modelName) {
      setIsValidName(false)
      isValid = false
    }
    if (!json) {
      setIsValidJson(false)
      isValid = false
    }
    if (!integrationId) {
      setIsValidIntegration(false)
      isValid = false
    }
    if (!selectedEndpoint?.id) {
      setIsValidEndpoint(false)
      isValid = false
    }
    if (!isValid) {
      setIsLoading(false)
      return
    }

    try {
      json = JSON.parse(json)
      await apiCreateModelFromJson.mutateAsync({json: json, modelName: modelName, endpointId: selectedEndpoint!.id}, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['models']})
          setIsLoading(false)
        }
      })
    } catch (err) {
      if (err instanceof SyntaxError) {
        setIsValidJson(false)
      }
      setIsLoading(false)
    }

  }

  function handleOnChange(value: string) {
    if (!value) {
      setIsValidName(false)
    }
    setIsValidName(true)
    setModelNameValue(value)
  }

  function handleEndpointOnChange(endpoint: SelectEndpoint) {
    setSelectedEndpoint(endpoint)
    if (endpoint.id) {
      setIsValidEndpoint(true)
    }
  }
  
  function handleIntegrationOnChange(integration: SelectIntegration) {
    setSelectedIntegration(integration)
    if (integration.id) {
      setIsValidIntegration(true)
    }
  }
  
  // Reset endpoint Listbox to default selection
  useEffect(() => {
      setSelectedEndpoint(null)
  }, [selectedIntegration])

  if (!integrations || integrations.length == 0 ) {
    return (
      <>
        Loading...
      </>
    )
  }
  
  return (
    <div className="mt-5 md:col-span-2 md:mt-0">
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Create a Model from JSON</h1>
        <p className="mt-2 text-sm text-gray-700">
          Use a real example of the JSON Payload you expect to receive from an endpoint to automatically generate a Model.
        </p>
      </div>
      <div className="grid grid-cols-6 gap-6 overflow-auto pl-1">
        {/* Integration */}

        <Listbox value={selectedIntegration} onChange={handleIntegrationOnChange}>
          {({ open }) => (
            <>
              <div className="col-span-6 sm:col-span-3">
                <Listbox.Label className="block text-sm font-medium mt-5 text-gray-700">Integration</Listbox.Label>

                
                <div className="relative mt-1">
                <Listbox.Button className={classNames(
                    isValidIntegration ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
                    "relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left sm:text-sm"
                    )}>
                    <span className={classNames(
                      selectedIntegration?.name ? "" : "text-gray-400", 
                      isValidIntegration ? "" : "text-red-300",
                      "block truncate")}>{selectedIntegration?.name || "Select Integration"}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                 

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {integrations?.map((integration) => (
                        <Listbox.Option
                          key={integration.id}
                          className={({ active }) =>
                            classNames(
                              active ? 'text-white bg-indigo-600' : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                          }
                          value={integration}
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                {integration.name}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </div>
            </>
          )}
        </Listbox>

        <div className="col-span-6 sm:col-span-3">
          {/* Endpoint */}

          <Listbox value={selectedEndpoint} onChange={handleEndpointOnChange}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium mt-5 text-gray-700">API Endpoint</Listbox.Label>
                <div className="relative mt-1">
                  <Listbox.Button className={classNames(
                    isValidEndpoint ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
                    "relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left sm:text-sm"
                    )}>
                  <span className={classNames(
                      selectedEndpoint ? "" : "text-gray-400",
                      isValidEndpoint ? "" : "text-red-300",
                      "block truncate")}>{selectedEndpoint?.path || "Select Endpoint"}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {integrationEndpoints?.map((endpoint) => (
                        <Listbox.Option
                          key={endpoint.id}
                          className={({ active }) =>
                            classNames(
                              active ? 'text-white bg-indigo-600' : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                          }
                          value={endpoint}
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                {endpoint.path} - {endpoint.method}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>

        <div className="col-span-12 sm:col-span-6">
          <label htmlFor="model-name" className="block text-sm font-medium text-gray-700">
            Model Name
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="model-name"
              id="model-name"
              className={classNames(
                "block w-full rounded-md sm:text-sm", 
                isValidName ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
              )}
              placeholder="ex. Employee, Company, Ticket - The model returned from the API"
              aria-invalid="true"
              aria-describedby="name-error"
              value={modelName}
              onChange={(e) => handleOnChange(e.target.value)}
            />
            { !isValidName && 
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            }
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 relative">
          <div className='flex'>
            <label htmlFor="json-data" className="text-sm font-medium text-gray-700">
              JSON Payload 
            </label>
            <div className={classNames(
              isValidJson ? 'hidden' : '',
              'ml-10 relative'
              )}>
                <div className="pointer-events-none absolute -inset-x-5 flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <p className="text-sm text-red-600 pl-1" id="email-error">
                  Invalid JSON format
                </p>
            </div>

          </div>
          <div className='pt-2'>
            <JSONEditor updateJsonRef={updateJsonRef} updateIsValidJson={updateIsValidJson} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <div className="col-span-6 sm:col-span-3">
          <Button buttonText="Save Model" isLoading={isLoading} onClick={handleCreate} isDisabled={!isValidJson} />
        </div>
      </div>
    </div>
  )
}
