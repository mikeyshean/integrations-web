import { classNames } from '@/components/utils'
import { useState } from 'react'
import { ListIntegrationTab } from './ListIntegrationTab'

const sideBar = [
  { 
    id: "integrations-1",
    title: "Integrations", 
    description: "View/Create API Integrations", 
    component: <ListIntegrationTab />
  },
  { 
    id: "integrations-2",
    title: "Domains", 
    description: "View/Create API domains assigned to each integration",
    component: ''
  },
  { 
    id: "integrations-3",
    title: "Endpoints", 
    description: "View/Create API endpoints for each integration",
    component: ''
  },
]

export default function IntegrationsPage() {
  const [currentTab, setCurrentTab] = useState(sideBar[0])

  return (
    <>
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">

          {/* Side Bar */}
          <div className="md:col-span-1 flex flex-col justify-start pr-2 border-r">
            { sideBar.map((item) => (
              <button key={item.id} className={classNames(
                item.title == currentTab.title ? 'bg-indigo-100 text-white' : 'text-indigo-100 hover:bg-indigo-100 hover:text-white',
                'group w-full p-3 rounded-md flex flex-col text-xs font-medium',
                "py-5 mb-2 text-left border"
              )} onClick={() => {setCurrentTab(item)}}>
                <h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">{item.title}</h3>
                <div className="mt-1 text-sm text-gray-500">
                  <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
                </div>
              </button>
            ))}
          </div>

          {/* Current Tab Screen */}
          {currentTab.component}
        </div>
      </div>
    </>
  )
}
