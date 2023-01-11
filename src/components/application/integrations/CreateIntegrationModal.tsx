import { useEffect, useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Modal from '../Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CreateIntegrationModal({ show, toggleModal }: { show: boolean, toggleModal: () => void}) {
  const { data: categories } = api.integrations.useListCategories()
  const apiCreateIntegration = api.integrations.useCreate()
  const [selected, setSelected] = useState<{id: number, name: string}>()
  const [nameValue, setNameValue] = useState('')
  const [isNameValid, setIsNameValid] = useState(true)
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelected(categories[0])
    }
  },[categories])

  async function handleOnSubmit() {
    const categoryId = selected?.id
    if (!nameValue) {
      setIsNameValid(false)
    }
    if (categoryId) {
      await apiCreateIntegration.mutateAsync({name: nameValue, category_id: categoryId}, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["integrations"]})
          toggleModal()
        }
      })
    }
  }

  function handleOnChange(value: string) {
    if (!value) {
      setIsNameValid(false)
    }
    setIsNameValid(true)
    setNameValue(value)
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
            placeholder="Integration name"
            aria-invalid="true"
            aria-describedby="email-error"
            value={nameValue}
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
            Integration name cannot be blank
          </p>
        }
      </div>

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


    </Modal>
  )
}
