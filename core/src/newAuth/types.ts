
export interface AuthState {
  isLoggedIn: boolean;
  user?: { id: string; email?: string };
  loading: boolean;
  error?: string;
  isAuthResolved: boolean;
  csrfToken: string;
}
export interface UserProfile {
  id: string;
  name: string;
  is2FaEndable: boolean;
}