'use client'

import { useState } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { ShoppingCart, Loader2, PackageSearch } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext';

interface ComprarCarritoProps {
  totalItems?: number
  totalPrice?: number
  onCartCleared?: () => void // callback opcional
}
const ComprarCarrito = ({
  totalItems = 0,
  totalPrice = 0,
  onCartCleared,
}: ComprarCarritoProps) => {
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage();
  const handleBuyCart = async () => {
    if (totalItems === 0) {
      toast.error(t('carritoVacio'))
      return
    }

    setLoading(true)
    try {
      // 1️⃣ Generar factura en el backend desde el carrito
      const { data } = await api.post('/invoices/from-cart/')
      

      // 2️⃣ Mostrar notificación con acceso directo a la factura
      toast.success(
        <div className="flex flex-col gap-1">
          <span>{t("compraExitosa")}</span>
          <span className="text-sm text-gray-500">
            Factura #{data?.id} generada
          </span>
          <Link
            href={`/facturas/${data?.id}`}
            className="text-blue-600 underline text-sm hover:text-blue-800 mt-1"
          >
            {t("verFactura")}
          </Link>
        </div>,
        { duration: 6000 }
      )

      // 3️⃣ Vaciar carrito en frontend
      if (onCartCleared) onCartCleared()
    } catch (err: any) {
      toast.error('Error al realizar la compra ❌')
      if (axios.isAxiosError(err)) {
        console.error('❌ Error de Axios:', err.response?.data || err.message)
      } else {
        console.error('❌ Error inesperado:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4 border border-gray-100">
      {/* Resumen */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t("resumenCompra")}
          </h3>
          <p className="text-sm text-gray-500">
            {totalItems} {t("productosEnCarrito")}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-green-600">
            ${totalPrice.toLocaleString()}
          </span>
          <p className="text-sm text-gray-500">{t("totalAPagar")}</p>
        </div>
      </div>

      {/* Botón principal */}
      <button
        disabled={loading || totalItems === 0}
        onClick={handleBuyCart}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {t("procesandoCompra")}
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            {t("comprarTodo")}
          </>
        )}
      </button>

      {/* Botón explorar */}
      <Link
        href="/"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
      >
        <PackageSearch size={20} />
        {t("explorarMas")}
      </Link>

      <p className="text-xs text-gray-400 text-center">
        {t("notaFactura")}
      </p>
    </div>
  )
}

export default ComprarCarrito
