"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Receipt, Calendar, User, CreditCard, Package, ShoppingCart, Tag, Gift, Sprout } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";

interface Offer {
  id: number
  title: string
  description: string
  percentage: string
  start_date: string
  end_date: string
}

interface Coupon {
  id: number
  description: string
  percentage: string
  min_purchase_amount: string
  start_date: string
  end_date: string
  active: boolean
  code: string
  seller: number
  product: number
}

interface Detail {
  product_name: string
  seller_name: string
  quantity: number
  unit_price: string
  subtotal: string
  offer?: Offer | null
  coupon?: Coupon | null
}

interface Invoice {
  id: number
  user: string
  date_created: string
  method: string
  total: string
  details: Detail[]
}

export default function InvoicePageClient({ id }: { id: string }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const {t}=useLanguage()

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoices/detail/${id}/`)
        setInvoice(res.data)
      } catch (error) {
        console.error("Error cargando la factura:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoice()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 dark:border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{t('facturacarga')}</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <Receipt className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            {t('facturanoencontrada')}
          </h2>
          <p className="text-red-500 dark:text-red-400">
            {t('facturatextonoencontrada')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Contenedor principal de la factura */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border-2 border-green-100 dark:border-gray-700 transition-colors duration-300">
          
          {/* Header premium con diseño campesino */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 px-6 sm:px-8 py-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10 dark:opacity-20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 dark:opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 dark:opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 dark:bg-opacity-30 rounded-2xl flex items-center justify-center shadow-lg">
                    <Receipt className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold"> {t('invoice')} #{invoice.id}</h1>
                    <p className="text-green-100 dark:text-green-200 flex items-center gap-2 mt-1">
                      <Sprout className="w-4 h-4" />
                      {t('invoiceparrafo')}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm sm:text-right space-y-1">
                  <div className="flex items-center gap-2 text-green-100 dark:text-green-200">
                    <Calendar className="w-4 h-4" />
                    {new Date(invoice.date_created).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-green-100 dark:text-green-200">
                    <User className="w-4 h-4" />
                    {invoice.user}
                  </div>
                  <div className="flex items-center gap-2 text-green-100 dark:text-green-200">
                    <CreditCard className="w-4 h-4" />
                    {invoice.method}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Tabla responsiva con mejor diseño */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                {t('invoicetitle')}
              </h2>
              
              {/* Vista de tabla para desktop */}
              <div className="hidden md:block">
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('invoivetable1')}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('invoivetable2')}</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">{t('invoivetable3')}</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">{t('invoivetable4')}</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">{t('invoivetable5')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {invoice.details.map((item, i) => (
                        <tr key={i} className="hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 bg-white dark:bg-gray-800">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">{item.product_name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-green-700 dark:text-green-400 font-medium">{item.seller_name}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                            ${item.unit_price}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-green-700 dark:text-green-400 text-lg">
                            ${item.subtotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vista de cards para móvil */}
              <div className="md:hidden space-y-4">
                {invoice.details.map((item, i) => (
                  <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border-l-4 border-green-500 dark:border-green-400 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.product_name}</h3>
                      <span className="text-lg font-bold text-green-700 dark:text-green-400">${item.subtotal}</span>
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      {item.seller_name}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">{item.quantity}</span> × ${item.unit_price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ofertas y cupones con mejor diseño */}
            <div className="mb-8">
              {invoice.details.some(item => item.offer || item.coupon) && (
                <>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    {t('invoicedescuentos')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {invoice.details.map(
                      (item, i) =>
                        (item.offer || item.coupon) && (
                          <div key={i} className="relative overflow-hidden">
                            {item.offer && (
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Tag className="w-4 h-4" />
                                  <span className="font-semibold text-sm">{t('invoiveoffert')}</span>
                                </div>
                                <p className="font-bold">{item.offer.title}</p>
                                <p className="text-green-100 dark:text-green-200 text-sm">
                                  {t('invoicedescuento')} {item.offer.percentage}%
                                </p>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 dark:bg-opacity-20 rounded-full transform translate-x-8 -translate-y-8"></div>
                              </div>
                            )}
                            {item.coupon && (
                              <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Gift className="w-4 h-4" />
                                  <span className="font-semibold text-sm">{t('invoicecupon')}</span>
                                </div>
                                <p className="font-bold">{t('invoicecode')}: {item.coupon.code}</p>
                                <p className="text-orange-100 dark:text-orange-200 text-sm">
                                  {t('invoicedescuento')} {item.coupon.percentage}%
                                </p>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 dark:bg-opacity-20 rounded-full transform translate-x-8 -translate-y-8"></div>
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Total con diseño premium */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border-2 border-green-200 dark:border-gray-600 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 dark:bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('invoicetotalparrafo')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-400">
                    ${invoice.total}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con información adicional */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="bg-green-50 dark:bg-gray-700 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <Sprout className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700 dark:text-green-300">
                  <p className="font-semibold mb-1">🌱 {t('invoicemensaje')}</p>
                  <p>{t('invoicemensajeparrafo')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
