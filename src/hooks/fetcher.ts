import { toast } from 'react-toastify';


const API_HOST = process.env.API_HOST || ''
const API_TOKEN = process.env.API_TOKEN


export default function fetcher<JSON = any>(
    input: RequestInfo,
    init?: RequestInit
) {
    const url = API_HOST + input
    return fetch(url, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Token ${API_TOKEN}`,
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            switch (response.status) {
                case 500:
                    console.log('Internal server error');
                    toast.error("Internal server error")
                    break;
                case 401:
                    console.log('Session expired');
                    toast.error("Session expired")
                    break;
                default:
                    console.log('Some error occured');
                    break;
            }
        }
    })
    .catch(error => {
        console.log(error);
        toast.error("Network error")
    });
} 