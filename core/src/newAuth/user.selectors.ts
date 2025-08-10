import { RootState } from '../store/types';

export const selectUserProfileLoaded = (state: RootState) => state?.user.loaded;
export const selectUserProfile = (state: any) => state.user?.profile ?? null;

