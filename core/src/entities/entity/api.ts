import { create } from 'apisauce';
import { Entity, EntityDisplayContext, EntityEditContext } from './types';

// Alapértelmezett API kliens létrehozása
const apiClient = create({
  baseURL: process.env.API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// API válasz típusok
interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

/**
 * Entitás API generátor függvény
 *
 * @param options - API konfigurációs opciók
 * @returns - Entitás CRUD műveleteire specializált API függvények
 */
export const generateEntityApi = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TValidate extends boolean = false,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TIncludeDisplayContext extends boolean = false,
  TEditContext extends EntityEditContext = EntityEditContext,
  TIncludeEditContext extends boolean = false
>(options: {
  path: string;
  validate?: TValidate;
  includeDisplayContext?: TIncludeDisplayContext;
  includeEditContext?: TIncludeEditContext;
}) => {
  const { path, validate = false, includeDisplayContext = false, includeEditContext = false } = options;

  return {
    // Listázás
    getList: async (params?: any): Promise<ApiResponse<{ items: T[]; total: number }>> => {
      try {
        const response = await apiClient.get(`${path}`, params);
        return {
          data: response.data,
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
    getById: async (id: ID): Promise<ApiResponse<T>> => {
      try {
        const response = await apiClient.get(`${path}/${id}`);
        return {
          data: response.data,
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

    // Megjelenítési kontextus lekérése
    ...(includeDisplayContext ? {
      getDisplayContext: async (id: ID): Promise<ApiResponse<TDisplayContext>> => {
        try {
          const response = await apiClient.get(`${path}/${id}/display-context`);
          return {
            data: response.data,
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
            data: response.data,
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

    // Új elem létrehozása
    create: async (data: TInput): Promise<ApiResponse<T>> => {
      try {
        const url = validate ? `${path}/validate` : path;
        const response = await apiClient.post(url, data);
        return {
          data: response.data,
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
    update: async (id: ID, data: TInput): Promise<ApiResponse<T>> => {
      try {
        const url = validate ? `${path}/${id}/validate` : `${path}/${id}`;
        const response = await apiClient.put(url, data);
        return {
          data: response.data,
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
    patch: async (id: ID, data: Partial<TInput>): Promise<ApiResponse<T>> => {
      try {
        const url = validate ? `${path}/${id}/validate-patch` : `${path}/${id}`;
        const response = await apiClient.patch(url, data);
        return {
          data: response.data,
          status: response.status || 200,
          ok: response.ok || true,
        };
      } catch (error: any) {
        throw {
          message: error.message || 'Hiba történt az elem részleges frissítése során',
          status: error.status || 500,
          data: error.data,
        } as ApiError;
      }
    },

    // Elem törlése
    delete: async (id: ID): Promise<ApiResponse<void>> => {
      try {
        const response = await apiClient.delete(`${path}/${id}`);
        return {
          data: response.data,
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
