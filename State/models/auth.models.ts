export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    user: UserAuth | null;
    tienda: TiendaAuth | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    loadSession: () => Promise<void>;
}
export interface UserAuth {
    id: number;
    username: string;

    first_name?: string;
    last_name?: string;

    photo_url?: string;

    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    es_empleado: boolean;
    desactivate_account: boolean;

    tienda: number | null;

    date_joined: string;
    date_created: string;
    last_login: string | null;

    groups: any[];
    permissions: Record<string, boolean>;
    user_permissions: number[];
}
export interface TiendaAuth {
    id: number;
    nombre: string;
    razon_social?: string | null;
    ruc?: string | null;

    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;

    logo_img?: string | null;

    activo: boolean;
    is_deleted: boolean;

    date_created: string;

}