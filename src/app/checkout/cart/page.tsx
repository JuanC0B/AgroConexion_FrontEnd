'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import ComprarCarrito from '@/components/cart/ComprarCarrito'
import { toast } from 'sonner'
import Image from 'next/image'
import { Minus, Plus, Trash2, Tag, X, Check } from 'lucide-react'
import { AxiosError } from 'axios'

interface CartProduct {
  id: number
  product: {
    id: number
    name: string
    price: number
    images: { id: number; image: string }[]
    offers?: {
      percentage: string
    }
  }
  quantity: number
  appliedCoupon?: {
    code: string
    discount: number
    type: 'percentage' | 'fixed'
  }
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [coupons, setCoupons] = useState<{[key: number]: string}>({})
  const [applyingCoupon, setApplyingCoupon] = useState<{[key: number]: boolean}>({})

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/cart/my-cart/')
        setCartItems(data.products || [])
      } catch (err) {
        toast.error('Error al cargar el carrito ❌')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Aplicar cupón a un producto específico
  const handleApplyCoupon = async (itemId: number, productId: number) => {
    const couponCode = coupons[itemId]
    if (!couponCode?.trim()) {
      toast.error('Ingresa un código de cupón')
      return
    }

    setApplyingCoupon(prev => ({ ...prev, [itemId]: true }))

    try {
      // Simular llamada a API para validar cupón
      const response = await api.post('/coupons/validate/', {
        code: couponCode,
        product_id: productId
      })
      
      // Actualizar el item con el cupón aplicado
      setCartItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              appliedCoupon: {
                code: couponCode,
                discount: response.data.discount,
                type: response.data.type
              }
            }
          : item
      ))

      toast.success('Cupón aplicado correctamente ✅')
      
      // Limpiar el input del cupón
      setCoupons(prev => ({ ...prev, [itemId]: '' }))
      
    } catch (err: unknown) {
      if(err instanceof AxiosError){
        if (err.response?.status === 404) {
        toast.error('Cupón no válido o expirado')
      } else if (err.response?.status === 400) {
        toast.error('Este cupón no es válido para este producto')
      } else {
        toast.error('Error al aplicar el cupón')
      }
      }
    } finally {
      setApplyingCoupon(prev => ({ ...prev, [itemId]: false }))
    }
  }

  // Remover cupón de un producto
  const handleRemoveCoupon = (itemId: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, appliedCoupon: undefined }
        : item
    ))
    toast.success('Cupón removido')
  }

  // Actualizar cantidad de producto
  const updateQuantity = async (itemId: number, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await api.put(`/cart/update/${productId}/`, { quantity: newQuantity })
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
      toast.success('Cantidad actualizada')
    } catch (err) {
      if(err instanceof AxiosError){
        toast.error('Error al actualizar cantidad')
      }
      
    }
  }

  // Eliminar producto del carrito
  const removeItem = async (itemId: number, productId: number) => {
    try {
      await api.delete(`/cart/delete/${productId}/`)
      setCartItems(prev => prev.filter(item => item.id !== itemId))
      toast.success('Producto eliminado del carrito')
    } catch (err) {
      if(err instanceof AxiosError){
        toast.error('Error al eliminar producto')
      }
    }
  }

  // Calcular precio con descuentos
  const calculateItemPrice = (item: CartProduct) => {
    let basePrice = item.product.price

    // Aplicar descuento de oferta si existe
    if (item.product.offers) {
      const offerDiscount = parseFloat(item.product.offers.percentage)
      basePrice = basePrice - (basePrice * offerDiscount / 100)
    }

    // Aplicar cupón si existe
    if (item.appliedCoupon) {
      if (item.appliedCoupon.type === 'percentage') {
        basePrice = basePrice - (basePrice * item.appliedCoupon.discount / 100)
      } else {
        basePrice = basePrice - item.appliedCoupon.discount
      }
    }

    return Math.max(0, basePrice)
  }

  // Calcular totales
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0)
  const totalDiscount = cartItems.reduce((acc, item) => {
    const originalPrice = item.product.price * item.quantity
    const finalPrice = calculateItemPrice(item) * item.quantity
    return acc + (originalPrice - finalPrice)
  }, 0)
  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * calculateItemPrice(item), 0)

  const handleCartCleared = () => {
    setCartItems([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-200 dark:border-green-800 animate-pulse"></div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  Cargando tu carrito
                </h2>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                  Preparando tus productos favoritos...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
              Tu Carrito de Compras
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Revisa tus productos, aplica cupones de descuento y procede al pago
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explora nuestros productos y agrega los que más te gusten
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => {
                const itemPrice = calculateItemPrice(item)
                const originalPrice = item.product.price
                const hasDiscount = itemPrice < originalPrice

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0">
                          <div className="relative group">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.product.images[0]?.image}`}
                              alt={item.product.name}
                              width={120}
                              height={120}
                              className="rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-300"
                            />
                            {hasDiscount && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                ¡Oferta!
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {item.product.name}
                            </h3>
                            
                            {/* Precios */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                ${itemPrice.toLocaleString('es-CO')}
                              </span>
                              {hasDiscount && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  ${originalPrice.toLocaleString('es-CO')}
                                </span>
                              )}
                              {item.appliedCoupon && (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                                  Cupón: {item.appliedCoupon.code}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.product.id, item.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110"
                              >
                                <Minus size={16} className="text-gray-600 dark:text-gray-300" />
                              </button>

                              <div className="w-14 text-center font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg py-2 border border-gray-200 dark:border-gray-600">
                                {item.quantity}
                              </div>

                              <button
                                onClick={() => updateQuantity(item.id, item.product.id, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110"
                              >
                                <Plus size={16} className="text-gray-600 dark:text-gray-300" />
                              </button>
                            </div>

                            <div className="ml-auto text-right">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Subtotal</div>
                              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                ${(itemPrice * item.quantity).toLocaleString('es-CO')}
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(item.id, item.product.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          {/* Sección de cupón */}
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            {item.appliedCoupon ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-green-500 dark:bg-green-400 rounded-lg flex items-center justify-center">
                                    <Check size={16} className="text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                      Cupón aplicado: {item.appliedCoupon.code}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                      Descuento: {item.appliedCoupon.type === 'percentage' 
                                        ? `${item.appliedCoupon.discount}%` 
                                        : `$${item.appliedCoupon.discount.toLocaleString('es-CO')}`
                                      }
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveCoupon(item.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <Tag size={16} className="text-orange-500" />
                                  ¿Tienes un cupón de descuento?
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Código del cupón"
                                    value={coupons[item.id] || ''}
                                    onChange={(e) => setCoupons(prev => ({
                                      ...prev,
                                      [item.id]: e.target.value
                                    }))}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                  />
                                  <button
                                    onClick={() => handleApplyCoupon(item.id, item.product.id)}
                                    disabled={applyingCoupon[item.id]}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {applyingCoupon[item.id] ? 'Aplicando...' : 'Aplicar'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Resumen del carrito */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="w-6 h-6 mr-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Resumen del Pedido
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>${subtotal.toLocaleString("es-CO")}</span>
                  </div>
                  
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Descuentos aplicados</span>
                      <span>-${totalDiscount.toLocaleString("es-CO")}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Envío</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        ${totalPrice.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>
                </div>

                {totalDiscount > 0 && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                    <p className="text-green-800 dark:text-green-300 text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ¡Excelente! Estás ahorrando ${totalDiscount.toLocaleString("es-CO")}
                    </p>
                  </div>
                )}

                <ComprarCarrito
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  onCartCleared={handleCartCleared}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage