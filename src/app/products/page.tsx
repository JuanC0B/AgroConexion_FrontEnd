// src/app/products/page.tsx

'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Product } from '@/types/product.types'
import ProductCard from '@/components/products/ProductCard'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext';


/**
 * Página de listado de productos
 * -----------------------------------------
 * - Obtiene todos los productos desde la API.
 * - Muestra un loader mientras se cargan los datos.
 * - Si hay un error, se notifica al usuario.
 * - Si no hay productos disponibles, se muestra un mensaje.
 * - Cada producto se renderiza con el componente `ProductCard`.
 */
const ListProducts = () => {
  // URL del endpoint de productos
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/products/list-products/`

  // Estado con todos los productos
  const [products, setProducts] = useState<Product[]>([])

  // Estado para manejar errores
  const [errores, setError] = useState('')

  // Estado para mostrar loader mientras se cargan los datos
  const [loading, setLoading] = useState(true)
  
  const { t } = useLanguage();
  /**
   * useEffect -> Se ejecuta al montar el componente
   * - Llama a la API para traer los productos.
   * - Maneja errores y finaliza el loading.
   */
  useEffect(() => {
    const GetAllProducts = async () => {
      try {
        const response = await axios.get(URL)
        setProducts(response.data) // Guardamos los productos obtenidos
      } catch (error) {
        // Manejo de errores con Axios
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.detail ||
              'Ocurrió un error al obtener los productos.'
          )
        } else {
          setError('Error inesperado')
        }
      } finally {
        setLoading(false) // Finalizamos el loading en cualquier caso
      }
    }

    GetAllProducts()
  }, [])

  return (
    <div className="px-6 py-10">
      {/* Encabezado atractivo */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          🌱 {t("VerTodos")}
        </h1>
        <p className="text-gray-500 mt-2">
          {t("infproductos")}
        </p>
      </div>

      {/* Mostrar errores en caso de fallar la carga */}
      {errores && (
        <div className="text-center bg-red-100 text-red-600 py-3 rounded-lg mb-6 shadow">
          {errores}
        </div>
      )}

      {/* Loader mientras se cargan productos */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        </div>
      ) : (
        // Grid de productos
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.images[0]?.image || '/default-placeholder.png'}
              />
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay productos */}
      {!loading && products.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">🚫 No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  )
}

export default ListProducts
