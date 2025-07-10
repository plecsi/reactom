import { apiGet } from '../../api/apiServices';
import { Language } from './types';

const fetchLanguageApi = (): Promise<Language[]> =>{
  return apiGet<Language[]>('/data');
}

export default fetchLanguageApi;