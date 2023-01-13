import { fetcher } from "./fetcher";
import { useMutation } from '@tanstack/react-query'
import { ModelSchema } from '../schema/models'


export const jsonMapperRouter =  {
  useCreateModelFromJson: () => {
    const mutationFn = async (data: {json: string, modelName: string, endpointId: number}) => {
      const postData = { json: data.json, model_name: data.modelName, endpoint_id: data.endpointId }
      try {
        const response = await fetcher('/api/mappers/json/model-from-payload', {method: "POST", data: postData})
        return ModelSchema.parse(response)
      } catch (err) {
        throw new Error("JSON Create Model API Error")
      }
    }
    return useMutation({ mutationKey: ['json-mapper/models'], mutationFn: mutationFn })
  },
}


