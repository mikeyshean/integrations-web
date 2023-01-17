import { classNames } from "./utils"

export type PageType = {
  id: number,
  name: string,
  idx: number,
}

export default function Breadcrumbs({ pages, onClick, currentPageId }: { pages: PageType[], onClick: (idx: number) => void, currentPageId: number }) {
  
  return (
    <nav className="flex bg-white" aria-label="Breadcrumb">
      <ol role="list" className="mx-auto flex w-full max-w-screen-xl space-x-4 pr-4 sm:pr-6 lg:pr-8">
        {pages.map((page, idx) => (
          <li key={page.id} className="flex">
            <div className="flex items-center">
              
              <button
                onClick={() => onClick(idx)}
                className={classNames(
                  idx === 0 ? "ml-4" : "",
                  "text-sm font-medium text-indigo-900 hover:text-indigo-500"
                )}
                aria-current={page.id === currentPageId ? 'page' : undefined}
              >
                {page.name}
              </button>
              { (idx === 0 || page.id !== currentPageId) && 
                <svg
                  className="h-full w-6 flex-shrink-0 text-indigo-300 "
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
              }
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
