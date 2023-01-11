import { useEffect, useState, Fragment, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Modal from '../Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { JSONEditor } from '../json-editor/JsonEditor'
import { Button } from '@/components/Button'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const apiListEndpoints = [
  { id: 1, name: "/employees - Get Employees"},
  { id: 2, name: "/addresses - Get Addresses"},
  { id: 3, name: "/departments - Get Departments"},
]

export default function CreateModelTab() {
  const { data: integrations } = api.integrations.useList()
  const [selectedIntegration, setSelectedIntegration] = useState<{id: number, name: string}>({id: 0, name: ''})
  const [selectedEndpoint, setSelectedEndpoint] = useState<{id: number, name: string}>(apiListEndpoints[0])
  const [modelName, setModelNameValue] = useState('')
  const [isNameValid, setIsNameValid] = useState(true)
  const jsonRef = useRef<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidJson, setIsValidJson] = useState(false)

  const updateJsonRef = (json: string) => {
    jsonRef.current = json
  }
  
  const updateIsValidJson = (isValid: boolean) => {
    setIsValidJson(isValid)
  }

  // async function handleOnSubmit() {
  //   const integrationId = selectedIntegration?.id
  //   if (!modelName) {
  //     setIsNameValid(false)
  //   }
  //   if (integrationId) {
  //     // await apiCreateIntegration.mutateAsync({name: nameValue, category_id: categoryId}, {
  //     //   onSuccess: () => {
  //     //     queryClient.invalidateQueries({ queryKey: ["integrations"]})
  //     //     toggleModal()
  //     //   }
  //     // })
  //     console.log("mutate")
  //   }
  // }

  function handleCreate() {
    const integrationId = selectedIntegration?.id
    if (!modelName) {
      setIsNameValid(false)
    }
    if (integrationId) {
      // await apiCreateIntegration.mutateAsync({name: nameValue, category_id: categoryId}, {
      //   onSuccess: () => {
      //     queryClient.invalidateQueries({ queryKey: ["integrations"]})
      //     toggleModal()
      //   }
      // })
      console.log("mutate")
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
    <>
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create a Model</h3>
            <p className="mt-1 text-sm text-gray-500">Define a new model by providing a sample of the JSON payload.  We&apos;ll parse the types and get it ready for the next step, <b>Mapping</b>.</p>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-6 gap-6 overflow-scroll">
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
                    placeholder="The model returned from the API (ex. Employee, Company, Ticket)"
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
                <label htmlFor="json-data" className="text-sm font-medium text-gray-700 pb-1">
                  JSON Payload 

                </label>
                <div className='inline-block float-right mr-16'>
                    <div className="pointer-events-none inline-block relative top-1">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500 align-center top-4 mr-1" aria-hidden="true" />
                    </div>
                    Invalid format
                </div>
                <JSONEditor updateJsonRef={updateJsonRef} updateIsValidJson={updateIsValidJson} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                
              </div>
              <div className="col-span-6 sm:col-span-3 pr-14">
                <Button buttonText="Create Model from JSON" isLoading={isLoading} onClick={handleCreate} isDisabled={!isValidJson} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
