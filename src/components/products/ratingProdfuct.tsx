'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

import {Props, RatingStatsResp} from '@/types/ratings.types'

export default function RatingStats({ productId }: Props) {
  const [stats, setStats] = useState<RatingStatsResp | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/stats_rating/${productId}/`
      )
      setStats(res.data)
    } catch (err) {
      console.error('Error cargando estadísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    const handler = (e: Event) => {
      const custom = e as CustomEvent
      if (!custom?.detail || custom.detail.productId !== productId) return
      fetchStats()
    }

    window.addEventListener('ratingUpdated', handler as EventListener)
    return () =>
      window.removeEventListener('ratingUpdated', handler as EventListener)
  }, [productId])

  if (loading) return <p className="text-sm text-gray-500">Cargando calificaciones...</p>
  if (!stats) return null

  const total = stats.total_ratings
  const average =
    total > 0
      ? stats.stars.reduce((acc, s) => acc + s.star * s.count, 0) / total
      : 0

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full transition-all duration-300 hover:shadow-xl">
      {/* Header con rating promedio */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
              {average.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ({total} {total === 1 ? 'voto' : 'votos'})
            </div>
          </div>

          {/* Visual de estrellas mejorado */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starNumber = i + 1
              const isFilled = average >= starNumber
              const isPartial = average > starNumber - 1 && average < starNumber
              
              return (
                <div key={i} className="relative">
                  <svg 
                    className={`w-6 h-6 transition-all duration-200 ${
                      isFilled 
                        ? 'text-yellow-400 drop-shadow-sm' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    viewBox="0 0 24 24" 
                    fill={isFilled ? 'currentColor' : 'none'} 
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 19.897 4.665 24 6.25 15.352 0.5 9.75l7.832-1.732L12 .587z" />
                  </svg>
                  
                  {/* Estrella parcial para decimales */}
                  {isPartial && (
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${(average - (starNumber - 1)) * 100}%` }}>
                      <svg 
                        className="w-6 h-6 text-yellow-400"
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 19.897 4.665 24 6.25 15.352 0.5 9.75l7.832-1.732L12 .587z" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Badge de calidad */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          average >= 4.5 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
            : average >= 3.5 
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {average >= 4.5 ? 'Excelente' : average >= 3.5 ? 'Bueno' : 'Regular'}
        </div>
      </div>

      {/* Distribución de calificaciones */}
      <div className="space-y-3">
        {stats.stars
          .slice()
          .reverse()
          .map((s, index) => (
            <div 
              key={s.star} 
              className="flex items-center gap-4 group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2 w-16">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.star}</span>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 19.897 4.665 24 6.25 15.352 0.5 9.75l7.832-1.732L12 .587z" />
                </svg>
              </div>
              
              <div className="flex-1 relative">
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${s.percentage}%` }}
                  >
                    {/* Efecto de brillo en la barra */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                  </div>
                </div>
                {/* Porcentaje flotante */}
                <div className="absolute -top-6 text-xs text-gray-500 dark:text-gray-400" style={{ left: `${Math.min(s.percentage, 90)}%` }}>
                  {s.percentage.toFixed(1)}%
                </div>
              </div>
              
              <div className="w-12 text-right">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  {s.count}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
