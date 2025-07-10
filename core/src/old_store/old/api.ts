import { apiGet } from '../api/apiServices';
import { Data } from './types';

function fetchDataApi(): Promise<Data[]> {
  return apiGet<Data[]>('/data');
}

export default fetchDataApi;
