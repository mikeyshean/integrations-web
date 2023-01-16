import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { classNames } from '@/components/utils'
import { Field } from 'api/schema/models'
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function StackedCards({ fields, onClick }: { fields: Field[], onClick: ({id, name}: {id: number, name: string }) => void }) {
  const [selected, setSelected] = useState<Field>(fields[0])

  return (
    <RadioGroup value={selected} onChange={setSelected} className="overflow-y-auto">
      <RadioGroup.Label className="sr-only"> Server size </RadioGroup.Label>
      <div className="space-y-4">
        {fields.map((field) => (
          <RadioGroup.Option
            key={'field-'+field.id}
            value={field.name}
            className={({ checked, active }) =>
              classNames(
                checked ? 'border-transparent' : 'border-gray-300',
                active ? 'border-indigo-500 ring-2 ring-indigo-500' : '',
                'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between m-2'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span className="flex items-center w-1/4">
                  <span className="flex flex-col text-sm">
                    <RadioGroup.Description as="span" className="text-gray-500">
                      <span className="block">
                        {field.type} { field.type === "LIST" ? ' ['+field.listItemType+']' : ''}
                      </span>
                      <span className="block">{field.objectModel?.name}</span>
                    </RadioGroup.Description>
                    
                  </span>
                </span>

                <span className="flex items-center justify-center w-1/2">
                  <RadioGroup.Label as="span" className="font-medium text-gray-800">
                    {field.name} {field.objectModel?.id ? <ChevronDownIcon onClick={() => onClick( field.objectModel!) } className="h-5 w-5 text-indigo-700 inline" aria-hidden="true" /> : ''}
                  </RadioGroup.Label>
                </span>


                <RadioGroup.Description
                  as="span"
                  className="mt-2 flex w-1/4 text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right"
                >
                  <span className="font-medium text-gray-900">{'Mapped to: '}</span>
                </RadioGroup.Description>
                <span
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-indigo-500' : 'border-transparent',
                    'pointer-events-none absolute -inset-px rounded-lg'
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
        {/* Spacer when scrolled */}
        <div/>
      </div>
    </RadioGroup>
  )
}
