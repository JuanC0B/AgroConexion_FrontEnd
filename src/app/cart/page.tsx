// src/app/cart/page.tsx

'use client'

// 📦 Importaciones necesarias
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import Image from 'next/image'
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import BuyCart from '@/components/cart/ComprarCarrito'
import { toast } from 'sonner'

/* 
 📑 Tipado local para un producto dentro del carrito.
 Esto asegura que cada item tenga la forma correcta.
*/
interface CartProduct {
  id: number
  product: {
    id: number
    name: string
    description: string
    price: number
    images: { image: string }[]
  }
  quantity: number
}

// 🔢 Función para formatear precios en pesos colombianos (COP)
const formatPrice = (value = 0) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value)

const GetCarrito = () => {
  // 🗂️ Estados locales
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]) // productos actuales
  const [loading, setLoading] = useState<boolean>(true) // estado de carga inicial
  const [updatingId, setUpdatingId] = useState<number | null>(null) // id del producto en actualización
  const [refreshKey, setRefreshKey] = useState(0) // trigger para recargar datos

  // 📥 Obtener productos del carrito desde el backend
  const fetchCart = async () => {
    setLoading(true)
    try {
      const response = await api.get('/cart/my-cart/')
      const data = response.data

      // 🛠️ Normalizar siempre a un array
      const items: CartProduct[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : []

      setCartProducts(items)
    } catch (err: any) {
      console.error('Error al obtener el carrito', err?.response?.data ?? err?.message ?? err)
      toast.error('No se pudo cargar el carrito. Intenta recargar la página.')
    } finally {
      setLoading(false)
    }
  }

  // 🌀 Cargar carrito al iniciar y cada vez que cambie refreshKey
  useEffect(() => {
    fetchCart()
  }, [refreshKey])

  // 🔔 Escuchar evento global "cartUpdated"
  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1)
    window.addEventListener('cartUpdated', handler)
    return () => window.removeEventListener('cartUpdated', handler)
  }, [])

  // 🔄 Cambiar cantidad de un producto (usando DELETE + POST)
  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const prevState = [...cartProducts]
    setUpdatingId(productId)

    // 🟢 Optimismo en UI (mostramos el cambio antes de confirmación del backend)
    setCartProducts((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )

    try {
      // 1. Eliminar el producto actual
      await api.delete(`/cart/delete-product/${productId}/`)
      // 2. Volver a agregarlo con la nueva cantidad
      await api.post('/cart/my-cart/', {
        product_id: productId,
        quantity: newQuantity,
      })
      toast.success('Cantidad actualizada ✅')
      fetchCart() // 🔄 refrescar carrito
    } catch (err: any) {
      console.error('Error al actualizar cantidad', err?.response?.data ?? err?.message ?? err)
      toast.error('No se pudo actualizar la cantidad ❌')
      setCartProducts(prevState) // rollback en caso de error
    } finally {
      setUpdatingId(null)
    }
  }

  // 📊 Totales de carrito
  const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  )

  // 🎨 Renderizado principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
          🛒 Tu carrito
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              // ⏳ Loader mientras carga
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-green-600 dark:text-green-400" size={48} />
                  <p className="text-gray-600 dark:text-gray-300">Cargando tu carrito...</p>
                </div>
              </div>
            ) : cartProducts.length === 0 ? (
              // 🛑 Carrito vacío
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Explora nuestros productos y agrégalos al carrito.
                </p>
                <div className="mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                    Ir a comprar
                  </button>
                </div>
              </div>
            ) : (
              // ✅ Renderizar cada producto del carrito
              cartProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Imagen */}
                  <div className="w-full md:w-36 h-28 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border border-gray-200 dark:border-gray-600 group">
                    <Image
                      src={
                        item.product.images?.[0]?.image
                          ? `http://127.0.0.1:8000${item.product.images[0].image}`
                          : '/placeholder.png'
                      }
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>

                  {/* Info del producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                          {formatPrice(item.product.price)}
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">c/u</div>
                      </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="mt-4 flex items-center justify-between md:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        {/* Botón - */}
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              Math.max(item.quantity - 1, 1)
                            )
                          }
                          disabled={updatingId === item.product.id}
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-all duration-200 hover:scale-110"
                        >
                          <Minus size={16} className="text-gray-600 dark:text-gray-300" />
                        </button>

                        {/* Cantidad */}
                        <div className="w-14 text-center font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg py-2 border border-gray-200 dark:border-gray-600">
                          {item.quantity}
                        </div>

                        {/* Botón + */}
                        <button
                          onClick={() =>
                            handleQuantityChange(item.product.id, item.quantity + 1)
                          }
                          disabled={updatingId === item.product.id}
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-all duration-200 hover:scale-110"
                        >
                          <Plus size={16} className="text-gray-600 dark:text-gray-300" />
                        </button>

                        {/* Loader de actualización */}
                        {updatingId === item.product.id && (
                          <div className="ml-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} /> 
                            <span>Actualizando...</span>
                          </div>
                        )}
                      </div>

                      {/* Subtotal */}
                      <div className="ml-auto md:ml-6 text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Subtotal</div>
                        <div className="text-md font-semibold bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                          {formatPrice(item.quantity * item.product.price)}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={async () => {
                          try {
                            await api.delete(`/cart/delete-product/${item.product.id}/`)
                            toast.success('Producto eliminado 🗑️')
                            fetchCart()
                          } catch {
                            toast.error('No se pudo eliminar el producto ❌')
                          }
                        }}
                        className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 📌 Resumen del carrito */}
          <aside className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 sticky top-24 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Resumen</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalItems} productos
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Artículos en tu carrito</div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                      {formatPrice(totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de comprar */}
            <div className="mt-6">
              <BuyCart
                totalItems={totalItems}
                totalPrice={totalPrice}
                onCartCleared={() => setCartProducts([])} // 🗑️ limpiar carrito al comprar
              />
            </div>

            {/* Footer de beneficios */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-700">
              <div className="flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Entrega directa de productores</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Cambios en 7 días</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default GetCarrito
