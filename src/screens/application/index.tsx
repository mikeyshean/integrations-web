import { Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  WrenchScrewdriverIcon,
  Squares2X2Icon,
  BeakerIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import mapperImage from "../../images/logos/apimapper.png"
import Image from 'next/image'
import IntegrationsPage from './integrations'
import { useAuthContext } from '@/context/AuthContext'
import AppHome from './Home'
import { ModelsPage } from './models'
import { classNames } from '../../components/utils'

const sidebarNavigation = [
  { name: 'Integrations', href: '#', icon: Squares2X2Icon, current: false },
  { name: 'Models', href: '#', icon: Squares2X2Icon, current: false },
  { name: 'Mapper', href: '#', icon: WrenchScrewdriverIcon, current: true },
  { name: 'Test', href: '#', icon: BeakerIcon, current: false },
  { name: 'Sign out', href: '#', icon: ArrowLeftOnRectangleIcon, current: false },
]

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('Home')
  const { logoutUser } = useAuthContext()

  useEffect(() => {
    if (currentTab == "Sign out") {
      logoutUser()
    }
    sidebarNavigation.forEach((tab) => {
      if (tab.name === currentTab) {
        tab.current = true
      } else {
        tab.current = false
      }
    })
  }, [currentTab, logoutUser])

  return (
    <>
      <div className="flex h-full">
        {/* Narrow sidebar */}
        <div className="hidden w-28 overflow-y-auto bg-indigo-700 md:block">
          <div className="flex w-full h-full flex-col items-center py-6">
            <div className="w-full space-y-1 px-2">
              <button className={classNames(
                   currentTab == "Home" ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                  )}>
                <Image src={mapperImage} priority alt="API Mapper" height={50}  onClick={() => { setCurrentTab("Home") }}/>
              </button>
            </div>

            {/* Sidebar Navigation */}

            <div className="mt-6 w-full flex flex-col h-full space-y-1 px-2">
              {sidebarNavigation.map((item, itemIdx) => (
                <div key={item.name} className={itemIdx == sidebarNavigation.length - 2 ? "flex-grow" : ""}>
                  <button
                    onClick={() => { setCurrentTab(item.name) }}
                    className={classNames(
                      item.name == currentTab ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                      'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                    )}
                    aria-current={item.name == currentTab ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.name == currentTab ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                        'h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    <span className="mt-2">{item.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20 md:hidden" onClose={setMobileMenuOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <Image src={mapperImage} priority alt="API Mapper" height={50}  onClick={() => { setCurrentTab("Home") }}/>
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                    <nav className="flex h-full flex-col">
                      <div className="space-y-1">
                        {sidebarNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.name == currentTab
                                ? 'bg-indigo-800 text-white'
                                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                              'group py-2 px-3 rounded-md flex items-center text-sm font-medium'
                            )}
                            aria-current={item.name == currentTab ? 'page' : undefined}
                          >
                            <item.icon
                              className={classNames(
                                item.name == currentTab ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                                'mr-3 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          

          {/* Main content */}
          <div className="flex flex-1 items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto pt-1">
              {/* Primary column */}
              <section aria-labelledby="primary-heading" className="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                <h1 id="primary-heading" className="sr-only">
                  Photos
                </h1>
                { currentTab == "Integrations" && <IntegrationsPage />}
                { currentTab == "Home" && <AppHome />}
                { currentTab == "Models" && <ModelsPage />}
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            {/* <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white lg:block"> */}
              {/* Content */}
            {/* </aside> */}
          </div>
        </div>
      </div>
    </>
  )
}
