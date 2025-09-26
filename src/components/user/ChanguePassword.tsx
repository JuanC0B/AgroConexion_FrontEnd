// componente para enviar la solicitud de cambio de contraseña
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import { Lock } from 'lucide-react'
import api from '@/lib/axios'

const ChangePassword = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleClick = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No se encontró el token')

      const response = await api.post(
        '/users/change-password/request/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response.data)

      router.push(
        `${ROUTES.CHANGUEPASSWORD}?email=${encodeURIComponent(
          user?.email ?? ''
        )}`
      )
    } catch (error: any) {
      console.error(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <p>Cargando autenticación...</p>
  }

  if (!isAuthenticated) {
    return <p>No tienes acceso a esta acción. Por favor inicia sesión.</p>
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center w-full p-4 rounded-xl text-slate-600 dark:text-slate-300 
            bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-slate-700 
            hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-600
            shadow-sm hover:shadow-md dark:hover:shadow-lg
            transition-all duration-300 hover:translate-x-1 group
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0"
       >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 mr-4 group-hover:scale-110 transition-transform duration-200">
          <Lock className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">
              {loading ? 'Enviando solicitud...' : 'Cambiar contraseña'}
            </span>
            {loading && (
              <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {loading ? 'Procesando tu solicitud de cambio' : 'Actualiza tu contraseña por seguridad'}
          </p>
        </div>

        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
          <svg 
            className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {message && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChangePassword
