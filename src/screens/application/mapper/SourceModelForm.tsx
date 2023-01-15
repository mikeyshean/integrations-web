import { Select, SelectItem, EmptySelectItem } from "@/components/Forms/Select";
import { api } from '@/api'
import { useEffect, useState } from "react";

export default function SourceModelForm({ onChange }: { onChange: (item: SelectItem) => void }) {
  // Integrations
  const { data: integrations } = api.integrations.useList()
  const [selectedIntegration, setSelectedIntegration] = useState<SelectItem>(EmptySelectItem)
  const [isValidIntegration, setIsValidIntegration] = useState(true)

  // Category
  const { data: categories } = api.integrations.useListCategories()
  const [selectedCategory, setSelectedCategory] = useState<SelectItem>(EmptySelectItem)
  const [isValidCategory, setIsValidCategory] = useState(true)

  // Endpoints
  const { data: endpoints } = api.integrations.useGetIntegrationEndpoints({ id: selectedIntegration.key as number, enabled: !!selectedIntegration.key })
  const [selectedEndpoint, setSelectedEndpoint] = useState<SelectItem>(EmptySelectItem)
  const [isValidEndpoint, setIsValidEndpoint] = useState(true)
  
  // Endpoint Models
  const { data: endpointModels } = api.integrations.useGetEndpointModels({ id: selectedEndpoint.key as number, enabled: !!selectedEndpoint.key })
  const [selectedModel, setSelectedModel] = useState<SelectItem>(EmptySelectItem)
  const [isValidModel, setIsValidModel] = useState(true)

  
  function filteredIntegrationItems() {
    return integrations?.filter(integration => {
      return integration.category.id == selectedCategory.key || !selectedCategory.key
    }).map(integration => { return { key: integration.id, value: integration.name }}) || []
  }

  function categoryItems() {
    return categories?.map((category) => { return {key: category.id, value: category.name }}) || []
  }

  function endpointItems() {
    return endpoints?.map((endpoint) => { return {key: endpoint.id, value: endpoint.path + " - " + endpoint.method }}) || []
  }
  
  function modelItems() {
    return endpointModels?.filter(endpoint => endpoint.model).map((endpoint) => { return {key: endpoint.model!.id, value: endpoint.model!.name }}) || []
  }

  function onIntegrationChange(item: SelectItem) {
    if (!!item.key) {
      setIsValidIntegration(true)
    }
    setSelectedIntegration(item)
  }

  function onCategoryChange(item: SelectItem) {
    if (!!item.key) {
      setIsValidCategory(true)
    }
    setSelectedCategory(item)
  }
  
  function onEndpointChange(item: SelectItem) {
    if (!!item.key) {
      setIsValidEndpoint(true)
    }
    setSelectedEndpoint(item)
  }
  
  function onModelChange(item: SelectItem) {
    if (!!item.key) {
      setIsValidModel(true)
    }
    setSelectedModel(item)
  }

  useEffect(() => {
    const selectedIntegrationId = selectedIntegration.key
    const integration = integrations?.find(item => item.id === selectedIntegrationId)
    if (integration?.category.id !== selectedCategory.key) {
      setSelectedIntegration(EmptySelectItem)
    }
  }, [selectedCategory])

  useEffect(() => {
    const selectedIntegrationId = selectedIntegration.key
    const integration = integrations?.find(item => item.id === selectedIntegrationId)
    if (integration && integration?.category.id !== selectedCategory.key) {
      setSelectedCategory({key: integration?.category.id, value: integration?.category.name})
    }
    setSelectedEndpoint(EmptySelectItem)
    setSelectedModel(EmptySelectItem)
  }, [selectedIntegration])

  useEffect(() => {
    const selectedEndpointId = selectedEndpoint.key
    const endpoint = endpointModels?.find(item => item.id === selectedEndpointId)
    if (endpoint?.model?.id !== selectedModel.key) {
      setSelectedModel(EmptySelectItem)
    }
  }, [selectedEndpoint])
  
  useEffect(() => {
    onChange(selectedModel)
  }, [selectedModel])
  
  return (
    <div className="h-1/4 border flex flex-col">
      <div className="w-full flex flex-col sm:flex-row">
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={selectedCategory} items={categoryItems()} name="Category" isValid={isValidCategory} onChange={onCategoryChange} />
        </div>
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={selectedIntegration} items={filteredIntegrationItems()} name="Integration" isValid={isValidIntegration} onChange={onIntegrationChange} />
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row">
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={selectedEndpoint} items={endpointItems()} name="Endpoint" isValid={isValidEndpoint} onChange={onEndpointChange} />
        </div>
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={selectedModel} items={modelItems()} name="Model" isValid={isValidModel} onChange={onModelChange} />
        </div>
      </div>
    </div>
  )
}