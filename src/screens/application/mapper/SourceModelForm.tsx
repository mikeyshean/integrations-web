import { Select, SelectItem, EmptySelectItem } from "@/components/Forms/Select";
import { api } from '@/api'
import { useMapperContext } from "./context";

export default function SourceModelForm() {

  // MapperContext
  const { 
    ctxCategory,
    setCtxCategory,
    ctxSourceModel,
    setCtxSourceModel,
    ctxEndpoint,
    setCtxEndpoint,
    ctxIntegration,
    setCtxIntegration 
  } = useMapperContext()

  const { data: integrations } = api.integrations.useList()
  const { data: categories } = api.integrations.useListCategories()
  const { data: endpoints } = api.integrations.useGetIntegrationEndpoints({ id: ctxIntegration.key as number, enabled: !!ctxIntegration.key })
  const { data: endpointModels } = api.integrations.useGetEndpointModels({ id: ctxEndpoint.key as number, enabled: !!ctxEndpoint.key })

  function categoryItems() {
    return categories?.map((category) => { return {key: category.id, value: category.name }}) || []
  }

  function filteredIntegrationItems() {
    return integrations?.filter(integration => {
      return integration.category.id == ctxCategory.key || !ctxCategory.key
    }).map(integration => { return { key: integration.id, value: integration.name }}) || []
  }

  function endpointItems() {
    return endpoints?.map((endpoint) => { return {key: endpoint.id, value: endpoint.path + " - " + endpoint.method }}) || []
  }
  
  function modelItems() {
    return endpointModels?.map((endpoint) => { return {key: endpoint.model!.id, value: endpoint.model!.name }}) || []
  }

  function onCategoryChange(item: SelectItem) {
    setCtxCategory(item)
    setCtxIntegration(EmptySelectItem)
    setCtxEndpoint(EmptySelectItem)
    setCtxSourceModel(EmptySelectItem)
  }

  function onIntegrationChange(item: SelectItem) {
    const selectedIntegrationId = item.key
    const integration = integrations?.find(item => item.id === selectedIntegrationId)
    if (integration && integration?.category.id !== ctxCategory.key) {
      setCtxCategory({key: integration?.category.id, value: integration?.category.name})
    }
    setCtxIntegration(item)
    setCtxEndpoint(EmptySelectItem)
    setCtxSourceModel(EmptySelectItem)
  }

  function onEndpointChange(item: SelectItem) {
    setCtxEndpoint(item)
    setCtxSourceModel(EmptySelectItem)
  }
  
  return (
    <>
      <div className="w-full flex flex-col sm:flex-row">
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={ctxCategory} items={categoryItems()} name="Category" onChange={onCategoryChange} />
        </div>
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={ctxIntegration} items={filteredIntegrationItems()} name="Integration" onChange={onIntegrationChange} />
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row">
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={ctxEndpoint} items={endpointItems()} name="Endpoint" onChange={onEndpointChange} />
        </div>
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={ctxSourceModel} items={modelItems()} name="Model" onChange={setCtxSourceModel} />
        </div>
      </div>
    </>
  )
}