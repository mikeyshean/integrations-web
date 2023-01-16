import { api } from "@/api";
import Breadcrumbs, { PageType } from "@/components/Breadcrumbs";
import { SelectItem } from "@/components/Forms/Select";
import StackedCards from "screens/application/mapper/StackedCards";
import { useEffect, useState } from "react";
import SourceModelForm from "./SourceModelForm";
import { Model } from "api/schema/models";

const crumbs = [
  { id: 0, name: 'Project 0', idx: 0, current: false },
  { id: 1, name: 'Project 1', idx: 1, current: false },
  { id: 2, name: 'Project 2', idx: 2, current: false },
  { id: 3, name: 'Project 3', idx: 3, current: false },
  { id: 4, name: 'Project 4', idx: 4, current: false },
  { id: 5, name: 'Project 5', idx: 5, current: false },
  { id: 6, name: 'Project 6', idx: 6, current: true },
] 
export default function MapperPage() {
  const [modelItem, setModelItem ] = useState<SelectItem>({key: 0, value: ''})
  const { data: model } = api.models.useGetItem({id: modelItem.key as number, enabled: !!modelItem.key})
  const [pages, setPages] = useState<PageType[]>([])
  const [currentModel, setCurrentModel] = useState<Model>()


  function handleBreadcrumbOnClick(idx: number) {
    setPages(prev => prev.slice(0, idx+1))
  }

  function breadcrumbPages() {
    if (pages.length === 0 && model) {
      setPages([{id: model.id, name: model.name, idx: 0, current: true}])
    }
    return pages
  }

  useEffect(() => {
    setCurrentModel(model)
  }, [model])
  
  return (
    <div className="flex flex-col sm:flex-row flex-start overflow-hidden h-full">
      <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
        <div className="h-full flex flex-col flex-start rounded-lg border-2 border-dashed border-gray-200">
          
          {/* Top Form */}
          <div className="max-h-1/4 border flex flex-col p-5 pt-0">
            <SourceModelForm onChange={setModelItem}/>
          </div>
          
          
          
          {/* Bottom Table */}
          <div>
            <div className="overflow-x-scroll">
              <Breadcrumbs pages={breadcrumbPages()} onClick={handleBreadcrumbOnClick}/>
            </div>
          </div>
          <div className="flex-grow flex flex-col overflow-hidden border">
            <div className="overflow-y-auto">
              <StackedCards fields={currentModel?.fields || []}/>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
        <div className="h-full rounded-lg border-2 border-dashed border-gray-200">
          Section 2
        </div>
      </div>
    </div>
  )
}