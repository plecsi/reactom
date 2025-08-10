import { generateAuthApi, generateEntityApi } from '../../store/api';
import { UserProfile, UserProfileInput } from './types';

export const userApi = generateAuthApi();
