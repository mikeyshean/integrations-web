import { SelectItem } from "@/components/Forms/Select";
import { useState } from "react";
import SourceModelForm from "./SourceModelForm";

export default function MapperPage() {
  const [modelItem, setModelItem ] = useState<SelectItem>({key: 0, value: ''})
  
  return (
    <div className="flex flex-col sm:flex-row flex-start overflow-hidden h-full">
      <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
        <div className="h-full flex flex-col flex-start rounded-lg border-2 border-dashed border-gray-200">
          
          {/* Top Form */}
          <SourceModelForm onChange={setModelItem}/>
          
          
          
          {/* Bottom Table */}
          <div className="flex-grow border">
            {modelItem.value}
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
        <div className="h-full rounded-lg border-2 border-dashed border-gray-200">
          Section 2
        </div>
      </div>
    </div>
  )
}