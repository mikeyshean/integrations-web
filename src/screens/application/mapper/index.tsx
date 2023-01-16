import { api } from "@/api";
import Breadcrumbs, { PageType } from "@/components/Breadcrumbs";
import { SelectItem } from "@/components/Forms/Select";
import StackedCards from "screens/application/mapper/StackedCards";
import { useEffect, useState } from "react";
import SourceModelForm from "./SourceModelForm";
import { Model } from "api/schema/models";
import { classNames } from "@/components/utils";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

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
  const [show, setShow] = useState(true)


  function handleBreadcrumbOnClick(idx: number) {
    setPages(prev => prev.slice(0, idx+1))
  }

  function breadcrumbPages() {
    if (pages.length === 0 && model) {
      setPages([{id: model.id, name: model.name, idx: 0, current: true}])
    }
    return pages
  }

  function toggleForm() {
    setShow(!show)
  }

  useEffect(() => {
    setCurrentModel(model)
  }, [model])
  
  return (
    <div className="flex flex-col sm:flex-row flex-start overflow-hidden h-full">
      <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
        <div className="h-full flex flex-col flex-start rounded-lg">
          
          {/* Top Form */}
          <div className={classNames(
            show ? "rounded-b-none" : "mb-2",
            "text-center p-2 border border-indigo-700 rounded-lg border-b bg-indigo-700 text-white"
            )}>
            Select Source Model
            <button className="float-right" onClick={toggleForm}>
              { show ? <ChevronUpIcon className="h-5 w-5 text-white" aria-hidden="true" /> : <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />}
            </button>
          </div>
          <div className={classNames(
            show ? "" : "hidden",
            "max-h-1/4 border rounded-lg rounded-t-none border-indigo-300 border-t-0 bg-indigo-50 flex flex-col p-5 pt-0 mb-2")}>
            <SourceModelForm onChange={setModelItem}/>
          </div>
          
          {/* Bread Crumbs */}
          <div className={classNames(
            currentModel ? "" : "hidden",
            "text-center p-2 border border-indigo-700 rounded-lg rounded-b-none border-b bg-indigo-700 text-white"
            )}>
            Model
          </div>
          <div>
            <div className={classNames(
              currentModel ? "" : "hidden",
              "overflow-x-scroll border-indigo-300 border rounded-lg rounded-t-none border-t-0 mb-2"
              )}>
              <Breadcrumbs pages={breadcrumbPages()} onClick={handleBreadcrumbOnClick}/>
            </div>
          </div>

          
          <div className={classNames(
            currentModel ? "" : "hidden",
            "text-center p-2 border border-indigo-700 rounded-lg rounded-b-none border-b bg-indigo-700 text-white"
            )}>
            Fields
          </div>

          {/* Field List */}
          <div className={classNames(
            currentModel ? "" : "hidden",
            "flex-grow flex flex-col overflow-hidden border border-t-0 rounded-lg rounded-t-none border-indigo-300 bg-indigo-50"
            )}>
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