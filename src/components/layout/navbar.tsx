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

  return (
    <>
      <nav className="top-0 left-0 right-0 z-50 h-16 flex items-center justify-between bg-green-700 dark:bg-green-900 shadow px-4 sm:px-6 lg:px-10 transition-colors duration-500">
        
        {/* SECCIÓN IZQUIERDA - Logo y menú hamburguesa */}
        <div className="flex items-center gap-3">
          {/* Botón menú hamburguesa - Solo móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Menú"
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <Image
              className="rounded-full border border-white dark:border-gray-200 shadow-md"
              width={32}
              height={32}
              src="/AgroConexion.svg"
              alt="Logo"
            />
            {/* Texto del logo - Oculto en móvil, visible desde sm */}
            <span className="text-white dark:text-gray-100 font-bold text-base sm:text-lg hidden sm:inline">
              {t("AgroConexión")}
            </span>
          </Link>

          {/* Categorías - Solo desktop */}
          <div className="hidden lg:flex">
            <GetAllCategories />
          </div>
        </div>

        {/* SECCIÓN DERECHA - Iconos de acción */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Cupones - Oculto en móvil pequeño */}
          <Link 
            href={ROUTES.COUPOND} 
            className="hidden sm:flex text-white hover:text-gray-200 transition-colors"
            aria-label="Cupones"
          >
            <Ticket className="w-6 h-6" />
          </Link>

          {/* Carrito */}
          <Link href="/cart" className="relative text-white hover:text-gray-200 transition-colors">
            <ShoppingCart size={24} />
            {/* {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )} */}
          </Link>

          {/* Categorías favoritas - Oculto en móvil pequeño */}
          <Link 
            href={ROUTES.FAVORITECATEGORIES} 
            className="hidden sm:flex text-white hover:text-gray-200 transition-colors"
            aria-label="Categorías favoritas"
          >
            <GiFarmTractor className="text-2xl" />
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
          <div className="flex">
            <button
  onClick={toggleLanguage}
  className="hidden md:flex text-xs text-white border border-white/30 px-2 py-1 rounded hover:bg-green-800 transition-colors"
>
  {language === "es" ? "EN" : "ES"}
</button>

          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL EXPANDIBLE */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm h-full shadow-xl transform transition-transform duration-300">
            {/* Header del menú móvil */}
            <div className="bg-green-700 dark:bg-green-900 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full border border-white"
                  width={28}
                  height={28}
                  src="/AgroConexion.svg"
                  alt="Logo"
                />
                <span className="text-white font-bold">
                  {t("AgroConexión")}
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del menú móvil */}
            <div className="p-4 space-y-4">
              {/* Categorías */}
              <div className="mb-4">
                <GetAllCategories />
              </div>

              {/* Enlaces adicionales */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link
                  href={ROUTES.COUPOND}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors py-2"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Cupones</span>
                </Link>

                <Link
                  href={ROUTES.FAVORITECATEGORIES}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors py-2"
                >
                  <GiFarmTractor className="text-xl" />
                  <span>Categorías Favoritas</span>
                </Link>

                {/* Cambio de idioma en móvil */}
                <button
                  onClick={() => {
                    toggleLanguage()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors py-2 w-full text-left"
                >
                  <div className="w-5 h-5 border border-gray-400 rounded text-xs flex items-center justify-center">
                    {language === "es" ? "EN" : "ES"}
                  </div>
                  <span>Cambiar idioma</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
