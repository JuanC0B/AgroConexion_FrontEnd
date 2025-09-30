'use client'
import axios, { AxiosError } from "axios"
import { useState, useEffect, useRef } from "react"
import { Bell, Trash2 } from "lucide-react"
import Image from "next/image"
import { useLanguage } from '@/context/LanguageContext'
import api from "@/lib/axios"

type NotificationData = Record<string, any>

type Notification = {
  id: number
  type: string
  title?: string
  message: string
  image?: string
  data: NotificationData
  read?: boolean
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  // Hook para cerrar el dropdown cuando se hace click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  // También cerrar con la tecla Escape
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

  // Cargar notificaciones iniciales
  useEffect(() => {
    const GetNotifications = async () => {
      setLoading(true)
      try {
        const response = await api.get("/notifications/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setNotifications(response.data)
      } catch (err) {
        const error = err as AxiosError
        if (error.response?.status === 401) {
          setError("No autorizado. Por favor inicia sesión nuevamente.")
        } else {
          setError("Error al cargar notificaciones.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      GetNotifications()
    } else {
      setLoading(false)
    }
  }, [token])

  // WebSocket para notificaciones en tiempo real
  useEffect(() => {
    if (!token) return

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notificaciones/?token=${token}`)

    socket.onopen = () => {
      console.log("🔌 WebSocket conectado")
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log(data)
        const notif = data.data
        console.log(notif)
        setNotifications(prev => [notif, ...prev])
      } catch (err) {
        // console.error("❌ Error al parsear mensaje:", err)
      }
    }

    return () => {
      socket.close()
    }
  }, [token])

  const getFullImageUrl = (path: string) =>
    path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_MEDIA_URL}${path}`

  const unreadCount = notifications.length

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/delete/${id}/`,)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error("Error al eliminar notificación", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error("Error al marcar notificaciones como leídas", err)
    }
  }
 
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
        <div className="relative">
          <Bell className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-400 text-white 
                             text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full animate-bounce shadow-sm
                             min-w-[16px] h-4 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        {/* Texto solo visible en pantallas medianas en adelante */}
        <span className="hidden sm:inline text-sm lg:text-base">{t("notificaciones")}</span>

        {/* Flecha también oculta en móviles */}
        <svg
          className={`hidden sm:block w-3 h-3 sm:w-4 sm:h-4 transform transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
        <div className="fixed sm:absolute 
                        top-14 sm:top-full 
                        left-2 sm:left-auto 
                        right-2 sm:right-0 
                        mt-2 sm:mt-3 
                        w-auto sm:w-[20rem] lg:w-[26rem] 
                        bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl 
                        shadow-2xl dark:shadow-black/50 
                        border border-green-300 dark:border-green-600 
                        z-50 animate-fade-slide backdrop-blur-sm
                        max-h-[calc(100vh-4.5rem)] sm:max-h-none">
          {/* Header del dropdown */}
          <div className="flex items-center justify-between p-3 sm:p-4 
                          border-b border-green-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-green-600 
                              dark:from-green-400 dark:to-green-500 rounded-lg flex items-center justify-center">
                <Bell className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                {t("notificaciones")}
              </h3>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} {t("sinLeer")}
                </span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Contenedor de notificaciones con scroll responsivo */}
          <div className="max-h-[calc(100vh-8rem)] sm:max-h-[60vh] lg:max-h-[28rem] overflow-y-auto 
                          scrollbar-thin scrollbar-thumb-green-400 dark:scrollbar-thumb-green-500 
                          scrollbar-track-green-100 dark:scrollbar-track-gray-700
                          hover:scrollbar-thumb-green-500 dark:hover:scrollbar-thumb-green-400">
            {!token ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
                                bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base px-4">
                  {t("iniciaSesionNotificaciones")}
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
                                bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-green-500 dark:border-green-400 
                                  border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  {t("cargandoNotificaciones")}...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
                                bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-500 dark:text-red-400 font-medium text-sm sm:text-base px-4">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
                                bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base px-4">
                  {t("detallenotificacion")}
                </h4>
              </div>
            ) : (
              <div className="p-2 sm:p-3">
                <ul className="space-y-2 sm:space-y-3">
                  {notifications.map((n, index) => (
                    <li 
                      key={n?.id} 
                      className="group relative border border-green-300 dark:border-gray-600 
                                 rounded-xl sm:rounded-2xl hover:bg-green-50 dark:hover:bg-gray-700/50 
                                 transition-all duration-200 overflow-hidden"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Indicador de no leído */}
                      {!n?.read && (
                        <div className="absolute top-0 left-0 w-1 h-full 
                                        bg-gradient-to-b from-green-500 to-green-600 
                                        dark:from-green-400 dark:to-green-500"></div>
                      )}

                      <div className="flex items-start gap-2 sm:gap-3 justify-between p-3 sm:p-4">
                        <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
                          {n?.image && (
                            <div className="flex-shrink-0">
                              <Image
                                src={getFullImageUrl(n.image)}
                                alt={`${n.title}`}
                                width={32}
                                height={32}
                                className="rounded-lg sm:rounded-xl object-cover w-8 h-8 sm:w-10 sm:h-10 
                                           border border-gray-200 dark:border-gray-600"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-green-700 dark:text-green-400 
                                           text-xs sm:text-sm leading-tight line-clamp-1">
                              {n?.title || "Notificación"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 
                                           mt-1 line-clamp-2 leading-relaxed">
                              {n?.message}
                            </p>
                            <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Hace 2 horas
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(n?.id)
                          }}
                          className="flex-shrink-0 p-1.5 sm:p-2 text-gray-400 
                                     hover:text-red-500 dark:hover:text-red-400 
                                     hover:bg-red-50 dark:hover:bg-red-900/20 
                                     rounded-lg transition-all duration-200 
                                     touch-manipulation
                                     min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px]
                                     flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications