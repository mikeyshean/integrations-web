import { ApiError } from 'api/errors'
import { API_ERROR } from '../../constants'

const API_HOST = process.env.API_HOST || ''
const API_TOKEN = process.env.API_TOKEN


export async function fetcher(
  input: RequestInfo,
  {
    method,
    data
  }: {
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    data?: string | object | null
  } = {method: "GET", data: null}
) {
  const url = API_HOST + input
  if (data && typeof data === "object") {
    data = JSON.stringify(data)
  }
  const response = await fetch(url, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Token ${API_TOKEN}`,
    },
    method: method,
    body: data
  })

  if (response.ok) {
    if (method === "DELETE") {
      return true
    }
    return await response.json()
  } else {
    switch (response.status) {
      case 500:
        throw new Error("Http 500: Internal Server Error")
      case 401:
        throw new Error("Http 401: Session Expired")
      case 422:
        const err = await response.json()
        // TODO: Handle API error codes here
        if (err['api_error_code'] == 1) {
          throw new ApiError(response.status, "Unique or duplicate error", API_ERROR.UNIQUE_OR_REQUIRED_FIELD)
        }
        throw new Error("Http 422: Unprocessable Entity")
      default:
        throw new Error("Network Error")
    }
  }
} 