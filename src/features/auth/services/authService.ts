import api from '@/lib/axios';
import {LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, FormField, User } from '@/types/auth.types';
import { AUTH_ENDPOINTS } from '@/lib/constants';

// Logica relacionada para la autenticacion del usuario
class AuthService {
    // Obtener campos del formulario de login este es una proimesa que retornara una lista de objetos
    async getLoginFields(): Promise<FormField[]> {
        // Hacemos una peticion para obtener 
        const response = await api.get(AUTH_ENDPOINTS.LOGIN);
        return response.data.fields;
    }

    // Obtener campos del formulario de registro
    async getRegisterFields(): Promise<FormField[]> {
        // Hacemos una peticion para obtener los campos del formulario
        const response = await api.get(AUTH_ENDPOINTS.REGISTER);
        // retornamos la informacion
        return response.data.fields;
    }

    // Inicio de sesion
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        // Hacemos una peticion para iniciar sesion
        const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
        // Retornamos la informacion
        return response.data;
    }

    // Registrar usuario
    async register(userData: RegisterRequest): Promise<RegisterResponse> {
        // Hacemos la peticion para registrar a un usuario
        const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
        // Retornamos la informacion
        return response.data;
    }

    // Renovar token
    async refreshToken(refreshToken: string): Promise<{ access: string }> {
        const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
        refresh: refreshToken,
        });
        return response.data;
    }

    // Cerrar sesión
    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
            try {
                await api.post(AUTH_ENDPOINTS.LOGOUT, { refresh: refreshToken });
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }
        
        // Limpiar tokens del localStorage independientemente del resultado
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    // Peticion que nos permite obtenmer la informacion del usuario
    async getUserInfo(access: string): Promise<User> {
        try {
            const response = await api.get(AUTH_ENDPOINTS.MYINFO, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            return response.data as User;
        } catch (error) {
            throw error;
        }
    }
}

// Indicamos que podemos exportar esas funciones y peticiones
export const authService = new AuthService();