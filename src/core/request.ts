import axios from 'axios';

export async function getJSON(url: string) {
  const response = await axios.get(url);
  return response.data;
}