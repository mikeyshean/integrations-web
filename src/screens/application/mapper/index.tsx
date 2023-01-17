import { MapperProvider } from "./context";
import SourceModelPage from "./SourceModelPage";
import TargetModelPage from "./TargetModelPage";

export default function MapperPage() {
  return (
    <MapperProvider>
      <div className="flex flex-col sm:flex-row flex-start overflow-hidden h-full">
        <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
          <div className="h-full flex flex-col flex-start rounded-lg">
            <SourceModelPage/>
          </div>
        </div>
        <div className="w-full sm:w-1/2 h-full overflow-y-auto border border-gray-200 p-5">
          <div className="h-full flex flex-col flex-start rounded-lg">
            <TargetModelPage/>
          </div>
        </div>
      </div>
    </MapperProvider>
  )
}