'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCardProps } from '@/types/product.types'
import { Heart, ShoppingCart, MessageSquare, Star } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { useLanguage } from '@/context/LanguageContext';
import axios from 'axios'
/**
 * ProductCard → Componente de tarjeta para mostrar información de productos.
 *
 * Características principales:
 * - Imagen del producto con efecto hover (zoom-in).
 * - Botón para favoritos ❤️ (persistencia con backend).
 * - Botón para añadir/quitar del carrito 🛒.
 * - Muestra calificación ⭐ y número de comentarios 💬.
 * - Totalmente responsivo y con soporte para **modo oscuro**.
 */
const ProductCard: React.FC<ProductCardProps & { defaultFavorite?: boolean }> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  defaultFavorite = false, // Define si el producto inicia en favoritos
}) => {
  // ---------------- Estados ----------------
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(defaultFavorite)
  const [inCart, setInCart] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [commentsCount, setCommentsCount] = useState<number>(0)
  const [average, setAverage] = useState<number | null>(null)
  const [total, setTotal] = useState(0)
  // ---------------- Efectos ----------------
  useEffect(() => {
    setIsFavorite(defaultFavorite)
  }, [defaultFavorite])

  useEffect(() => {
    fetchRating()
    fetchComments()
  }, [])

  // ---------------- Funciones ----------------

  /** Añadir o quitar favoritos */
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/cart/delete-favorites/${id}/`)
        setIsFavorite(false)
        toast.success('Producto eliminado de favoritos ❤️')
      } else {
        await api.post(`/cart/favorites/`, { product: id })
        setIsFavorite(true)
        toast.success('Producto agregado a favoritos ❤️')
      }
    } catch (err: any) {
      const status = err?.response?.status
      const errorMessage = err?.response?.data?.detail || err?.message || 'Error desconocido'

      if (status === 401) {
        toast.error('🔒 Inicia sesión para gestionar favoritos')
      } else if (status === 500) {
        toast.error('❌ El producto ya está en favoritos o hay un error en el servidor')
      } else {
        toast.error(`❌ Error al actualizar favoritos: ${errorMessage}`)
      }
    }
  }

  /** Añadir o quitar del carrito */
  const toggleCart = async () => {
    try {
      if (inCart) {
        await api.delete(`/cart/delete-product/${id}/`)
        setInCart(false)
        toast.success('Producto eliminado del carrito 🛒')
      } else {
        await api.post(`/cart/my-cart/`, { product_id: id, quantity: 1 })
        setInCart(true)
        toast.success('Producto agregado al carrito 🛒')
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Error desconocido'
      if (err?.response?.status === 401) {
        toast.error('🔒 Inicia sesión para agregar productos al carrito')
      } else {
        toast.error(`❌ Error al actualizar el carrito: ${errorMessage}`)
      }
    }
  }

  /** Obtener calificación promedio */
  const fetchRating = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/stats_rating/${id}/`
        )

        const data = res.data
        setTotal(data.total_ratings)
        console.log(data)
        // Calcular promedio
        let sum = 0
        data.stars.forEach((s: any) => {
          sum += s.star * s.count
        })

        const avg = data.total_ratings > 0 ? sum / data.total_ratings : 0
        setAverage(avg)
        console.log(avg)
      } catch (err) {
        console.error('Error obteniendo calificación:', err)
      }
    }

  /** Obtener cantidad de comentarios */
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/product-comments/${id}/`)
      setCommentsCount(res.data.length || 0)
    } catch (error) {
      console.error('Error obteniendo comentarios:', error)
    }
  }

  // ---------------- Render ----------------
  return (
    <div
      className="group relative bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-green-500/50 dark:border-green-400/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo dinámico al hacer hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-amber-50/20 dark:from-green-800/20 dark:to-amber-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Imagen */}
      <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-800 dark:to-gray-700">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-amber-100 to-green-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
        )}
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${imageUrl}`}
          alt={name}
          fill
          className={`transition-all duration-700 group-hover:scale-105 object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Botón favoritos */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
        </button>
      </div>

      {/* Info del producto */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
          {description}
        </h2>

        {/* Precio y rating */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
            ${price}
          </span>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{average !== null ? average.toFixed(1) : "0.0"}</span>
          </div>
        </div>

        {/* Comentarios */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-2">
          <MessageSquare className="w-4 h-4" />
          <span>{commentsCount} {t("comentarios")}</span>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-3">
          {/* Carrito */}
          <button
            onClick={toggleCart}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold transition-all shadow-md ${inCart
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-green-600 to-lime-600 text-white hover:from-green-700 hover:to-lime-700'
              }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? t("quitarCarrito") : t("agregarCarrito") }
          </button>

          {/* Ver más */}
          <Link href={`/products/${id}`} className="flex-1">
            <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm">
              {t("verMas")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
