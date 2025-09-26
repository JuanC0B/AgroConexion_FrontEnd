'use client'
import axios from "axios";
import Image from "next/image"
import { useRef, useState } from "react";
import {VerifyAccountProps, VerifyPayload} from '@/types/auth.types'
import { useRouter } from "next/navigation";
import { authService } from '@/features/auth/services/authService'
import { ROUTES } from "@/lib/constants";

// Funcion para verificar la cuenta recibe como parametro el email del usuario y la ruta del ENDPOINT 
const VerifyAccount = ({ email, URL }: VerifyAccountProps) => {
    const router = useRouter();
    // Funcion que actualiza el estadoi del codigo
    const [code, setCode] = useState(["", "", "", "", "", ""]);
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
        const data: VerifyPayload ={
            email: email,
            code : Number(fullCode)
        }

        try {
            // Hacemos la peticion
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_UR}${URL}`, data,{
                headers: { "Content-Type": "application/json" }
            })
             
            // verificamos que el usuario este inciando sesion
            if(response.data.access && response.data.refresh){
                // Guardamos los tokens en el local storage
                localStorage.setItem('access_token', response.data.access)
                localStorage.setItem('refresh_token', response.data.refresh)
                
                // Obtenemos los datos del usuario
                const user = await authService.getUserInfo(response.data.access);
                localStorage.setItem("user", JSON.stringify(user));
                // Redirigimos al home
                router.push(ROUTES.HOME)
            }else{
                // Redirigimos a el login
                router.push(ROUTES.LOGIN)
            }
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
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-wide text-gray-800 dark:text-white transition-colors duration-300">
                    Verificar Cuenta
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-center text-sm">
                    Confirma tu identidad para continuar
                </p>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400 rounded-full"></div>
            </div>

            {/* Verification Code Section */}
            <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4 block">
                        Ingresa el código de 6 dígitos enviado a
                    </label>
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="text-green-700 dark:text-green-300 font-semibold text-sm">{email}</span>
                    </div>
                </div>

                {/* Code Input Fields */}
                <div className="flex gap-3 justify-center">
                    {code.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => { inputsRef.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="w-14 h-14 text-center text-2xl font-bold border-2 border-green-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 outline-none bg-green-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-gray-500"
                            value={digit}
                            onChange={e => handleChange(idx, e.target.value)}
                            onKeyDown={e => handleKeyDown(idx, e)}
                        />
                    ))}
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                        <div className="flex items-center gap-2 justify-center">
                            <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                        <div className="flex items-center gap-2 justify-center">
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
                    className="w-full bg-gradient-to-r  from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Verificar Cuenta</span>
                </button>

                {/* Resend Code
                <button 
                    type="button" 
                    className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center gap-2 group"
                >
                    <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    ¿No recibiste el código? Reenviar
                </button> */}
            </div>
        </form>
    </div>
)
}

export default VerifyAccount