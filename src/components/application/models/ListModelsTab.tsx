import { api } from "@/api"
import { classNames } from "@/components/utils"
import Link from "next/link"


export function ListModelsTab() {
  const { data: models } = api.models.useList()

  return (
    <div className="mt-5 md:col-span-2 md:mt-0">
      <div className="max-h-[700px] 2xl:max-h-[850px] overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Models</h1>
              <p className="mt-2 text-sm text-gray-700">
                List of all Models and their associated API endpoints.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col border-l border-r border-b">
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
                          Integration
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                        >
                          API Endpoint
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                        >
                          Is Mapped?
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
                      {models?.map((model, idx) => (
                        <tr key={model.id}>
                          <td
                            className={classNames(
                              idx !== models.length - 1 ? 'border-b border-gray-200' : '',
                              'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                            )}
                          >
                            {model.name}
                          </td>
                          <td
                            className={classNames(
                              idx !== models.length - 1 ? 'border-b border-gray-200' : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                            )}
                          >
                            Integration Name
                          </td>
                          <td
                            className={classNames(
                              idx !== models.length - 1 ? 'border-b border-gray-200' : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                            )}
                          >
                            Integration Endpoint
                          </td>
                          <td
                            className={classNames(
                              idx !== models.length - 1 ? 'border-b border-gray-200' : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                            )}
                          >
                            Yes
                          </td>
                          <td
                            className={classNames(
                              idx !== models.length - 1 ? 'border-b border-gray-200' : '',
                              'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8'
                            )}
                          >
                            <Link href="#" className="text-indigo-600 hover:text-indigo-900">
                              Edit<span className="sr-only">, {model.name}</span>
                            </Link>
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
    </div>
  )
}