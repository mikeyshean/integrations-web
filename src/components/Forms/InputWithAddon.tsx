import { classNames } from "../utils";

export function InputWithAddon(
  { isValid, onChange, placeholder, value, describedBy, name, addon, label, children }:
  { 
    isValid: boolean,
    onChange: (value: string) => void,
    placeholder: string,
    describedBy: string,
    name: string,
    addon: string,
    label: string,
    value: string,
    children?: React.ReactNode
  }) {
  
  return (
    <div className='mt-5'>
      <label htmlFor="integration-domain" className="block text-sm font-medium text-indigo-900">
        {label}
      </label>

      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
          {addon}
        </span>
        
        <input
          type="text"
          name={name}
          id={name}
          className={classNames("block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          isValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
          )}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid="true"
          value={value}
          aria-describedby={describedBy}
        />
      </div>
      {children}
    </div>
  )
}