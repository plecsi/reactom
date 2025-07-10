import { UserProfile } from './types';
import { generateEntityApi } from '../../store/utils/api';
import { apiGet } from '../../api/apiServices';

//<UserProfile['id'], UserProfile, false>

/*const fetchUserProfileApiOptions = generateEntityApi({
  path: 'data',
  includeDisplayContext: true,
  includeEditContext: true,
  validate: true,
})*/

const fetchUserProfileApi = (): Promise<UserProfile[]> => {
  return apiGet<UserProfile[]>('users');
};

//export const fetchUserProfileApi = fetchUserProfileApiOptions;
export default fetchUserProfileApi;
