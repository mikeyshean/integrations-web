import { useEffect, useState, Fragment, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Modal from '../Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { JSONEditor } from '../json-editor/JsonEditor'
import { Button } from '@/components/Button'
import { classNames } from '@/components/utils'


const apiListEndpoints = [
  { id: 1, name: "/employees - Get Employees"},
  { id: 2, name: "/addresses - Get Addresses"},
  { id: 3, name: "/departments - Get Departments"},
]

export default function CreateModelTab() {
  const { data: integrations } = api.integrations.useList()
  const apiCreateModelFromJson = api.jsonMapper.useCreateModelFromJson()
  const queryClient = useQueryClient()
  const [selectedIntegration, setSelectedIntegration] = useState<{id: number, name: string}>({id: 0, name: ''})
  const [selectedEndpoint, setSelectedEndpoint] = useState<{id: number, name: string}>(apiListEndpoints[0])
  const [modelName, setModelNameValue] = useState('')
  const [isNameValid, setIsNameValid] = useState(true)
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
      setIsNameValid(false)
      isValid = false
    }
    if (!json) {
      setIsValidJson(false)
      isValid = false
    }
    if (!isValid) {
      setIsLoading(false)
      return
    }

    try {
      json = JSON.parse(json)
      await apiCreateModelFromJson.mutateAsync({json: json, model_name: modelName, integration_id: integrationId}, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['json-mapper/models']})
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
      setIsNameValid(false)
    }
    setIsNameValid(true)
    setModelNameValue(value)
  }

  useEffect(() => {
    if (integrations && integrations.length > 0) {
      setSelectedIntegration(integrations[0])
    }
  },[integrations])

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

        <Listbox value={selectedIntegration} onChange={setSelectedIntegration}>
          {({ open }) => (
            <>
              <div className="col-span-6 sm:col-span-3">
                <Listbox.Label className="block text-sm font-medium mt-5 text-gray-700">Integration</Listbox.Label>

                
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                    <span className="block truncate">{selectedIntegration?.name}</span>
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

          <Listbox value={selectedEndpoint} onChange={setSelectedEndpoint}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium mt-5 text-gray-700">API Endpoint</Listbox.Label>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                    <span className="block truncate">{selectedEndpoint?.name}</span>
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
                      {apiListEndpoints?.map((endpoint) => (
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
                                {endpoint.name}
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
                isNameValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
              )}
              placeholder="ex. Employee, Company, Ticket - The model returned from the API"
              aria-invalid="true"
              aria-describedby="name-error"
              value={modelName}
              onChange={(e) => handleOnChange(e.target.value)}
            />
            { !isNameValid && 
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            }
          </div>
          {!isNameValid && 
            <p className="mt-2 text-sm text-red-600" id="email-error">
              Model name is required.
            </p>
          }
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
