import { classNames } from "@/components/utils";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export function Input({ 
  name, value, label, isValid, onChange, placeholder, describedBy, children }: 
  { 
    name: string,
    value: string,
    label: string,
    isValid: boolean,
    onChange: (value: string) => void,
    placeholder?: string,
    describedBy?: string,
    children: React.ReactNode
  }) {
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-indigo-900 mt-5">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name={name}
          id={name}
          className={classNames(
            "block w-full rounded-md sm:text-sm", 
            isValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
          )}
          placeholder={placeholder}
          aria-invalid="true"
          aria-describedby={describedBy}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {!isValid && 
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        }
      </div>
      {children}
    </div>
  )
}