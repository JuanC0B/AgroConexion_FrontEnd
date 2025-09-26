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
  const { t } = useLanguage()

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Botón */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center gap-2 shadow-md"
        type="button"
      >
        <GiFarmTractor className="text-xl" />
        <span className="hidden sm:inline">
          {t('categorias')}</span>
        <svg
          className={`hidden sm:block w-4 h-4 transform transition-transform ${
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

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[28rem] 
          bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
          border border-green-200 dark:border-green-700 
          z-20 animate-fade-slide"
        >
          {/* Contenedor con scroll */}
          <div
            className="p-5 grid grid-cols-2 gap-2 max-h-[32.3rem] overflow-y-auto 
            scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 
            hover:scrollbar-thumb-green-500 rounded-b-2xl 
            dark:scrollbar-thumb-green-600 dark:scrollbar-track-gray-800"
          >
            {category.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                title={cat.description}
                className="flex flex-col items-center justify-center px-4 py-3 rounded-xl 
                bg-gradient-to-br from-green-50 to-green-100 
                dark:from-gray-800 dark:to-gray-700
                hover:from-green-100 hover:to-green-200 
                dark:hover:from-gray-700 dark:hover:to-gray-600
                text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 
                transition font-medium text-center shadow-sm 
                border border-green-200 dark:border-green-600"
              >
                <GiFarmTractor className="text-green-600 dark:text-green-400 text-2xl mb-1" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GetAllCategories
