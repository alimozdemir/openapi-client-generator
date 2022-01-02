import axios from 'axios';

export async function getJSON(url: string) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  })
  return response.data;
}