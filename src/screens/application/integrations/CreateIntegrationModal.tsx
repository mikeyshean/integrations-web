import { useEffect, useState, Fragment } from 'react'
import Modal from '@/components/Forms/Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { isValidUrl } from '@/components/utils'
import { ApiError } from 'api/errors'
import { API_ERROR } from '@/constants'
import { Input } from '@/components/Forms/Input'
import { ValidationMessage } from '@/components/Forms/ValidationMessage'
import { Select, SelectItem } from '@/components/Forms/Select'
import { InputWithAddon } from '@/components/Forms/InputWithAddon'


export default function CreateIntegrationModal({ show, toggleModal }: { show: boolean, toggleModal: () => void}) {
  const { data: categories } = api.integrations.useListCategories()
  const apiCreateIntegration = api.integrations.useCreate()
  const [selectedCategory, setSelectedCategory] = useState<SelectItem>({key: 0, value: ''})
  const [categoryItems, setCategoryItems] = useState<SelectItem[]>([])
  const [nameValue, setNameValue] = useState('')
  const [domainValue, setDomainValue] = useState('')
  const [isNameValid, setIsNameValid] = useState(true)
  const [isValidCategory, setIsValidCategory] = useState(true)
  const [isUrlValid, setIsUrlValid] = useState(true)
  const [isUniqueError, setIsUniqueError] = useState(false)
  const queryClient = useQueryClient()
  
  // TODO: Get rid of list like MutateendpointModal (show default text in Selects)
  useEffect(() => {
    if (categories && categories.length > 0) {
      // const category = categories[0]
      // setSelectedCategory({key: category.id, value: category.name})
      const items = categories.map((category) => { return {key: category.id, value: category.name }})
      setCategoryItems(items)
    }
  }, [categories])

  async function handleOnSubmit() {
    const categoryId = selectedCategory.key
    let isValid = true
    if (!nameValue) {
      setIsNameValid(false)
      isValid = false
    }
    if (!domainValue || !isValidUrl(domainValue)) {
      setIsUrlValid(false)
      isValid = false
    }
    
    if (!categoryId) {
      setIsValidCategory(false)
    }

    if (!isValid) {
      return
    }


    apiCreateIntegration.mutate({name: nameValue, categoryId: categoryId as number, domain: domainValue}, {
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
    })
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

  return (
    <Modal cancelText="Cancel" submitText="Save" onSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900">Create Integration</h1>

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
      <Select selected={selectedCategory} onChange={setSelectedCategory} name="Category" items={categoryItems} isValid={isValidCategory}>
        <ValidationMessage message="Category is required." isValid={isValidCategory} id="category-error" />
      </Select>

      {/* Domain */}
      <InputWithAddon
        isValid={isUrlValid}
        onChange={validateUrl}
        placeholder="www.example.com/api"
        describedBy="domain-error"
        name="api-domain"
        addon="https://"
        label="Domain (Base domain for API)"
      >
        <ValidationMessage isValid={isUrlValid} message="Enter a valid domain." id="domain-error"/>
      </InputWithAddon>
    </Modal>
  )
}
