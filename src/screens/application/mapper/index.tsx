import { api } from "@/api";
import Breadcrumbs, { PageType } from "@/components/Breadcrumbs";
import { EmptySelectItem, SelectItem } from "@/components/Forms/Select";
import StackedCards from "screens/application/mapper/StackedCards";
import { useEffect, useState } from "react";
import SourceModelForm from "./SourceModelForm";
import { classNames } from "@/components/utils";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function MapperPage() {
  const [selectedModel, setSelectedModel ] = useState<SelectItem>(EmptySelectItem)
  const [pages, setPages] = useState<PageType[]>([])
  const [currentModel, setCurrentModel] = useState<{id: number, name: string}>({ id: selectedModel.key as number, name: selectedModel.value })
  const { data: currentModelData, isFetching } = api.models.useGetItem({id: currentModel.id, enabled: !!currentModel.id})
  const [show, setShow] = useState(true)


  function handleBreadcrumbOnClick(idx: number) {
    setPages(prev => prev.slice(0, idx+1))
  }

  function breadcrumbPages() {
    if (pages.length === 0 && currentModelData) {
      setPages([{id: currentModelData.id, name: currentModelData.name, idx: 0, current: true}])
    }
    return pages
  }

  function toggleForm() {
    setShow(!show)
  }

  function fieldObjectOnClick(model: {id: number, name: string}) {
    setPages(prev => [...prev, {id: model.id, name: model.name, idx: prev.length, current: true}])
  }

  useEffect(() => {
    if (selectedModel.key) {
      setCurrentModel({id: selectedModel.key as number, name: selectedModel.value})
    }
  }, [selectedModel])
  
  useEffect(() => {
    const lastPage = pages[pages.length - 1]
    if (lastPage) {
      setCurrentModel({ id: lastPage.id, name: lastPage.name })
    }
  }, [pages])
  
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
            <SourceModelForm onChange={setSelectedModel}/>
          </div>
          
          {/* Bread Crumbs */}
          <div className={classNames(
            currentModelData || isFetching ? "" : "hidden",
            "text-center p-2 border border-indigo-700 rounded-lg rounded-b-none border-b bg-indigo-700 text-white"
            )}>
            Model
          </div>
          <div>
            <div className={classNames(
              currentModelData || isFetching ? "" : "hidden",
              "overflow-x-scroll border-indigo-300 border rounded-lg rounded-t-none border-t-0 mb-2"
              )}>
              <Breadcrumbs pages={breadcrumbPages()} onClick={handleBreadcrumbOnClick} currentPageId={currentModel.id} />
            </div>
          </div>

          
          <div className={classNames(
            currentModelData || isFetching ? "" : "hidden",
            "text-center p-2 border border-indigo-700 rounded-lg rounded-b-none border-b bg-indigo-700 text-white"
            )}>
            Fields
          </div>

          {/* Field List */}
          <div className={classNames(
            currentModelData || isFetching ? "" : "hidden",
            "flex-grow flex flex-col overflow-hidden border border-t-0 rounded-lg rounded-t-none border-indigo-300 bg-indigo-50"
            )}>
            <div className="overflow-y-auto py-3">
              {currentModelData?.fields && currentModelData.fields.length > 0 && 
                <StackedCards fields={currentModelData.fields} onClick={fieldObjectOnClick} />
              }
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