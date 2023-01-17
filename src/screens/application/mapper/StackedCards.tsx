import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { classNames } from '@/components/utils'
import { Field } from 'api/schema/models'
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function StackedCards({ fields, onClick, isSource }: { fields: Field[], onClick: ({id, name}: {id: number, name: string }) => void, isSource: boolean }) {
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
              <div className='flex w-full'>
                
                <RadioGroup.Label as="span" className="w-1/4 flex flex-col text-gray-500">
                  <span className='pb-2'>Field</span>
                  <span className='font-medium text-gray-800'>
                    {field.name}
                  </span>
                </RadioGroup.Label>

                <RadioGroup.Description as="span" className="w-1/2 flex flex-col text-center text-gray-500">
                  <span className='pb-2'>Type</span>
                  <span className="font-medium text-gray-800">
                    {field.type} { field.type === "LIST" ? ' ['+field.listItemType+']' : ''}
                    {field.objectModel?.id ? <ChevronDownIcon onClick={() => onClick( field.objectModel!) } className="h-5 w-5 text-indigo-700 inline" aria-hidden="true" /> : ''}
                  </span>
                </RadioGroup.Description>


                <RadioGroup.Description
                  as="span"
                  className="flex w-1/4 sm:mt-0 sm:ml-4 sm:flex-col sm:text-right text-gray-500"
                >
                  <span className="pb-2">{isSource ? 'Target Field' : ''}</span>
                </RadioGroup.Description>
                <span
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-indigo-500' : 'border-transparent',
                    'pointer-events-none absolute -inset-px rounded-lg'
                  )}
                  aria-hidden="true"
                />
              </div>
            )}
          </RadioGroup.Option>
        ))}
        {/* Spacer when scrolled */}
        <div/>
      </div>
    </RadioGroup>
  )
}
