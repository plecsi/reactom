import { Entity } from '../../store/types';

export interface User extends Entity{
  user:UserProfile;
}

export interface UserProfile extends Entity {
  name: string;
  password: string;
  requires2FA: boolean;
}

export interface UserProfileInput {}

export interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
}