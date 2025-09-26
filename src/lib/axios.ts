// Axios permite hacer peticiones HTTP
import axios from 'axios';
import { error } from 'console';
// Libreria de notificaciones temporales
import { toast } from 'react-hot-toast';

// Componente API para hacer peticiones 
const api = axios.create({
    // Indicamos la URL base a la hora de hacer las peticiones
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // Informacion que enviararemos junto a la peticion
    headers: {
        // Tipo de forma en la que enviaremos y resiviremos los datos
        'Content-Type': 'application/json',
    }
})


// Funcion(INTERCEPTOR) para obtener el token del usuario en cada peticion
api.interceptors.request.use(
    // Funcion para agregar la autenticacion del usuario a la peticion
    (config)=>{
        // Obtenecion del token del usuario
        const token = localStorage.getItem('access_token')
        // Validacion del token
        if (token){
            // Si obtenemos el token del usuario le indicamos la autorizacion agregandola en el header de la solicitud
            config.headers.Authorization = `Bearer ${token}`
        }
        // Retornamos la configuracion
        return config
    },
    // En caso de que no obtengamos el token correctamente 
    (error)=>{
        // Retornamos mensaje de error
        return Promise.reject(error)
    }
)


// Funcion(INTERCEPTOR) para manejar errores de autenticación y refrescar el token del usuario
api.interceptors.response.use(
    // Si no hay ningún error, simplemente retornamos la respuesta sin modificarla
    (response) => response,

    // Si hay un error, ejecutamos esta función asincrónica
    async (error) => {
        // Obtenemos la configuración de la petición original
        const originalRequest = error.config;

        // Verificamos si el error es 401 (no autorizado) y si aún no hemos intentado reintentar la solicitud
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Marcamos que ya intentamos reintentar esta solicitud
            originalRequest._retry = true;

            try {
                // Obtenemos el refresh token almacenado en el localStorage
                const refreshToken = localStorage.getItem('refresh_token');

                // Si existe el refresh token, intentamos renovar el access token
                if (refreshToken) {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    console.log(response); // Para depuración

                    // Extraemos el nuevo access token de la respuesta
                    const { access } = response.data;

                    // Guardamos el nuevo access token en localStorage
                    localStorage.setItem('access_token', access);

                    // Añadimos el nuevo token a la cabecera Authorization de la petición original
                    originalRequest.headers.Authorization = `Bearer ${access}`;

                    // Reenviamos la petición original con el nuevo token
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Si el refresh token también ha expirado o falló, limpiamos los datos de sesión
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                // Redirigimos al usuario a la página de login
                // toast.error("⚠️ Tu sesión ha expirado. Por favor inicia sesión.");
            }
        }

        // Si no se pudo manejar el error, lo rechazamos para que sea manejado posteriormente
        return Promise.reject(error);
    }
);

// Exportamos la instancia de Axios para ser usada en otras partes del proyecto
export default api
