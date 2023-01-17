import { api } from "@/api";
import Breadcrumbs, { PageType } from "@/components/Breadcrumbs";
import { EmptySelectItem, SelectItem } from "@/components/Forms/Select";
import StackedCards from "screens/application/mapper/StackedCards";
import { useEffect, useState } from "react";
import SourceModelForm from "./SourceModelForm";
import { classNames } from "@/components/utils";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function SourceModelPage() {
  const [selectedModel, setSelectedModel ] = useState<SelectItem>(EmptySelectItem)
  const [pages, setPages] = useState<PageType[]>([])
  const [currentModel, setCurrentModel] = useState<{id: number, name: string}>({ id: selectedModel.key as number, name: selectedModel.value })
  const { data: currentModelData, isFetching } = api.models.useGetItem({id: currentModel.id, enabled: !!currentModel.id})
  const [show, setShow] = useState(true)
  const [formTitle, setFormTitle] = useState('')
  const [fieldsListTitle, setFieldsListTitle] = useState('')


  function handleBreadcrumbOnClick(idx: number) {
    setPages(prev => prev.slice(0, idx+1))
    const currentPage = pages[idx]
    setCurrentModel({ id: currentPage.id, name: currentPage.name })
  }

  function breadcrumbPages() {
    if (pages.length === 0 && currentModelData) {
      setPages([{ id: currentModelData.id, name: currentModelData.name, idx: 0 }])
    }
    return pages
  }

  function toggleForm() {
    setShow(!show)
  }

  function fieldObjectOnClick(model: {id: number, name: string}) {
    setPages(prev => [...prev, { id: model.id, name: model.name, idx: prev.length }])
    setCurrentModel({ id: model.id, name: model.name })
  }

  function endpointOnChange(integrationName: string, endpointPath: string, endpointMethod: string) {
    setFormTitle(endpointMethod+' '+endpointPath+' ('+integrationName+')')
  }

  useEffect(() => {
    if (selectedModel.key) {
      setCurrentModel({id: selectedModel.key as number, name: selectedModel.value})
      setPages([{ id: selectedModel.key as number, name: selectedModel.value, idx: 0 }])
      setShow(false)
    }
  }, [selectedModel])

  useEffect(() => {
    setFieldsListTitle('Fields for '+ currentModel.name)
  }, [currentModel])
  
  return (
    <>
      
      {/* Select Source Model */}
      <div className={classNames(
        show ? "rounded-b-none" : "mb-2",
        "text-center p-2 border border-indigo-700 rounded-lg border-b bg-indigo-700 text-white"
        )}>
        {show || !formTitle || !currentModel.id ? "Select Source Model" : formTitle}
        <button className="float-right" onClick={toggleForm}>
          { show ? <ChevronUpIcon className="h-5 w-5 text-white" aria-hidden="true" /> : <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />}
        </button>
      </div>
      <div className={classNames(
        show ? "" : "hidden",
        "max-h-1/4 border rounded-lg rounded-t-none border-indigo-300 border-t-0 bg-indigo-50 flex flex-col p-5 pt-0 mb-2")}>
        <SourceModelForm modelOnChange={setSelectedModel} endpointOnChange={endpointOnChange} />
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

      
      {/* Field List */}
      <div className={classNames(
        currentModelData || isFetching ? "" : "hidden",
        "text-center p-2 border border-indigo-700 rounded-lg rounded-b-none border-b bg-indigo-700 text-white"
        )}>
        {fieldsListTitle}
      </div>
      
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
    </>
  )
}