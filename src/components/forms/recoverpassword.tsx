"use client";
import axios from "axios";
import Image from "next/image";
import { useRef, useState } from "react";
import { VerifyAccountProps, NewPassword } from "@/types/auth.types";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
// Funcion para verificar la cuenta recibe como parametro el email del usuario y la ruta del ENDPOINT
const ResetPassword = ({ email, URL }: VerifyAccountProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  // Funcion que actualiza el estadoi del codigo
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [form, setForm] = useState({
    new_password: "",
    new_password2: "",
  });
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

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    const data: NewPassword = {
      new_password: form.new_password,
      new_password2: form.new_password2,
      email: email,
      code: Number(fullCode),
    };

    try {
      // Hacemos la peticion
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${URL}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Redirigimos al usuario
      router.push(ROUTES.LOGIN);
    } catch (error: any) {
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.error) {
          setError("Código inválido o expirado.");
        }
      } else {
        setError("No se pudo conectar con el servidor");
      }
    }
  };

  // Retornamos componente XML
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 py-4 sm:py-8 px-3 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 w-full max-w-md mx-auto border border-white/20 dark:border-gray-700/50 transition-all duration-300"
      >
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <Image
            src="/AgroConexion.svg"
            alt="Logo"
            height={80}
            width={80}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-green-300 dark:border-green-500 shadow-md bg-white dark:bg-gray-100 transition-colors duration-300"
          />
          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold tracking-wide text-gray-900 dark:text-white transition-colors duration-300 text-center">
            {t("verificarcuenta")}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <label className="text-base sm:text-lg text-center font-semibold mb-1 sm:mb-2 text-gray-800 dark:text-gray-200 transition-colors duration-300 px-2">
            {t("verificarcuentacodigo")}{" "}
            <span className="text-green-700 dark:text-green-400 font-bold break-all">
              {email}
            </span>
          </label>

          <div className="flex gap-1.5 sm:gap-2 justify-center w-full px-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-2xl border-2 border-green-300 dark:border-green-500 rounded-lg focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-500 dark:focus:border-green-400 outline-none bg-emerald-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold mt-1 sm:mt-2 bg-red-50 dark:bg-red-900/20 px-2 sm:px-3 py-1 rounded-lg border border-red-200 dark:border-red-800 transition-colors duration-300 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold mt-1 sm:mt-2 bg-green-50 dark:bg-green-900/20 px-2 sm:px-3 py-1 rounded-lg border border-green-200 dark:border-green-800 transition-colors duration-300 text-center">
              {success}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 relative mt-4 sm:mt-6 mb-3 sm:mb-4">
          <label
            htmlFor="new_password"
            className="font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300 text-sm sm:text-base"
          >
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="new_password"
            placeholder="Password"
            value={form.new_password}
            onChange={handleChangePassword}
            className="rounded-lg border border-green-200 dark:border-gray-600 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 pr-10 sm:pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 sm:right-3 top-8 sm:top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
            tabIndex={-1}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.662 0 3.26-.368 4.646-1.022M6.423 6.423A9.956 9.956 0 0 1 12 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.227 1.977M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 relative mb-4 sm:mb-6">
          <label
            htmlFor="new_password2"
            className="font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300 text-sm sm:text-base"
          >
            {t("contrseñanuevaconfirmar")}
          </label>
          <input
            type={showPassword2 ? "text" : "password"}
            id="new_password2"
            placeholder="Confirm Password"
            value={form.new_password2}
            onChange={handleChangePassword}
            className="rounded-lg border border-green-200 dark:border-gray-600 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 pr-10 sm:pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword2((v) => !v)}
            className="absolute right-2 sm:right-3 top-8 sm:top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
            tabIndex={-1}
            aria-label={
              showPassword2 ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword2 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.662 0 3.26-.368 4.646-1.022M6.423 6.423A9.956 9.956 0 0 1 12 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.227 1.977M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 min-w-[160px] sm:min-w-[200px] text-sm sm:text-base"
          >
            {t("recuperarcontraseña")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
