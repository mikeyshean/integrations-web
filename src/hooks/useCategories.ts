import useSWR from 'swr'
import fetcher from './fetcher'
import { z } from "zod";

const CatogorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number()
})

const CatogoriesSchema = z.array(CatogorySchema)


export default function useCategories() {
  const { data, isLoading, error } = useSWR('/api/integrations/categories', fetcher)
  const result = CatogoriesSchema.safeParse(data)

  return {
    categories: result.success ? result.data : null,
    isLoading,
    isError: error,
  }
}