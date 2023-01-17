import SourceModelPage from "./SourceModelPage";

export default function MapperPage() {
  
  return (
    <div className="flex flex-col sm:flex-row flex-start overflow-hidden h-full">
      <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
        <div className="h-full flex flex-col flex-start rounded-lg">
          <SourceModelPage />
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