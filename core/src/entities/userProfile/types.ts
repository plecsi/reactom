import { Entity } from '../../store/types';

export interface UserProfile extends Entity {
  name: string;
  email: string;
}