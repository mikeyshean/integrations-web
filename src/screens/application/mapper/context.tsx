import { EmptySelectItem, SelectItem } from '@/components/Forms/Select';
import { createContext, useContext, useState } from 'react';


type MapperContextValues = {
  ctxCategory: SelectItem,
  setCtxCategory: (item: SelectItem) => void
  ctxSourceModel: SelectItem,
  setCtxSourceModel: (item: SelectItem) => void
  ctxTargetModel: SelectItem,
  setCtxTargetModel: (item: SelectItem) => void
  ctxEndpoint: SelectItem,
  setCtxEndpoint: (item: SelectItem) => void
  ctxIntegration: SelectItem,
  setCtxIntegration: (item: SelectItem) => void
}

const MapperContext = createContext({} as MapperContextValues);

export function MapperProvider({ children }: { children: React.ReactNode }) {
  const [ ctxCategory, setCtxCategory ] = useState<SelectItem>(EmptySelectItem)
  const [ ctxSourceModel, setCtxSourceModel ] = useState<SelectItem>(EmptySelectItem)
  const [ ctxTargetModel, setCtxTargetModel ] = useState<SelectItem>(EmptySelectItem)
  const [ ctxEndpoint, setCtxEndpoint ] = useState<SelectItem>(EmptySelectItem)
  const [ ctxIntegration, setCtxIntegration ] = useState<SelectItem>(EmptySelectItem)

  return (
    <MapperContext.Provider value={{ 
      ctxCategory,
      setCtxCategory,
      ctxSourceModel,
      setCtxSourceModel,
      ctxTargetModel,
      setCtxTargetModel,
      ctxEndpoint,
      setCtxEndpoint,
      ctxIntegration,
      setCtxIntegration
    }}>
      {children}
    </MapperContext.Provider>
  );
}

export function useMapperContext() {
  return useContext(MapperContext);
}