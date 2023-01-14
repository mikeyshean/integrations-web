import { useEffect, useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Modal from '../Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { classNames } from '@/components/utils'
import { ApiError } from 'api/errors'
import { API_ERROR } from '@/constants'


const Methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
] as const

type SelectedIntegration = {id: number, name: string}

export default function MutateEndpointModal(
  { show, toggleModal, isEditForm, id, integrationId, integrationName, path, method}: 
  {
     show: boolean, 
     toggleModal: () => void,
     isEditForm: boolean,
     id: number|null,
     integrationId: number|null,
     integrationName: string|null,
     path: string|null,
     method: string|null
  }) {
  const { data: integrations } = api.integrations.useList()
  const apiCreateEndpoint = api.integrations.useCreateEndpoint()
  const apiEditEndpoint = api.integrations.useEditEndpoint()
  const [selectedIntegration, setSelectedIntegration] = useState<SelectedIntegration>({id: 0, name: ''})
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [pathValue, setPathValue] = useState(path || "")
  const [isPathValid, setIsPathValid] = useState(true)
  const [isValidMethod, setIsValidMethod] = useState(true)
  const [isValidIntegration, setIsValidIntegration] = useState(true)
  const [isUniqueError, setIsUniqueError] = useState(false)
  const queryClient = useQueryClient()

  async function handleOnSubmit() {
    let isValid = true
    if (!pathValue) {
      setIsPathValid(false)
      isValid = false
    }
    if (!selectedIntegration?.id) {
      setIsValidIntegration(false)
      isValid = false
    }
    if (!selectedMethod) {
      setIsValidMethod(false)
      isValid = false
    }

    if (!isValid) return

    if (isEditForm && id) {
      apiEditEndpoint.mutate({id: id,  method: selectedMethod, path: pathValue, integrationId: selectedIntegration.id}, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["endpoints"] })
          resetValidations()
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
    } else {
      apiCreateEndpoint.mutate({method: selectedMethod, path: pathValue, integrationId: selectedIntegration.id}, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["endpoints"] })
          resetValidations()
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
  }

  function resetValidations() {
    setIsPathValid(true)
    setIsUniqueError(false)
    setIsValidIntegration(true)
    setIsValidMethod(true)
  }

  function handleIntegrationOnChange(selectedIntegration: SelectedIntegration) {
    setIsValidIntegration(true)
    setSelectedIntegration(selectedIntegration)
  }
  
  function handleMethodOnChange(method: string) {
    setIsValidMethod(true)
    setSelectedMethod(method)
  }

  // Adds "/" prefix to path
  function validatePath(value: string) {
    if (!value) {
      setIsPathValid(false)
    } else if (value[0] !== "/") {
      value = "/" + value
    }
    setIsPathValid(true)
    setPathValue(value)
  }

  useEffect(() => {
    if (!isEditForm) {
      setSelectedIntegration({id: 0, name: ''})
      setSelectedMethod('')
      setPathValue('')
    }
  },[show])

  useEffect(() => {
    if (integrationId 
        && integrationName
        && method
        && path
      ) {
      setSelectedIntegration({id: integrationId, name: integrationName})
      setSelectedMethod(method)
      setPathValue(path)
    }
  }, [integrationId, integrationName, method, path])

  
  return (
    <Modal cancelText='Cancel' submitText='Save' handleOnSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900 pb-5">{isEditForm ? "Edit" : "Create" } Endpoint</h1>

      {/* Select Integration */}
      <Listbox value={selectedIntegration} onChange={handleIntegrationOnChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">Integration</Listbox.Label>
          <div className="relative mt-1">
          <Listbox.Button className={classNames(
            isValidIntegration ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
            "relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left sm:text-sm"
            )}>
            <span className={classNames(
                selectedIntegration?.name ? "" : "text-gray-400", 
                isValidIntegration ? "" : "text-red-300",
                "block truncate")}>{selectedIntegration?.name || "Select Integration" }</span>
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

      <Listbox value={selectedMethod} onChange={handleMethodOnChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block mt-5 text-sm font-medium text-gray-700">HTTP Method</Listbox.Label>
          <div className="relative mt-1">
          <Listbox.Button className={classNames(
            isValidMethod ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
            "relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left sm:text-sm"
            )}>
              <span className={classNames(
                selectedMethod ? "" : "text-gray-400", 
                isValidMethod ? "" : "text-red-300",
                "block truncate")}>{selectedMethod || "Select HTTP Method"}</span>
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
                {Methods.map((method) => (
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
