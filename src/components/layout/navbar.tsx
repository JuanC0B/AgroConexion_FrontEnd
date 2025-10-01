"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import GetAllCategories from "@/components/products/Categories";
import NavUser from "@/components/user/NavUser";
import { ShoppingCart, Menu, X, Ticket, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Notifications from "../notification/notification";
import { GiFarmTractor } from "react-icons/gi";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (isAuthenticated) {
          const { data } = await api.get("/cart/my-cart/");
          setCartCount(data.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error al obtener carrito:", error);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className="sticky top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center justify-between 
                      bg-green-700 dark:bg-green-900 shadow-lg px-3 sm:px-6 lg:px-10 
                      transition-colors duration-300"
      >
        {/* IZQUIERDA: Hamburguesa + Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-200 transition-colors 
                       p-1.5 rounded-lg hover:bg-white/10 flex-shrink-0"
            aria-label="Menú"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

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
            <span
              className="text-white dark:text-gray-100 font-bold 
                             text-sm sm:text-base lg:text-lg 
                             hidden xs:inline truncate"
            >
              {t("AgroConexión")}
            </span>
          </Link>

          {/* Categorías solo si está logeado */}
          {isAuthenticated && (
            <div className="hidden lg:flex">
              <GetAllCategories />
            </div>
          )}
        </div>

        {/* DERECHA: según estado de login + botón de idioma */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
          {isAuthenticated && (
            <>
              <Link
                href={ROUTES.COUPOND}
                className="hidden sm:flex text-white hover:text-gray-200 transition-colors 
                           p-2 rounded-lg hover:bg-white/10"
                aria-label="Cupones"
              >
                <Ticket className="w-5 h-5 lg:w-6 lg:h-6" />
              </Link>

              <Link
                href="/cart"
                className="relative text-white hover:text-gray-200 transition-colors 
                           p-2 rounded-lg hover:bg-white/10 flex-shrink-0"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-red-600 text-white 
                                   text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 
                                   flex items-center justify-center shadow-lg
                                   animate-pulse"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Notificaciones */}
              <div className="relative flex">
                <Notifications />
              </div>

              <Link
                href={ROUTES.FAVORITECATEGORIES}
                className="hidden sm:flex text-white hover:text-gray-200 transition-colors 
                           p-2 rounded-lg hover:bg-white/10"
                aria-label="Categorías favoritas"
              >
                <GiFarmTractor className="text-xl lg:text-2xl" />
              </Link>
            </>
          )}

          {/* ✅ BOTÓN DE IDIOMA - Oculto en móvil (md:flex) */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex text-white hover:text-gray-200 transition-colors 
                       p-2 rounded-lg hover:bg-white/10 items-center gap-1 sm:gap-1.5
                       flex-shrink-0"
            aria-label="Cambiar idioma"
            title={`Cambiar a ${language === "es" ? "English" : "Español"}`}
          >
            <Languages className="w-5 h-5 lg:w-5 lg:h-5" />
            <span className="text-xs sm:text-sm font-semibold uppercase">
              {language === "es" ? "ES" : "EN"}
            </span>
          </button>

          {/* Usuario */}
          <div className="relative flex">
            <NavUser />
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      {isMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            className="md:hidden fixed inset-y-0 left-0 z-50 
                          w-[calc(100vw-3rem)] max-w-xs sm:max-w-sm 
                          bg-white dark:bg-gray-800 shadow-2xl 
                          transform transition-transform duration-300
                          flex flex-col"
          >
            {/* Header del menú */}
            <div
              className="bg-green-700 dark:bg-green-900 px-4 py-3 flex items-center justify-between
                            shadow-lg border-b border-green-600 dark:border-green-800"
            >
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

            {/* Contenido menú */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* ✅ Botón de idioma PRIMERO en menú móvil */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-600">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-700"
                    aria-label="Cambiar idioma"
                    title={`Cambiar a ${
                      language === "es" ? "English" : "Español"
                    }`}
                  >
                    {/* Icono fijo para SSR */}
                    <Languages className="w-5 h-5 lg:w-5 lg:h-5" />

                    {/* Texto con suppressHydrationWarning para evitar mismatch */}
                    <span
                      className="ml-1 text-xs sm:text-sm font-semibold uppercase"
                      suppressHydrationWarning
                    >
                      {language === "es" ? "ES" : "EN"}
                    </span>
                  </button>
                </div>

                {/* Categorías */}
                <div className="space-y-2">
                  <div className="w-full">
                    <GetAllCategories />
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {t("menuresponsivoservicios")}
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
                      <span className="text-sm font-medium">
                        {t("menuresponsivocupones")}
                      </span>
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
                      <span className="text-sm font-medium">
                        {t("menuresponsivocategorioes")}
                      </span>
                    </Link>

                    <Link
                      href="/cart"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 
                                 hover:text-green-600 dark:hover:text-green-400 
                                 transition-colors py-2.5 px-3 rounded-lg
                                 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {t("menuresponsivoCarrito")}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t("AgroConexión")} © 2024
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
