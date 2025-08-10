import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProfileRequest,
  updateProfileRequest,
  userSliceKey,
} from './user.slice';
import { logoutRequest } from './auth.slice';
import userReducer from './user.slice';
import { selectUserProfile } from './user.selectors';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { userSaga } from './user.saga';
import { useCallback } from 'react';

export const useUser = () => {
  useInjectReducer({ key: userSliceKey, reducer: userReducer });
  useInjectSaga({ key: userSliceKey, saga: userSaga });

  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);

  const fetchProfile = (payload?: { userId?: string }) =>
    dispatch(fetchProfileRequest(payload as any));

  const updateProfile = (payload: {
    userId: string;
    twoFactorEnabled: boolean;
  }) => dispatch(updateProfileRequest(payload));

  const logout = useCallback(()=>{
    dispatch(logoutRequest());
  }, [dispatch]);

  return { profile, fetchProfile, updateProfile, logout };
};
