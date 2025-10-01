'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { RegisterFormData, registerSchema } from '@/features/auth/utils/validation';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';


export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register: registerUser, isLoading, errors } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
  };
  
  const { t } = useLanguage();
return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 transition-colors duration-300 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 dark:bg-gray-800/95 shadow-2xl rounded-3xl px-6 sm:px-10 py-8 sm:py-10 w-full max-w-md mx-auto backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
      >
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
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
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold tracking-wide text-gray-800 dark:text-white transition-colors duration-300">
            {t("crearCuenta")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center transition-colors duration-300 text-sm">
            {t("unetePlataforma")}
          </p>
          <div className="mt-3 h-1 w-16 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-400 rounded-full"></div>
        </div>

        {/* Errores generales */}
        {errors.general && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-600 dark:text-red-400 text-sm font-semibold">
                {errors.general}
              </span>
            </div>
          </div>
        )}

        {/* Campos */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300 text-sm sm:text-base">
              <svg className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t("nombreUsuario")}
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                {...register('username')}
                placeholder={t("ingresaNombreUsuario")}
                className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base ${
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
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="break-words">{formErrors.username?.message || errors.username}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300 text-sm sm:text-base">
              <svg className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {t("email")}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="ejemplo@correo.com"
                className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base ${
                  formErrors.email || errors.email
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-green-200 dark:border-gray-600 focus:ring-green-200 dark:focus:ring-green-800 focus:border-green-400 dark:focus:border-green-500'
                }`}
              />
              {!formErrors.email && !errors.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            {(formErrors.email || errors.email) && (
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="break-words">{formErrors.email?.message || errors.email}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300 text-sm sm:text-base">
              <svg className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t("contraseña")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={t("minimo8Caracteres")}
                className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base ${
                  formErrors.password || errors.password
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-green-200 dark:border-gray-600 focus:ring-green-200 dark:focus:ring-green-800 focus:border-green-400 dark:focus:border-green-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800"
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
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="break-words">{formErrors.password?.message || errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password2" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300 text-sm sm:text-base">
              <svg className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("confirmarContrasena")}
            </label>
            <div className="relative">
              <input
                id="password2"
                type={showPassword2 ? 'text' : 'password'}
                {...register('password2')}
                placeholder={t("repetirContrasena")}
                className={`w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base ${
                  formErrors.password2 || errors.password2
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-green-200 dark:border-gray-600 focus:ring-green-200 dark:focus:ring-green-800 focus:border-green-400 dark:focus:border-green-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword2((v) => !v)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800"
                tabIndex={-1}
                aria-label={showPassword2 ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword2 ? (
                  <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
            {(formErrors.password2 || errors.password2) && (
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="break-words">{formErrors.password2?.message || errors.password2}</span>
              </div>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 sm:mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>{t("crearCuenta")}</span>
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
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
            <Link href={ROUTES.LOGIN}>
              <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 justify-center sm:justify-start">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">{t("yaTengoCuenta")}</span>
              </div>
            </Link>
            <Link href={ROUTES.REGISTERAGROUP}>
              <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 justify-center sm:justify-end">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">{t("registrarAgrupacion")}</span>
              </div>
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}