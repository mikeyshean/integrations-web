import { useRef, useState } from "react";
import { Button } from "../Button";
import { JSONEditor } from "./json-editor/JsonEditor";

export function Models() {
  const jsonRef = useRef<string>('')
  const [isValidJson, setIsValidJson] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updateJsonRef = (json: string) => {
    jsonRef.current = json
  }
  
  const updateIsValidJson = (isValid: boolean) => {
    setIsValidJson(isValid)
  }

  const handleCreateModel = () => {
    setIsLoading(true)
    alert(jsonRef.current)
    setIsLoading(false)
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Models</h1>
          <p className="mt-2 text-sm text-gray-700">
            Define a new API Model
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button buttonText="Create Model from JSON" isLoading={isLoading} onClick={handleCreateModel} isDisabled={!isValidJson}/>
        </div>
      </div>
      <div className="pt-10">
        <JSONEditor updateJsonRef={updateJsonRef} updateIsValidJson={updateIsValidJson} />
      </div>
    </div>
  )
}