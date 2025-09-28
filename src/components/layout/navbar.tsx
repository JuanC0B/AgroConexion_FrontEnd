'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import GetAllCategories from '@/components/products/Categories'
import NavUser from '@/components/user/NavUser'
import SearchBar from '../search/SearchBar'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import Notifications from '../notification/notification'
import { GiFarmTractor } from 'react-icons/gi'
import { ROUTES } from '@/lib/constants'
import { Ticket } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { t, language, toggleLanguage } = useLanguage()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (isAuthenticated) {
          const { data } = await api.get('/cart/my-cart/')
          setCartCount(data.length)
        } else {
          setCartCount(0)
        }
      } catch (error) {
        console.error('Error al obtener carrito:', error)
      }
    }

    fetchCart()
  }, [isAuthenticated])

  // Cerrar menú móvil cuando se redimensiona la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center justify-between 
                      bg-green-700 dark:bg-green-900 shadow-lg px-3 sm:px-6 lg:px-10 
                      transition-colors duration-300">
        
        {/* SECCIÓN IZQUIERDA - Logo y menú hamburguesa */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Botón menú hamburguesa - Solo móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-200 transition-colors 
                       p-1.5 rounded-lg hover:bg-white/10 flex-shrink-0"
            aria-label="Menú"
          >
            {isMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2 hover:opacity-90 transition min-w-0"
          >
            <Image
              className="rounded-full border border-white dark:border-gray-200 shadow-md flex-shrink-0"
              width={28}
              height={28}
              src="/AgroConexion.svg"
              alt="Logo"
            />
            {/* Texto del logo - Responsive */}
            <span className="text-white dark:text-gray-100 font-bold 
                             text-sm sm:text-base lg:text-lg 
                             hidden xs:inline truncate">
              {t("AgroConexión")}
            </span>
          </Link>

          {/* Categorías - Solo desktop */}
          <div className="hidden lg:flex">
            <GetAllCategories />
          </div>
        </div>

        {/* SECCIÓN DERECHA - Iconos de acción */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
          {/* Cupones - Oculto en móvil pequeño */}
          <Link 
            href={ROUTES.COUPOND} 
            className="hidden sm:flex text-white hover:text-gray-200 transition-colors 
                       p-2 rounded-lg hover:bg-white/10"
            aria-label="Cupones"
          >
            <Ticket className="w-5 h-5 lg:w-6 lg:h-6" />
          </Link>

          {/* Carrito */}
          <Link 
            href="/cart" 
            className="relative text-white hover:text-gray-200 transition-colors 
                       p-2 rounded-lg hover:bg-white/10 flex-shrink-0"
            aria-label="Carrito de compras"
          >
            <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white 
                               text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 
                               flex items-center justify-center shadow-lg
                               animate-pulse">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Categorías favoritas - Oculto en móvil pequeño */}
          <Link 
            href={ROUTES.FAVORITECATEGORIES} 
            className="hidden sm:flex text-white hover:text-gray-200 transition-colors 
                       p-2 rounded-lg hover:bg-white/10"
            aria-label="Categorías favoritas"
          >
            <GiFarmTractor className="text-xl lg:text-2xl" />
          </Link>

          {/* Notificaciones */}
          <div className="flex">
            <Notifications />
          </div>

          {/* Usuario */}
          <div className="flex">
            <NavUser />
          </div>

          {/* Cambio de idioma - Oculto en móvil muy pequeño */}
          <div className="hidden md:flex">
            <button
              onClick={toggleLanguage}
              className="text-xs lg:text-sm text-white border border-white/30 
                         px-2 py-1 rounded hover:bg-green-800 dark:hover:bg-green-800 
                         transition-colors min-w-[32px] font-medium"
              aria-label="Cambiar idioma"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL EXPANDIBLE */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Panel del menú */}
          <div className="md:hidden fixed inset-y-0 left-0 z-50 w-full max-w-xs sm:max-w-sm 
                          bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300
                          flex flex-col">
            
            {/* Header del menú móvil */}
            <div className="bg-green-700 dark:bg-green-900 px-4 py-3 flex items-center justify-between
                            shadow-lg border-b border-green-600 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full border border-white flex-shrink-0"
                  width={24}
                  height={24}
                  src="/AgroConexion.svg"
                  alt="Logo"
                />
                <span className="text-white font-bold text-sm truncate">
                  {t("AgroConexión")}
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-200 p-1 rounded"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido del menú móvil con scroll */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Categorías */}
                <div className="space-y-2">
                  <div className="w-full">
                    <GetAllCategories />
                  </div>
                </div>

                {/* Enlaces adicionales */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Servicios
                  </h3>
                  
                  <Link
                    href={ROUTES.COUPOND}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 
                               hover:text-green-600 dark:hover:text-green-400 
                               transition-colors py-2.5 px-3 rounded-lg
                               hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Ticket className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Cupones</span>
                  </Link>

                  <Link
                    href={ROUTES.FAVORITECATEGORIES}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 
                               hover:text-green-600 dark:hover:text-green-400 
                               transition-colors py-2.5 px-3 rounded-lg
                               hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <GiFarmTractor className="text-xl flex-shrink-0" />
                    <span className="text-sm font-medium">Categorías Favoritas</span>
                  </Link>

                  {/* Cambio de idioma en móvil */}
                  <button
                    onClick={() => {
                      toggleLanguage()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 
                               hover:text-green-600 dark:hover:text-green-400 
                               transition-colors py-2.5 px-3 rounded-lg w-full text-left
                               hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <div className="w-5 h-5 border border-gray-400 dark:border-gray-500 rounded text-xs 
                                    flex items-center justify-center font-bold flex-shrink-0">
                      {language === "es" ? "EN" : "ES"}
                    </div>
                    <span className="text-sm font-medium">Cambiar idioma</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer del menú */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t("AgroConexión")} © 2024
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}