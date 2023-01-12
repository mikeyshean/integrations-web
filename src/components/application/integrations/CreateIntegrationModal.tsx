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


export default function CreateIntegrationModal({ show, toggleModal }: { show: boolean, toggleModal: () => void}) {
  const { data: categories } = api.integrations.useListCategories()
  const apiCreateIntegration = api.integrations.useCreate()
  const [selected, setSelected] = useState<{id: number, name: string}>()
  const [nameValue, setNameValue] = useState('')
  const [domainValue, setDomainValue] = useState('')
  const [isNameValid, setIsNameValid] = useState(true)
  const [isUrlValid, setIsUrlValid] = useState(true)
  const [isUniqueError, setIsUniqueError] = useState(false)
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelected(categories[0])
    }
  },[categories])

  async function handleOnSubmit() {
    const categoryId = selected?.id
    let isValid = true
    if (!nameValue) {
      setIsNameValid(false)
      isValid = false
    }
    if (!domainValue || !isValidUrl(domainValue)) {
      setIsUrlValid(false)
      isValid = false
    }

    if (!isValid) {
      return
    }

    if (categoryId) {
      apiCreateIntegration.mutate({name: nameValue, category_id: categoryId, domain: domainValue}, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["integrations"]})
          setIsUniqueError(false)
          setIsNameValid(true)
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

  function validateIntegrationName(value: string) {
    if (!value) {
      setIsNameValid(false)
    }
    setIsNameValid(true)
    setNameValue(value)
  }

  function validateUrl(value: string) {
    if (!value) {
      setIsUrlValid(false)
    }
    if (isValidUrl(value)) {
      setIsUrlValid(true)
      setDomainValue(value)
    }
  }

  if (!categories || categories.length == 0 ) {
    return (
      <>
        Loading...
      </>
    )
  }
  
  return (
    <Modal cancelText='Cancel' submitText='Save' handleOnSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900 pb-5">Create Integration</h1>

      {/* Integration Name */}

      <div>
        <label htmlFor="integration-name" className="block text-sm font-medium text-gray-700">
          Integration Name
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="text"
            name="integration-name"
            id="integration-name"
            className={classNames(
              "block w-full rounded-md sm:text-sm", 
              isNameValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
            )}
            placeholder="MyIntegration"
            aria-invalid="true"
            aria-describedby="name-error"
            value={nameValue}
            onChange={(e) => validateIntegrationName(e.target.value)}
          />
          { (!isNameValid || isUniqueError) && 
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          }
        </div>
        {!isNameValid && 
          <p className="mt-2 text-sm text-red-600" id="name-error">
            Integration name is required.
          </p>
        }
        {isUniqueError && 
          <p className="mt-2 text-sm text-red-600" id="name-error">
            This integration already exists in this category. Try a different name.
          </p>
        }
      </div>
      
      {/* Category List Box */}

      <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium mt-5 text-gray-700">Category</Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="block truncate">{selected?.name}</span>
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
                {categories?.map((category) => (
                  <Listbox.Option
                    key={category.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={category}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {category.name}
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

      {/* Domain */}
     
      <div className='mt-5'>
        <label htmlFor="integration-domain" className="block text-sm font-medium text-gray-700">
          Domain (Base domain for API)
        </label>

        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            https://
          </span>
          
          <input
            type="text"
            name="api-domain"
            id="api-domain"
            className={classNames("block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
            isUrlValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
            )}
            placeholder="www.example.com/api"
            onChange={(e) => validateUrl(e.target.value)}
            aria-invalid="true"
            aria-describedby="domain-error"
          />
          { !isUrlValid && 
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          }
        </div>
        { !isUrlValid && 
          <p className="mt-2 text-sm text-red-600" id="domain-error">
            Enter a valid domain.
          </p>
        }
      </div>
    </Modal>
  )
}
