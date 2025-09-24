'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  LucideIcon,
  Apple,
  Carrot,
  Fish,
  Milk,
  Leaf,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext';

/**
 * Props para la tarjeta de categoría
 */
interface CategoryCardProps {
  name: string
  imageUrl: string
  icon: LucideIcon
  href: string
}

/**
 * CategoryCard → Tarjeta individual de categoría
 * - Muestra una imagen de fondo con capa oscura
 * - Ícono dentro de una burbuja de color
 * - Nombre de la categoría
 * - Animación al hacer hover
 * - **Adaptado a modo oscuro**
 */
const CategoryCard = ({ name, imageUrl, icon: Icon, href }: CategoryCardProps) => {
 
  return (
    <Link href={href} className="group">
      <div className="relative w-44 sm:w-56 h-72 sm:h-80 rounded-3xl overflow-hidden shadow-xl 
        bg-white dark:bg-gray-900 transition-transform transform 
        group-hover:scale-105 group-hover:shadow-2xl border border-green-100 dark:border-green-900">

        {/* Imagen de fondo */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />

        {/* Capa de superposición para contraste */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300" />

        {/* Burbuja con ícono */}
        <div className="absolute bottom-5 left-5 bg-orange-500 text-white 
          rounded-full p-2 shadow-md group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>

        {/* Nombre categoría */}
        <div className="absolute bottom-5 left-16 text-white font-bold 
          text-base sm:text-lg drop-shadow-md group-hover:text-orange-200 transition-colors">
          {name}
        </div>
      </div>
    </Link>
  )
}

/**
 * CategoryShowcase → Sección principal de categorías
 * - Renderiza un grid/flex con varias CategoryCard
 * - Incluye título llamativo
 * - **Con soporte a modo oscuro**
 */
export const CategoryShowcase = () => {
  const { t } = useLanguage();
  const categories: CategoryCardProps[] = [
    
    {
      name: t("frutas"),
      imageUrl: '/categories/frutas.jpg',
      icon: Apple,
      href: '/categories/1',
    },
    {
      name: t("verduras"),
      imageUrl: '/categories/verduras.jpg',
      icon: Carrot,
      href: '/categories/2',
    },
    {
      name: t("lacteos"),
      imageUrl: '/categories/lacteos.jpg',
      icon: Milk,
      href: '/categories/4',
    },
    {
      name: t("pescados"),
      imageUrl: '/categories/pescado.jpg',
      icon: Fish,
      href: '/categories/5',
    },
    {
      name: t("hierbas"),
      imageUrl: '/categories/hierbasa.jpg',
      icon: Leaf,
      href: '/categories/15',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-green-100 
      dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 
      py-10 px-6 sm:px-12 rounded-3xl shadow-inner mt-8 transition-colors duration-500">

      <h2 className="text-3xl sm:text-4xl font-extrabold 
        text-green-800 dark:text-green-400 mb-10 text-center">
        {t("exploraPorCategorias")}
      </h2>

      <div className="flex justify-center flex-wrap gap-6">
        {categories.map((cat, index) => (
          <CategoryCard key={index} {...cat} />
        ))}
      </div>
    </section>
  )
}
