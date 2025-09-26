'use client'
import axios from "axios";
import Image from "next/image"
import { useRef, useState } from "react";
import {VerifyAccountProps, NewPassword} from '@/types/auth.types'
import { useRouter } from "next/navigation";
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from "@/lib/constants";
// Funcion para verificar la cuenta recibe como parametro el email del usuario y la ruta del ENDPOINT 
const ChanguePassword = ({ email, URL}: VerifyAccountProps) => {
    const {logout} = useAuth()
    const access = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    const router = useRouter();
    // Funcion que actualiza el estadoi del codigo
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [form, setForm] = useState({
        new_password: '',
        new_password2: '',
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    // Funcion que actualiza el estado de los mensajes
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // Guardara una array de inputs
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    // L afuncion se ejecutara cuando cambia de inpurt
    const handleChange = (idx: number, value: string) => {
        // Verifica que el input solo reciba 1 digito y un numero
        if (!/^[0-9]?$/.test(value)) return;
        // Actualiza el valor de la array
        const newCode = [...code];
        // Esvribe el valor en el inpurt asociado
        newCode[idx] = value;
        // Actualiza el estado
        setCode(newCode);
        setError("");
        // Auto-focus siguiente
        if (value && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Se hace una copia del formulario y se actualiza con lso cambios echos por el usuario
        setForm({ ...form, [e.target.id]: e.target.value });
        // Limpiamos los mnesajes 
        setError("");
        setSuccess("");
    };


    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Verifica el tipo de letra
        if (e.key === "Backspace") {
            // Verifica si el input que esta focus tiene algun valor
            if (code[idx]) {
                // Si hay valor, solo lo borra
                const newCode = [...code];
                // De ser asi lo limpia
                newCode[idx] = "";
                // Actualiza el estado
                setCode(newCode);
            } else if (idx > 0) {
                // Si está vacío, borra el anterior y mueve el foco
                const newCode = [...code];
                newCode[idx - 1] = "";
                setCode(newCode);
                inputsRef.current[idx - 1]?.focus();
            }
        }
    };

    // Funcion que se ejecutara a la hora de enviar el codigo
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        // Evitamso que el formulario pierda la data
        e.preventDefault();
        // Obtenemos el codigo en uno solo
        const fullCode = code.join("");
        // Verificamso que se envien los seis dijitos
        if (fullCode.length !== 6) {
            setError("Debes ingresar los 6 dígitos del código");
            return;
        }

        // Almacenamos la data
        const data: NewPassword ={
            new_password: form.new_password,
            new_password2: form.new_password2,
            email: email,
            code : Number(fullCode)
        }

        try {
            // Hacemos la peticion
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_UR}${URL}`, data,{
                headers: {
                    "Authorization": `Bearer ${access}`,
                     "Content-Type": "application/json" }
            })
            // verificamos que tengamos lso tokens
            if (access && refresh) {
                // cerramos sesion 
                await logout()
            }
            // redirigimos al usuario al login
            router.push(ROUTES.CHANGUEPASSWORD)
        } catch (error: any) {
            if(error.response?.data){
                const apiErrors = error.response.data
                if(apiErrors.error){
                    setError('Código inválido o expirado.')
                }
            } else {
                setError("No se pudo conectar con el servidor");
            }
        }
    };

    // 
    
    // Retornamos componente XML
return(
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
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 dark:bg-orange-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-wide text-gray-800 dark:text-white transition-colors duration-300">
                    Recuperar Contraseña
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-center text-sm">
                    Verifica tu código y crea una nueva contraseña
                </p>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-400 rounded-full"></div>
            </div>

            {/* Code Verification */}
            <div className="flex flex-col items-center gap-6 mb-8">
                <div className="text-center">
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4 block">
                        Código de verificación
                    </label>
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="text-green-700 dark:text-green-300 font-semibold text-sm">{email}</span>
                    </div>
                </div>

                <div className="flex gap-2 justify-center">
                    {code.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => { inputsRef.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl font-bold border-2 border-green-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 focus:border-orange-400 dark:focus:border-orange-500 outline-none bg-green-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                            value={digit}
                            onChange={e => handleChange(idx, e.target.value)}
                            onKeyDown={e => handleKeyDown(idx, e)}
                        />
                    ))}
                </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-6 mb-6">
                {/* New Password */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="new_password" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Nueva Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="new_password"
                            placeholder="Ingresa tu nueva contraseña"
                            value={form.new_password}
                            onChange={handleChangePassword}
                            className="w-full rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none"
                            tabIndex={-1}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="new_password2" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword2 ? "text" : "password"}
                            id="new_password2"
                            placeholder="Confirma tu nueva contraseña"
                            value={form.new_password2}
                            onChange={handleChangePassword}
                            className="w-full rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword2((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none"
                            tabIndex={-1}
                            aria-label={showPassword2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword2 ? (
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</span>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Recuperar Contraseña</span>
            </button>
        </form>
    </div>
)
}

export default ChanguePassword