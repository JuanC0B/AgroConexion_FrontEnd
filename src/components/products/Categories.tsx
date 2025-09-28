'use client'

import { Categories } from '@/types/product.types'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { GiFarmTractor } from 'react-icons/gi'
import { useLanguage } from '@/context/LanguageContext'

const GetAllCategories = () => {
  const [category, setCategory] = useState<Categories[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const GetCategory = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/categories/`
        )
        setCategory(response.data)
      } catch (error) {
        console.error('❌ Error fetching categories:', error)
      }
    }
    GetCategory()
  }, [])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Cerrar con Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [open])

  const { t } = useLanguage()

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Botón - Completamente responsivo */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 
                   text-white px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-xl font-semibold 
                   hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 
                   transition-all duration-300 flex items-center gap-1 sm:gap-2 
                   shadow-md hover:shadow-lg transform hover:scale-105
                   min-h-[40px] sm:min-h-[44px]"
        type="button"
      >
        <GiFarmTractor className="text-lg sm:text-xl flex-shrink-0" />
        
        {/* Texto solo visible en pantallas medianas en adelante */}
        <span className="hidden sm:inline text-sm lg:text-base whitespace-nowrap">
          {t('categorias')}
        </span>
        
        {/* Flecha también oculta en móviles */}
        <svg
          className={`hidden sm:block w-3 h-3 sm:w-4 sm:h-4 transform transition-transform duration-200 flex-shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown - Adaptativo según el tamaño de pantalla */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 
                        top-full mt-2 sm:mt-3 
                        w-[95vw] sm:w-[24rem] lg:w-[28rem] 
                        bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl 
                        shadow-2xl dark:shadow-black/50 
                        border border-green-200 dark:border-green-700 
                        z-50 animate-fade-slide
                        max-w-sm sm:max-w-none">
          
          {/* Header opcional para móvil */}
          <div className="sm:hidden flex items-center justify-between p-3 
                          border-b border-green-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <GiFarmTractor className="text-green-600 dark:text-green-400 text-lg" />
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                {t('categorias')}
              </h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenedor con scroll responsivo */}
          <div className="p-3 sm:p-5 
                          grid grid-cols-1 sm:grid-cols-2 gap-2 
                          max-h-[50vh] sm:max-h-[32.3rem] overflow-y-auto 
                          scrollbar-thin scrollbar-thumb-green-400 dark:scrollbar-thumb-green-600 
                          scrollbar-track-green-100 dark:scrollbar-track-gray-800
                          hover:scrollbar-thumb-green-500 dark:hover:scrollbar-thumb-green-500 
                          rounded-b-xl sm:rounded-b-2xl">
            {category.length === 0 ? (
              // Estado de carga/vacío
              <div className="col-span-full text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 
                                rounded-full flex items-center justify-center">
                  <GiFarmTractor className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Cargando categorías...
                </p>
              </div>
            ) : (
              category.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  title={cat.description}
                  onClick={() => setOpen(false)} // Cerrar al hacer clic
                  className="flex flex-col items-center justify-center 
                             px-3 py-4 sm:px-4 sm:py-3 rounded-xl 
                             bg-gradient-to-br from-green-50 to-green-100 
                             dark:from-gray-800 dark:to-gray-700
                             hover:from-green-100 hover:to-green-200 
                             dark:hover:from-gray-700 dark:hover:to-gray-600
                             text-gray-800 dark:text-gray-200 
                             hover:text-green-700 dark:hover:text-green-400 
                             transition-all duration-200 font-medium text-center shadow-sm 
                             border border-green-200 dark:border-green-600
                             hover:scale-105 group
                             min-h-[80px] sm:min-h-[90px]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <GiFarmTractor className="text-green-600 dark:text-green-400 
                                           text-xl sm:text-2xl mb-1 sm:mb-2
                                           group-hover:scale-110 transition-transform duration-200" />
                  
                  <span className="text-xs sm:text-sm leading-tight line-clamp-2 
                                   group-hover:font-semibold transition-all duration-200">
                    {cat.name}
                  </span>
                  
                  {/* Indicador de hover */}
                  <div className="w-0 group-hover:w-8 h-0.5 bg-green-500 dark:bg-green-400 
                                  rounded-full mt-1 transition-all duration-300"></div>
                </Link>
              ))
            )}
          </div>

          {/* Footer opcional con contador */}
          {category.length > 0 && (
            <div className="hidden sm:flex items-center justify-center p-2 
                            border-t border-green-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {category.length} categorías disponibles
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GetAllCategories