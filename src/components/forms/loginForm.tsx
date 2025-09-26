'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { LoginFormData, loginSchema } from '@/features/auth/utils/validation';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

// Funcion del login
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, errors } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 dark:bg-gray-800/95 shadow-2xl rounded-3xl px-10 py-10 w-full max-w-md mx-auto backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Image
              src="/AgroConexion.svg"
              alt="Logo"
              height={80}
              width={80}
              className="rounded-full border-4 border-green-300 dark:border-green-500 shadow-lg bg-white dark:bg-gray-700 transition-colors duration-300"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-wide text-gray-800 dark:text-white transition-colors duration-300">
            {t("iniciarSesion")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center transition-colors duration-300">
            {t("accedeCuenta")}
          </p>
          <div className="mt-3 h-1 w-16 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-400 rounded-full"></div>
        </div>

        {/* Errores generales */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-600 dark:text-red-400 text-sm font-semibold">
                {errors.general}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300">
              <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t("nombreUsuario")}
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                placeholder={t("ingresaNombreUsuario")}
                {...register('username')}
                className={`w-full rounded-xl border-2 px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  formErrors.username || errors.username
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-green-200 dark:border-gray-600 focus:ring-green-200 dark:focus:ring-green-800 focus:border-green-400 dark:focus:border-green-500'
                }`}
              />
              {!formErrors.username && !errors.username && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            {(formErrors.username || errors.username) && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formErrors.username?.message || errors.username}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300">
              <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t("contraseña")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder={t("ingresarContrasena")}
                {...register('password')}
                className={`w-full rounded-xl border-2 px-4 py-3 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  formErrors.password || errors.password
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-green-200 dark:border-gray-600 focus:ring-green-200 dark:focus:ring-green-800 focus:border-green-400 dark:focus:border-green-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
            {(formErrors.password || errors.password) && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formErrors.password?.message || errors.password}</span>
              </div>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Cargando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>{t('iniciarSesion')}</span>
              </>
            )}
          </button>

          {/* Separador */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2">o</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Link href={ROUTES.REGISTER}>
              <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 text-center sm:text-left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="font-medium">{t("crearCuenta")}</span>
              </div>
            </Link>
            <Link href={ROUTES.LOSTPASSWORD}>
              <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 text-center sm:text-right">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{t("recuperarContraseña")}</span>
              </div>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
