import { create } from 'apisauce';
import { Entity, EntityDisplayContext, EntityEditContext } from './types';
import store from './store';
import apiClient from '../newAuth/apiClient';

/*const apiClient = create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // fontos: sütik menjenek
});

// Biztosítjuk, hogy axios szinten is menjen a withCredentials
apiClient.axiosInstance.defaults.withCredentials = true;

// CSRF token automatikus hozzáadása minden kéréshez
apiClient.addRequestTransform((request) => {
  const state = store.getState();
  const csrfToken = state.auth?.csrfToken;
  if (csrfToken) {
    request.headers['x-csrf-token'] = csrfToken;
  }
});*/

// API válasz típusok
export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
  problem?: string;
}
export const generateLoginApi = () => {
  const handleApiError = (error: any): never => {
    const apiError: ApiError = {
      message: error?.message || 'Hiba történt a bejelentkezés során',
      status: error?.status || 500,
      data: error?.data,
      problem: error?.problem,
    };
    throw apiError;
  };

  return {
    login: async (username: string, password: string, totp?: string) => {
      try {
        const response = await apiClient.post('auth/login', {
          username,
          password,
          totp,
        });

        if (response.ok) {
          return {
            data: response.data,
            status: response.status || 200,
            ok: true,
          };
        } else {
          throw {
            message: response.data?.error || 'Hibás felhasználónév vagy jelszó',
            status: response.status,
            data: response.data,
            problem: response.problem,
          };
        }
      } catch (error) {
        handleApiError(error);
      }
    },
    silentRefreshApi: async ()=> {
      try {
        const response = apiClient.post('/auth/silent-refresh', {}, { withCredentials: true });
        console.log('Silent refresh response:', response);
      } catch (error: any) {

      }
    },
    verify2FA: async (
      tempToken: string,
      code: string
    ): Promise<ApiResponse<{ token: string }>> => {
      try {
        const response = await apiClient.post(
          '/2fa/verify',
          { tempToken, code },
        );
        if (response.ok) {
          return {
            data: response.data as { token: string },
            status: response.status || 200,
            ok: response.ok || true,
          };
        }
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt a 2FA ellenőrzése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    refreshAccessToken: async (
      refreshToken: string
    ): Promise<ApiResponse<{ token: string }>> => {
      try {
        const response = await apiClient.post(
          '/token/refresh',
          { refreshToken },
        );
        return {
          data: response.data as { token: string },
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message:
            error.message ||
            'Hiba történt a hozzáférési token frissítése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    logout: async (refreshToken: string): Promise<ApiResponse<void>> => {
      try {
        const response = await apiClient.post(
          '/logout',
          { refreshToken }, // elküldjük a refresh tokent a body-ban

        );
        return {
          data: response.data as void,
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt a kijelentkezés során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    updateUser: async (
      id: string | number,
      code: string[]
    ): Promise<ApiResponse<{ token: string }>> => {

      const data = Object.assign(code, { id });
      console.log('API', data);
      try {
        const response = await apiClient.post(
          '/user/update',
          data,
        );
        return {
          data: response.data as { token: string },
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt a 2FA ellenőrzése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },
  };
};

export const generateMyAccountApi = () => {
  return {
    getUser: async (action): Promise<ApiResponse<any>> => {
      try {
        const response = await apiClient.get('user', action);
        if (response.ok) {
          return {
            data: response.data as { token: string },
            status: response.status || 200,
            ok: response.ok || true,
          };
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    updateUser: async (
      id: string | number,
      code: string[]
    ): Promise<ApiResponse<{ token: string }>> => {

      const data = Object.assign(code, { id });
      console.log('API', data);
      try {
        const response = await apiClient.post(
          '/user/update',
          data,
        );
        return {
          data: response.data as { token: string },
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt a 2FA ellenőrzése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },
  };
};

export const generateAuthApi = () => {
  return {
    ...generateLoginApi(),
    ...generateMyAccountApi(),
  };
};

/**
 * Entitás API generátor függvény
 *
 * @param options - API konfigurációs opciók
 * @returns - Entitás CRUD műveleteire specializált API függvények
 */
export const generateEntityApi = <
  ID extends string | number = number | string,
  Item extends Entity<ID> = Entity<ID>,
  ItemInput = Partial<Item>,
  Validate extends boolean = false
  /* TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TIncludeDisplayContext extends boolean = false,
  TEditContext extends EntityEditContext = EntityEditContext,
  TIncludeEditContext extends boolean = false*/
>(options: {
  path: string;
  validate?: Validate;
  //includeDisplayContext?: TIncludeDisplayContext;
  // includeEditContext?: TIncludeEditContext;
}) => {
  const {
    path,
    validate = false /*includeDisplayContext = false, includeEditContext = false*/,
  } = options;

  return {
    // Listázás
    getList: async (
      params?: never
    ): Promise<ApiResponse<{ items: Item[]; total: number }>> => {
      try {
        const response = await apiClient.get(`${path}`, params);
        return {
          data: response.data as { items: Item[]; total: number },
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt a listázás során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    // Egy elem lekérése
    getById: async (id: ID): Promise<ApiResponse<Item>> => {
      try {
        const response = await apiClient.get(`${path}/${id}`);
        return {
          data: response.data as Item,
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt az elem lekérése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    /*Megjelenítési kontextus lekérése
    ...(includeDisplayContext ? {
      getDisplayContext: async (id: ID): Promise<ApiResponse<TDisplayContext>> => {
        try {
          const response = await apiClient.get(`${path}/${id}/display-context`);
          return {
            data: response.data as TDisplayContext,
            status: response.status || 200,
            ok: response.ok || true,
          };
        } catch (error: any) {
          throw {
            message: error.message || 'Hiba történt a megjelenítési kontextus lekérése során',
            status: error.status || 500,
            data: error.data,
          } as ApiError;
        }
      },
    } : {}),

    // Szerkesztési kontextus lekérése
    ...(includeEditContext ? {
      getEditContext: async (id: ID): Promise<ApiResponse<TEditContext>> => {
        try {
          const response = await apiClient.get(`${path}/${id}/edit-context`);
          return {
            data: response.data as TEditContext,
            status: response.status || 200,
            ok: response.ok || true,
          };
        } catch (error: any) {
          throw {
            message: error.message || 'Hiba történt a szerkesztési kontextus lekérése során',
            status: error.status || 500,
            data: error.data,
          } as ApiError;
        }
      },
    } : {}),
    */

    // Új elem létrehozása
    create: async (data: ItemInput): Promise<ApiResponse<Item>> => {
      try {
        const url = validate ? `${path}/add` : path;
        const response = await apiClient.post(url, data);
        return {
          data: response.data as Item,
          status: response.status || 201,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt az elem létrehozása során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    // Elem frissítése
    update: async (id: ID, data: ItemInput): Promise<ApiResponse<Item>> => {
      try {
        const url = validate ? `${path}/${id}` : `${path}/${id}`;
        const response = await apiClient.post(url, data);
        return {
          data: response.data as Item,
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt az elem frissítése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    // Elem részleges frissítése
    patch: async (
      id: ID,
      data: Partial<ItemInput>
    ): Promise<ApiResponse<Item>> => {
      try {
        const url = validate ? `${path}/${id}/validate-patch` : `${path}/${id}`;
        const response = await apiClient.patch(url, data);
        return {
          data: response.data as Item,
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message:
            error.message || 'Hiba történt az elem részleges frissítése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    // Elem törlése
    delete: async (id: ID): Promise<ApiResponse<Item>> => {
      console.log('API:', id);
      try {
        const response = await apiClient.delete(`${path}/${id}`);
        return {
          data: response.data as Item,
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt az elem törlése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },
  };
};
