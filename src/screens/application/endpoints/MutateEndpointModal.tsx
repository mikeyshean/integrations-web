import { useEffect, useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Modal from '@/components/Forms/ModalContainer'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { classNames } from '@/components/utils'
import { ApiError } from 'api/errors'
import { API_ERROR } from '@/constants'
import { Select, SelectItem, EmptySelectItem } from '@/components/Forms/Select'
import { Input } from '@/components/Forms/Input'
import { ValidationMessage } from '@/components/Forms/ValidationMessage'


const Methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
] as const

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
  const [selectedIntegration, setSelectedIntegration] = useState<SelectItem>(EmptySelectItem)
  const [integrationItems, setIntegrationItems] = useState<SelectItem[]>([])
  const [selectedMethod, setSelectedMethod] = useState<SelectItem>(EmptySelectItem)
  const [methodItems] = useState<SelectItem[]>(Methods.map((method) => { return {key: method, value: method}}))
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
    if (!selectedIntegration?.key) {
      setIsValidIntegration(false)
      isValid = false
    }
    if (!selectedMethod.key) {
      setIsValidMethod(false)
      isValid = false
    }

    if (!isValid) return

    if (isEditForm && id) {
      apiEditEndpoint.mutate(
        {
          id: id,
          method: selectedMethod.value,
          path: pathValue,
          integrationId: selectedIntegration.key as number
        }, 
        {
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
          }
        }
      )
    } else {
      apiCreateEndpoint.mutate(
        {
          method: selectedMethod.value,
          path: pathValue,
          integrationId: selectedIntegration.key as number
        }, 
        {
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
          }
        }
      )
    }
  }

  function resetValidations() {
    setIsPathValid(true)
    setIsUniqueError(false)
    setIsValidIntegration(true)
    setIsValidMethod(true)
  }

  function handleIntegrationOnChange(item: SelectItem) {
    setIsValidIntegration(true)
    setSelectedIntegration(item)
  }
  
  function handleMethodOnChange(item: SelectItem) {
    setIsValidMethod(true)
    setSelectedMethod(item)
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
    if (show && !isEditForm) {
      setSelectedIntegration(EmptySelectItem)
      setSelectedMethod(EmptySelectItem)
      setPathValue('')
      resetValidations()
    }
  },[show])

  useEffect(() => {
    if (integrations && integrations.length > 0) {
      const items = integrations.map((integration) => { return {key: integration.id, value: integration.name }})
      setIntegrationItems(items)
    }
  }, [integrations])

  useEffect(() => {
    if (integrationId 
        && integrationName
        && method
        && path
      ) {
      setSelectedIntegration({key: integrationId, value: integrationName})
      setSelectedMethod({key: method, value: method})
      setPathValue(path)
    }
  }, [integrationId, integrationName, method, path])

  
  return (
    <Modal cancelText='Cancel' submitText='Save' onSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900">{isEditForm ? "Edit" : "Create" } Endpoint</h1>

      {/* Select Integration */}
      <Select selected={selectedIntegration} onChange={handleIntegrationOnChange} items={integrationItems} name="Integration" isValid={isValidIntegration}/>
      
      {/* Path */}
      <Input name="endpoint-path" value={pathValue} label="Path" isValid={isPathValid} onChange={validatePath} placeholder="/employees" describedBy='path-error'>
        <ValidationMessage isValid={isPathValid} message="Path is required." id="path-error" />
      </Input>

      {/* HTTP Method */}

      <Select selected={selectedMethod} onChange={handleMethodOnChange} items={methodItems} name="HTTP MEthod" isValid={isValidMethod} />
      <ValidationMessage isValid={!isUniqueError} message="Integration, Path, and HTTP Method must be a unique combination." id="unique-error"/>

    </Modal>
  )
}
