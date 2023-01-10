const API_HOST = process.env.API_HOST || ''
const API_TOKEN = process.env.API_TOKEN


export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
) {
  const url = API_HOST + input
  try {
    
    const response = await fetch(url, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      }
    })

    if (response.ok) {
      return response.json()
    } else {
      switch (response.status) {
        case 500:
          console.log('Internal server error');
          break;
        case 401:
          console.log('Session expired');
          break;
        default:
          console.log('Some error occured');
          break;
      }
    }
  } catch (err) {
    console.log(err)
  }    
} 