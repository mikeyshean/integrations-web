import { useEffect, useState } from 'react'
import Modal from '@/components/Forms/Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { isUrlValid } from '@/components/utils'
import { ApiError } from 'api/errors'
import { API_ERROR } from '@/constants'
import { Input } from '@/components/Forms/Input'
import { ValidationMessage } from '@/components/Forms/ValidationMessage'
import { EmptySelectItem, Select, SelectItem } from '@/components/Forms/Select'
import { InputWithAddon } from '@/components/Forms/InputWithAddon'


export default function MutateIntegrationModal(
  { id, integrationName, show, toggleModal, isEditForm, categoryId, categoryName, domainId, domain }:
   {
    id: number|null,
    integrationName: string|null,
    show: boolean,
    toggleModal: () => void,
    isEditForm: boolean,
    categoryId: number|null,
    categoryName: string|null,
    domainId: number|null,
    domain: string|null
  }
) {
  const { data: categories } = api.integrations.useListCategories()
  const apiCreateIntegration = api.integrations.useCreate()
  const apiEditIntegration = api.integrations.useEdit()
  const [selectedCategory, setSelectedCategory] = useState<SelectItem>({key: 0, value: ''})
  const [categoryItems, setCategoryItems] = useState<SelectItem[]>([])
  const [domainValue, setDomainValue] = useState('')
  const [nameValue, setNameValue] = useState(integrationName || '')
  const [isNameValid, setIsNameValid] = useState(true)
  const [isValidCategory, setIsValidCategory] = useState(true)
  const [isValidUrl, setIsValidUrl] = useState(true)
  const [isUniqueError, setIsUniqueError] = useState(false)
  const queryClient = useQueryClient()

  async function handleOnSubmit() {
    const categoryId = selectedCategory.key
    let isValid = true
    if (!nameValue) {
      setIsNameValid(false)
      isValid = false
    }
    if (!domainValue || !isUrlValid(domainValue)) {
      setIsValidUrl(false)
      isValid = false
    }
    
    if (!categoryId) {
      setIsValidCategory(false)
    }

    if (!isValid) {
      return
    }

    if (isEditForm && id && domainId) {
      apiEditIntegration.mutate(
        {
          id: id,
          name: nameValue,
          categoryId: selectedCategory.key as number,
          domainId: domainId,
          domain: domainValue
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["integrations"] })
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
      apiCreateIntegration.mutate(
        {
          name: nameValue,
          categoryId: categoryId as number,
          domain: domainValue
        }, 
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["integrations"]})
            setIsUniqueError(false)
            setIsNameValid(true)
            setIsValidCategory(true)
            toggleModal()
          },
          onError(error) {
            if (error instanceof ApiError) {
              if (error.errorCode == API_ERROR.UNIQUE_OR_REQUIRED_FIELD) {
                setIsUniqueError(true)
              }
            }
          },
        }
      )
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
      setIsValidUrl(false)
    }    
    if (isUrlValid(value)) {
      setIsValidUrl(true)
    }

    setDomainValue(value)
  }

  function handleCategoryOnChange(item: SelectItem) {
    setIsValidCategory(true)
    setSelectedCategory(item)
  }

  function resetValidations() {
    setIsValidCategory(true)
    setIsNameValid(true)
    setIsValidUrl(true)
  }

  useEffect(() => {
    if (show && !isEditForm) {
      setSelectedCategory(EmptySelectItem)
      setNameValue('')
      setDomainValue('')
      resetValidations()
    }
  }, [show])

  useEffect(() => {
    if (categories && categories.length > 0) {
      const items = categories.map((category) => { return {key: category.id, value: category.name }})
      setCategoryItems(items)
    }
  }, [categories])

  useEffect(() => {
    if (categoryId 
      && categoryName
      && domain
      && integrationName
    ) {
      setSelectedCategory({key: categoryId, value: categoryName})
      setNameValue(integrationName)
      setDomainValue(domain)
    }
  }, [integrationName, categoryId, categoryName, domain])

  return (
    <Modal cancelText="Cancel" submitText="Save" onSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900">{isEditForm ? "Edit" : "Create"} Integration</h1>

      {/* Integration Name */}
      <Input 
        name="integration-name"
        placeholder="MyIntegration"
        value={nameValue}
        label="Integration Name"
        onChange={validateIntegrationName}
        isValid={(isNameValid && !isUniqueError)}
      >
        <ValidationMessage id="name-error" message="Integration name is required." isValid={isNameValid} />
        <ValidationMessage id="unique-error" message="This integration already exists in this category. Try a different name." isValid={!isUniqueError} />
      </Input>
      
      {/* Category List Box */}
      <Select selected={selectedCategory} onChange={handleCategoryOnChange} name="Category" items={categoryItems} isValid={isValidCategory}>
        <ValidationMessage message="Category is required." isValid={isValidCategory} id="category-error" />
      </Select>

      {/* Domain */}
      <InputWithAddon
        isValid={isValidUrl}
        onChange={validateUrl}
        placeholder="www.example.com/api"
        describedBy="domain-error"
        name="api-domain"
        addon="https://"
        value={domainValue}
        label="Domain (Base domain for API)"
      >
        <ValidationMessage isValid={isValidUrl} message="Enter a valid domain." id="domain-error"/>
      </InputWithAddon>
    </Modal>
  )
}
