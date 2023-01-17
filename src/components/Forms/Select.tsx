import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { classNames } from "../utils";


export type SelectItem = {key: string|number, value: string }
export const EmptySelectItem = {key: 0, value: '' }

export function Select(
  { selected, onChange, items, name, isValid = true, children }:
  {
    selected: SelectItem,
    onChange: (item: SelectItem) => void,
    items: SelectItem[],
    name: string,
    isValid?: boolean,
    children?: React.ReactNode
  }) {
  
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium mt-5 text-indigo-900">{name}</Listbox.Label>
          <div className="relative mt-1">
          <Listbox.Button className={classNames(
            isValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
            "relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left sm:text-sm"
            )}>
            <span className={classNames(
                selected?.key ? "" : "text-gray-400", 
                isValid ? "" : "text-red-300",
                "block truncate")}>{selected?.value || "Select "+name }</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.key}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {item.value}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
          {children} 
        </>
      )}
    </Listbox>
  )
}