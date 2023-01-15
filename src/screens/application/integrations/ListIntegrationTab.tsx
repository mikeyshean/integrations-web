import { api } from "@/api"
import { classNames } from "@/components/utils"
import { useState } from "react"
import MutateIntegrationModal from "./MutateIntegrationModal"
import {  PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useQueryClient } from "@tanstack/react-query"


export default function ListIntegrationTab() {
  const { data: integrations } = api.integrations.useList()
  const apiDeleteIntegration= api.integrations.useDelete()
  const [showModal, setShowModal] = useState(false)
  const [isEditForm, setIsEditForm] = useState(false)
  const [editIntegrationId, setEditIntegrationId] = useState<number|null>(null)
  const [editIntegrationName, setEditIntegrationName] = useState<string|null>(null)
  const [editCategoryName, setEditCategoryName] = useState<string|null>(null)
  const [editCategoryId, setEditCategoryId] = useState<number|null>(null)
  const [editDomain, setEditDomain] = useState<string|null>(null)
  const [editDomainId, setEditDomainId] = useState<number|null>(null)
  const queryClient =  useQueryClient()
  
  function toggleModal() {
    setShowModal(!showModal)
  }

  async function handleDelete(id: number) {
    apiDeleteIntegration.mutate({id: id}, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["integrations"]})
      }
    })
  }

  function handleEditForm(
    id: number,
    integrationName: string,
    categoryId: number,
    categoryName: string,
    domain: string,
    domainId: number
  ) {
    setEditIntegrationId(id)
    setEditIntegrationName(integrationName)
    setEditCategoryName(categoryName)
    setEditCategoryId(categoryId)
    setEditDomain(domain)
    setEditDomainId(domainId)
    setIsEditForm(true)
    setShowModal(true)
  }

  function handleCreateForm() {
    setEditIntegrationId(null)
    setEditIntegrationName(null)
    setEditCategoryName(null)
    setEditCategoryId(null)
    setEditDomain(null)
    setIsEditForm(false)
    setShowModal(true)
  }

  return (
    <div className="mt-5 md:col-span-2 md:mt-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <MutateIntegrationModal
          id={editIntegrationId}
          integrationName={editIntegrationName}
          categoryId={editCategoryId}
          categoryName={editCategoryName}
          domain={editDomain}
          domainId={editDomainId}
          show={showModal}
          toggleModal={toggleModal}
          isEditForm={isEditForm}
        />
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
            <p className="mt-2 text-sm text-gray-700">
              List of all integrations with APIs we will connect with.  <br/>Each must be assigned a base domain.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handleCreateForm}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add integration
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        API Domain
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        # of Endpoints
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {integrations?.map((integration, idx) => (
                      <tr key={integration.id}>
                        <td
                          className={classNames(
                            idx !== integrations.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                          )}
                        >
                          {integration.name}
                        </td>
                        <td
                          className={classNames(
                            idx !== integrations.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                          )}
                        >
                          {integration.category.name}
                        </td>
                        <td
                          className={classNames(
                            idx !== integrations.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          {integration.domains[0]?.domain}
                        </td>
                        <td
                          className={classNames(
                            idx !== integrations.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          {integration.endpoint_count}
                        </td>
                        <td
                          className={classNames(
                            idx !== integrations.length - 1 ? 'border-b border-gray-200' : '',
                            'flex justify-end whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8'
                          )}
                        >
                          <button onClick={() => handleEditForm(integration.id, integration.name, integration.category.id, integration.category.name, integration.domains[0]?.domain, integration.domains[0]?.id)} className="text-indigo-600 hover:text-indigo-900">
                            <PencilSquareIcon
                                className={classNames(
                                  'text-indigo-300 hover:text-indigo-500',
                                  'h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              <span className="sr-only">, Edit {integration.name}</span>
                          </button>
                          <button onClick={() => {handleDelete(integration.id)}} className="text-indigo-600 hover:text-indigo-900 pl-4">
                            <TrashIcon
                                className={classNames(
                                  'text-indigo-300 hover:text-indigo-500',
                                  'h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              <span className="sr-only">, Delete {integration.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}