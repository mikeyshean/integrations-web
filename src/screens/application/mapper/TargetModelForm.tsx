import { Select } from "@/components/Forms/Select";
import { api } from '@/api'
import { useMapperContext } from "./context";

export default function TargetModelForm() {
  const { ctxCategory } = useMapperContext()
  const { data: categoryModels } = api.models.useList({ categoryId: ctxCategory.key as number, enabled: !!ctxCategory.key })
  const { ctxTargetModel, setCtxTargetModel } = useMapperContext()

  function modelItems() {
    return categoryModels?.map((model) => { return {key: model.id, value: model.name }}) || []
  }
  
  return (
    <>
      <div className="w-full flex flex-col sm:flex-row">
        <div className="px-5 w-full sm:w-1/2">
          <Select selected={ctxTargetModel} items={modelItems()} name="Target Model" onChange={setCtxTargetModel} />
        </div>
      </div>
    </>
  )
}