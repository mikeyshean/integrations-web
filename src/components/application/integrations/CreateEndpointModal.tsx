import { useEffect, useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Modal from '../Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { classNames, isValidUrl } from '@/components/utils'
import { ApiError } from 'api/errors'
import { API_ERROR } from '@/constants'


const METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
]

export default function CreateEndpointModal({ show, toggleModal }: { show: boolean, toggleModal: () => void}) {
  const { data: integrations } = api.integrations.useList()
  const apiCreateEndpoint = api.integrations.useCreateEndpoint()
  const [selectedIntegration, setSelectedIntegration] = useState<{id: number, name: string}>({id: 0, name: ''})
  const [selectedMethod, setSelectedMethod] = useState<string>(METHODS[0])
  const [isUniqueError, setIsUniqueError] = useState(false)
  const [pathValue, setPathValue] = useState('')
  const [isPathValid, setIsPathValid] = useState(true)
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (integrations && integrations.length > 0) {
      setSelectedIntegration(integrations[0])
    }
  },[integrations])

  async function handleOnSubmit() {
    
    if (!pathValue) {
      setIsPathValid(false)
      return
    }

    if (!selectedIntegration?.id) {
      return
    }

    apiCreateEndpoint.mutate({method: selectedMethod, path: pathValue, integrationId: selectedIntegration.id}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["endpoints"]})
        setIsPathValid(true)
        setIsUniqueError(false)
        toggleModal()
      },
      onError(error) {
        if (error instanceof ApiError) {
          if (error.errorCode == API_ERROR.UNIQUE_OR_REQUIRED_FIELD) {
            setIsUniqueError(true)
          }
        }
      },
    })
  }

  function validatePath(value: string) {
    if (!value) {
      setIsPathValid(false)
    } else if (value[0] !== "/") {
      value = "/" + value
    }
    setIsPathValid(true)
    setPathValue(value)
  }

  if (!integrations || integrations.length == 0 ) {
    return (
      <>
        Loading...
      </>
    )
  }
  
  return (
    <Modal cancelText='Cancel' submitText='Save' handleOnSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900 pb-5">Create Endpoint</h1>

      {/* Select Integration */}
      <Listbox value={selectedIntegration} onChange={setSelectedIntegration}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">Integration</Listbox.Label>
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
        </>
      )}
      </Listbox>
      
      {/* Path */}

      <div>
        <label htmlFor="endpoint-path" className="block mt-5 text-sm font-medium text-gray-700">
          Path
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="text"
            name="endpoint-path"
            id="endpoint-path"
            className={classNames(
              "block w-full rounded-md sm:text-sm", 
              isPathValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
            )}
            placeholder="/employees"
            aria-invalid="true"
            aria-describedby="path-error"
            value={pathValue}
            onChange={(e) => validatePath(e.target.value)}
          />
          {!isPathValid  && 
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          }
        </div>
        {!isPathValid && 
          <p className="mt-2 text-sm text-red-600" id="path-error">
            Path is required.
          </p>
        }
      </div>

      {/* HTTP Method */}

      <Listbox value={selectedMethod} onChange={setSelectedMethod}>
      {({ open }) => (
        <>
          <Listbox.Label className="block mt-5 text-sm font-medium text-gray-700">HTTP Method</Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="block truncate">{selectedMethod}</span>
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
                {METHODS.map((method) => (
                  <Listbox.Option
                    key={method}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={method}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {method}
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
      {isUniqueError && 
        <p className="mt-5 text-sm text-red-600" id="path-error">
          Integration, Path, and HTTP Method must be a unique combination.
        </p>
      }
    </Modal>
  )
}
