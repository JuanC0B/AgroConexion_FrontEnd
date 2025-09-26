'use client'
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation";
import {LostPassword} from '@/types/auth.types'
import Image from "next/image"
import { ROUTES } from "@/lib/constants";
const RecoverPassword =()=>{
    const URL = 'http://127.0.0.1:8000/api/users/password-reset/request/'
    const router = useRouter();
    const [form, setForm] = useState({
        email: ""
    })

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Se hace una copia del formulario y se actualiza con lso cambios echos por el usuario
        setForm({ ...form, [e.target.id]: e.target.value });
        // Limpiamos los mnesajes 
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Evitamso que el formulario pierda la data
        e.preventDefault();

        // Limpiamois los mensajes
        setError('')
        setSuccess('')

        // Indicamos la data que enviaremos
        const data: LostPassword = {
            email: form.email,
        }

        try {
            // Hacemos la peticion
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_UR}${URL}`, data, {
                headers: { "Content-Type": "application/json" }
            });
        
        // Mostramos mensaje por el Back
        setSuccess(response.data.message);
        // Redirigios al usuario a autenticar el usuario pasandole el email como parametro
        router.push(`${ROUTES.RECOREVYPASSWORD}?email=${encodeURIComponent(form.email)}`);
        } catch (error: any) {
            console.log("Error completo:", error);
            console.log("Error response:", error.response); 
            // Verificamos si la respuesta de error tienes alguno de los campos y retornamos elmensaje
            if (error.response?.data) {
                const apiErrors = error.response.data;
                if (apiErrors.error) {
                    setError("El correo no exite. Verifca que sea el correcto");
                }else {
                    setError("No se pudo conectar con el servidor");
                }
            }
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-gray-800/95 shadow-2xl rounded-3xl px-10 py-10 w-full max-w-md mx-auto backdrop-blur-sm border border-white/20 dark:border-gray-700/50 m-4">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    <Image
                        src='/AgroConexion.svg'
                        alt="Logo"
                        height={80}
                        width={80}
                        className="rounded-full border-4 border-green-300 dark:border-green-500 shadow-lg bg-white dark:bg-gray-700 transition-colors duration-300"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-wide text-gray-800 dark:text-white transition-colors duration-300">
                    Recuperar Contraseña
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-center text-sm">
                    Te ayudamos a recuperar tu cuenta
                </p>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-red-400 to-red-600 dark:from-red-500 dark:to-red-400 rounded-full"></div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6">
                {/* Email Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            placeholder="ejemplo@correo.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 focus:border-red-400 dark:focus:border-red-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm">
                            <p className="text-blue-800 dark:text-blue-300 font-semibold mb-1">
                                ¿Cómo funciona?
                            </p>
                            <ul className="text-blue-700 dark:text-blue-400 space-y-1 text-xs">
                                <li>• Te enviaremos un código de verificación</li>
                                <li>• Revisa tu bandeja de entrada y spam</li>
                                <li>• Ingresa el código para crear una nueva contraseña</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-green-600 dark:text-green-400 text-sm font-semibold">{success}</span>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Enviar Código de Recuperación</span>
                </button>

                {/* Back to Login */}
                <div className="text-center">
                    <button 
                        type="button" 
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center gap-2 mx-auto group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </form>
    </div>
)
}

export default RecoverPassword