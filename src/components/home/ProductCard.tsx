'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import ProductCard from '@/components/products/ProductCard'
import api from '@/lib/axios'

type ApiImage = { id: number; image: string }
type ApiProduct = {
  id: number
  name: string
  description: string
  stock: number
  price: number
  images: ApiImage[]
}

type ApiResponse =
  | ApiProduct[] // sin paginación
  | { count: number; next: string | null; previous: string | null; results: ApiProduct[] } // con paginación

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = (searchParams.get('query') || '').trim()
  const category = searchParams.get('category') || '' // por si luego lo usas
  const [results, setResults] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        // Construimos la URL de forma segura
        const url = new URL(`${process.env.NEXT_PUBLIC_API_UR}/products/list-products/`)
        url.searchParams.set('search', query)

        // Si tu backend acepta filtro por categoría, descomenta UNA de estas dos:
        // url.searchParams.set('category', category)          // si envías nombre/slug
        // url.searchParams.set('category_id', category)       // si envías id

        const response = await api.get<ApiResponse>(url.toString(), {
          // withCredentials: true, // si tu API usa cookies/sesión
        })

        // Soportar respuesta paginada o no paginada
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || []

        setResults(data)
      } catch (err: any) {
        console.error('❌ Error buscando productos:', err)
        setError(
          err?.response?.data?.detail ||
            'Ocurrió un problema al cargar los resultados.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, category])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Resultados para: <span className="text-gray-700">“{query || '—'}”</span>
      </h1>

      {loading && <p className="text-gray-500">Buscando productos…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                price={p.price}
                imageUrl={p.images?.[0]?.image || ''} // 👈 importante
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No se encontraron productos.</p>
        )
      )}
    </div>
  )
}
