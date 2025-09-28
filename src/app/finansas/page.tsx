// src/app/finansas/page.tsx
'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useLanguage } from '@/context/LanguageContext'
import {
  Loader2,
  TrendingUp,
  ShoppingCart,
  Wallet,
  DollarSign,
  Package,
  Star,
} from 'lucide-react'

interface Product {
  name: string
  quantity: number
}

interface StatsResponse {
  total_spent: number
  total_earned: number
  most_sold_product: Product
  least_sold_product: Product
}

export default function UserStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return
    const fetchStats = async () => {
      try {
        const res = await api.get('/invoices/stats/')
        setStats(res.data)
      } catch (error) {
        console.error('Error al cargar las estadísticas', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [hasMounted])

  const formatCurrency = (amount: number) => {
    if (!hasMounted) return amount.toString()
    return amount.toLocaleString('es-CO')
  }

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex">
        <main className="mt-16 ml-64 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 flex-1">
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-gray-400">{t("finanzasCargando")}</div>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <main className="mt-16 ml-64 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 flex-1">
          <div className="max-w-7xl mx-auto py-10 flex items-center justify-center h-40">
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {t("finanzasCargandoEstadisticas")}
              </span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex">
        <main className="mt-16 ml-64 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 flex-1">
          <div className="max-w-7xl mx-auto py-10">
            <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center">
              <p className="text-red-700 dark:text-red-400 font-medium">
                {t("finanzasErrorTitulo")}
              </p>
              <p className="text-red-600 dark:text-red-500 text-sm mt-2">
                {t("finanzasErrorMensaje")}
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <main className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 flex-1">
        <div className="max-w-6xl mx-auto py-10 flex flex-col items-center">
          {/* Grid de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
            <StatCard
              icon={<ShoppingCart className="w-8 h-8" />}
              title={t("finanzasTotalGastado")}
              value={`$${formatCurrency(stats.total_spent)}`}
              description={t("finanzasTotalGastadoDesc")}
              color="blue"
              trend="+2.5%"
            />
            <StatCard
              icon={<Wallet className="w-8 h-8" />}
              title={t("finanzasTotalGanado")}
              value={`$${formatCurrency(stats.total_earned)}`}
              description={t("finanzasTotalGanadoDesc")}
              color="green"
              trend="+8.2%"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title={t("finanzasProductoMasVendido")}
              value={stats.most_sold_product.name}
              description={`${stats.most_sold_product.quantity} unidades`}
              color="emerald"
              trend="Popular"
            />
            <StatCard
              icon={<Package className="w-8 h-8" />}
              title={t("finanzasProductoMenosVendido")}
              value={stats.least_sold_product.name}
              description={`${stats.least_sold_product.quantity} unidades`}
              color="orange"
              trend="Mejorar"
            />
          </div>

          {/* Secciones extra */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Balance */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full hover:shadow-md hover:scale-[1.02] transition-transform">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t("finanzasBalanceGeneral")}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t("finanzasIngresos")}</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    +${formatCurrency(stats.total_earned)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t("finanzasGastos")}</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    -${formatCurrency(stats.total_spent)}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {t("finanzasBalanceNeto")}
                    </span>
                    <span
                      className={`font-bold ${
                        stats.total_earned - stats.total_spent >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      ${formatCurrency(stats.total_earned - stats.total_spent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Productos destacados */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full hover:shadow-md hover:scale-[1.02] transition-transform">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t("finanzasProductosDestacados")}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {t("finanzasMasVendido")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.most_sold_product.name}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                    {stats.most_sold_product.quantity} {t("finanzasVendidos")}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {t("finanzasMenosVendido")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.least_sold_product.name}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-300 text-xs font-medium rounded-full">
                    {stats.least_sold_product.quantity} {t("finanzasVendidos")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  description,
  color,
  trend,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
  color: 'blue' | 'green' | 'emerald' | 'orange'
  trend: string
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    emerald:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400',
    orange:
      'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
  }

  const trendClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30',
    green:
      'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
    emerald:
      'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
    orange:
      'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}
        >
          {icon}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${trendClasses[color]}`}
        >
          {trend}
        </span>
      </div>
      <div className="space-y-1">
        <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {title}
        </h4>
        <p
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate"
          title={value}
        >
          {value}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  )
}
