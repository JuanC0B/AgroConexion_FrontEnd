'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import {LogOut, LogIn, UserPlus, ShoppingBag, FileText, BarChart, Apple} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext';



const NavUser = () => {
  const { t } = useLanguage();
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout, initializeAuth } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleLogout = async () => {
    await logout()
    toast.success('👋 Sesión cerrada correctamente')
    router.push('/login')
  }

  const handleLogin = () => router.push('/login')
  const handleRegister = () => router.push('/register')

  const getFullImageUrl = (path: string) =>
    path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_MEDIA_URL}${path}`

  if (isLoading) return null

  return (
    <div className="relative flex items-center gap-4" ref={dropdownRef}>
      {isAuthenticated && user ? (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="focus:outline-none transition-all transform hover:scale-105 relative group"
            aria-label="Menú de usuario"
          >
            {user.profile_image ? (
              <div className="relative">
                <Image
                  src={getFullImageUrl(user.profile_image)}
                  alt={user.username}
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-green-600 dark:border-green-500 shadow-md object-cover transition-all duration-300 group-hover:shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                  {user.userName?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-16 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
              {/* Cabecera mejorada */}
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                <Link href={ROUTES.PERFIL} className="flex items-center gap-3 group">
                  <div className="relative">
                    {user.profile_image ? (
                      <Image
                        src={getFullImageUrl(user.profile_image)}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-green-400 dark:border-green-500 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.userName?.charAt(0).toUpperCase() ?? 'U'}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 dark:bg-green-400 border border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">🌱</span>
                      <span className="font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {user.username}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Ver perfil</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Opciones del menú */}
              <ul className="py-2">
                <li>
                  <Link 
                    href={ROUTES.FAVORITOS}
                    className="px-5 py-3 hover:bg-green-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">{t("misFavoritos")}</span>
                  </Link>
                </li>
                
                <li>
                  <Link 
                    href={ROUTES.FACTURACION}
                    className="px-5 py-3 hover:bg-green-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">{t("misFacturas")}</span>
                  </Link>
                </li>

                {user.is_seller && (
                  <>
                    {/* Separador para vendedores */}
                    <li className="my-2 mx-5">
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                      <div className="flex items-center justify-center -mt-2.5">
                        <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Panel de Vendedor
                        </span>
                      </div>
                    </li>

                    <li>
                      <Link 
                        href={ROUTES.NEWPRODUCT}
                        className="px-5 py-3 hover:bg-green-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Apple className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium">{t("nuevoProducto")}</span>
                      </Link>
                    </li>

                    <li>
                      <Link 
                        href={ROUTES.MYPRODUCTS}
                        className="px-5 py-3 hover:bg-green-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Apple className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium">{t("misProductos")}</span>
                      </Link>
                    </li>

                    <li>
                      <Link 
                        href={ROUTES.ESTADISTICAS}
                        className="px-5 py-3 hover:bg-green-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <BarChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="font-medium">Estadísticas</span>
                      </Link>
                    </li>
                  </>
                )}

                {/* Separador para logout */}
                <li className="my-3 mx-5">
                  <div className="h-px bg-gray-200 dark:bg-gray-600"></div>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{t("cerrarSesion")}</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            {t("iniciarSesion")}
          </button>

          <button
            onClick={handleRegister}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-green-700 dark:text-green-400 bg-white dark:bg-gray-800 border-2 border-green-600 dark:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-700 dark:hover:border-green-400 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            {t("registrarse")}
          </button>
        </div>
      )}
    </div>
  )
}

export default NavUser
