import { z } from 'zod'

const API_HOST = process.env.API_HOST || ''
const API_TOKEN = process.env.API_TOKEN


export async function fetcher(
  input: RequestInfo,
  {
    method,
    data
  }: {
    method: "POST" | "GET" | "PUT",
    data: string | object | null
  } = {method: "GET", data: null}
) {
  const url = API_HOST + input
  try {
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
      return await response.json()
    } else {
      switch (response.status) {
        case 500:
          console.log('Internal server error');
          break;
        case 401:
          console.log('Session expired');
          break;
        default:
          console.log('Unknown error occured');
          break;
      }
    }
  } catch (err) {
    console.log(err)
  }    
} 