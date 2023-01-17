import { api } from "@/api";
import Breadcrumbs, { PageType } from "@/components/Breadcrumbs";
import { EmptySelectItem } from "@/components/Forms/Select";
import StackedCards from "screens/application/mapper/StackedCards";
import { useEffect, useState } from "react";
import TargetModelForm from "./TargetModelForm";
import { classNames } from "@/components/utils";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useMapperContext } from "./context";

export default function TargetModelPage() {
  const { ctxTargetModel, setCtxTargetModel, ctxSourceModel } = useMapperContext()
  const [pages, setPages] = useState<PageType[]>([])
  const [currentFieldModel, setCurrentFieldModel] = useState<{id: number, name: string}>({ id: ctxTargetModel.key as number, name: ctxTargetModel.value })
  const { data: currentModelData, isFetching } = api.models.useGetItem({id: currentFieldModel.id, enabled: !!currentFieldModel.id})
  const [show, setShow] = useState(false)
  const [fieldsListTitle, setFieldsListTitle] = useState('')


  function handleBreadcrumbOnClick(idx: number) {
    setPages(prev => prev.slice(0, idx+1))
    const currentPage = pages[idx]
    setCurrentFieldModel({ id: currentPage.id, name: currentPage.name })
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
    setCurrentFieldModel({ id: model.id, name: model.name })
  }

  useEffect(() => {
    if (ctxTargetModel.key) {
      setCurrentFieldModel({id: ctxTargetModel.key as number, name: ctxTargetModel.value})
      setPages([{ id: ctxTargetModel.key as number, name: ctxTargetModel.value, idx: 0 }])
      setShow(false)
    } else {
      setCurrentFieldModel({ id: 0 as number, name: '' })
      setPages([])
      setShow(false)
    }
  }, [ctxTargetModel])

  useEffect(() => {
    setFieldsListTitle('Fields for '+ currentFieldModel.name)
  }, [currentFieldModel])
  
  useEffect(() => {
    if (ctxSourceModel.key) {
      setShow(true)
    } else {
      setShow(false)
      setCtxTargetModel(EmptySelectItem)
    }
  }, [ctxSourceModel])

  return (
    <>
      
      {/* Select Source Model Form */}
      <div className={classNames(
        show ? "rounded-b-none" : "mb-2",
        ctxSourceModel.key ? "bg-indigo-700 border-indigo-700" : "bg-gray-300 border-gray-300",
        "text-center p-2 border rounded-lg border-b  text-white"
        )}>
        {"Select Target Model"}
        <button className="float-right" disabled={!ctxSourceModel.key} onClick={toggleForm}>
          { show ? <ChevronUpIcon className="h-5 w-5 text-white" aria-hidden="true" /> : <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />}
        </button>
      </div>
      <div className={classNames(
        show ? "" : "hidden",
        "max-h-1/4 border rounded-lg rounded-t-none border-indigo-300 border-t-0 bg-indigo-50 flex flex-col p-5 pt-0 mb-2")}>
        <TargetModelForm />
      </div>
      
      {/* Bread Crumbs */}
      <div className={classNames(
        currentModelData || isFetching ? "" : "hidden",
        "text-center p-2 border border-indigo-700 rounded-lg rounded-b-none border-b bg-indigo-700 text-white"
        )}>
        Target Model
      </div>
      <div>
        <div className={classNames(
          currentModelData || isFetching ? "" : "hidden",
          "overflow-x-scroll border-indigo-300 border rounded-lg rounded-t-none border-t-0 mb-2"
          )}>
          <Breadcrumbs pages={breadcrumbPages()} onClick={handleBreadcrumbOnClick} currentPageId={currentFieldModel.id} />
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
            <StackedCards fields={currentModelData.fields} onClick={fieldObjectOnClick} isSource={false}/>
          }
        </div>
      </div>
    </>
  )
}