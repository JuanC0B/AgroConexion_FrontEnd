"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  TicketPercent,
  Calendar,
  CreditCard,
  Copy,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
interface Coupon {
  id: number;
  coupon: {
    id: number;
    description: string;
    percentage: string;
    min_purchase_amount: string;
    start_date: string;
    end_date: string;
    active: boolean;
    code: string;
    seller: number;
    product: number;
  };
  used: boolean;
  assigned_at: string;
}

export default function UserCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/offers_and_coupons/user/coupons/");
        setCoupons(res.data);
      } catch (error) {
        toast.error("❌ Error cargando los cupones");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        🎟️ No tienes cupones disponibles.
      </div>
    );
  }
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Aquí podrías agregar un toast o notificación
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <TicketPercent className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Mis Cupones
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {coupons.filter(item => !item.used && new Date(item.coupon.end_date) >= new Date()).length} disponibles
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Aprovecha tus descuentos disponibles y ahorra en tu próxima compra
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-full mx-auto"></div>
        </div>

        {/* Grid responsivo mejorado */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {coupons.map((item, index) => {
            const { coupon, used } = item;
            const expired = new Date(coupon.end_date) < new Date();
            const isDisabled = used || expired;

            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl group ${
                  isDisabled
                    ? "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                    : "bg-white dark:bg-gray-800 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700 hover:-translate-y-2"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decoración superior */}
                <div
                  className={`h-3 ${
                    isDisabled
                      ? "bg-gray-300 dark:bg-gray-600"
                      : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400"
                  }`}
                />

                <div className="p-6">
                  {/* Header del cupón */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          isDisabled
                            ? "bg-gray-200 dark:bg-gray-700"
                            : "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
                        }`}
                      >
                        <TicketPercent
                          className={`w-5 h-5 ${
                            isDisabled ? "text-gray-400 dark:text-gray-500" : "text-purple-600 dark:text-purple-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-bold text-sm sm:text-base leading-tight ${
                            isDisabled ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"
                          }`}
                        >
                          {coupon.description || "Cupón especial"}
                        </h3>
                      </div>
                    </div>

                    {/* Badge de estado */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        used
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : expired
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      }`}
                    >
                      {used ? "Usado" : expired ? "Expirado" : "Disponible"}
                    </div>
                  </div>

                  {/* Descuento destacado */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-block ${
                        isDisabled
                          ? "text-gray-400 dark:text-gray-500"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl font-bold">
                        {coupon.percentage}%
                      </span>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${isDisabled ? "text-gray-500 dark:text-gray-400" : "text-gray-600 dark:text-gray-300"}`}>
                      de descuento
                    </p>
                  </div>

                  {/* Detalles del cupón */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard
                        className={`w-4 h-4 ${
                          isDisabled ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          isDisabled ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"
                        }
                      >
                        Compra mínima:{" "}
                        <strong className={isDisabled ? "text-gray-600 dark:text-gray-400" : "text-purple-600 dark:text-purple-400"}>
                          $
                          {Number(coupon.min_purchase_amount).toLocaleString(
                            "es-CO"
                          )}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar
                        className={`w-4 h-4 ${
                          expired
                            ? "text-red-500 dark:text-red-400"
                            : isDisabled
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          expired
                            ? "text-red-600 dark:text-red-400"
                            : isDisabled
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      >
                        Válido hasta:{" "}
                        <strong>
                          {new Date(coupon.end_date).toLocaleDateString("es-CO")}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Código del cupón */}
                  <div
                    className={`p-4 rounded-xl border-2 border-dashed ${
                      isDisabled
                        ? "bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                        : "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="">
                        <p className={`text-xs mb-1 ${isDisabled ? "text-gray-500 dark:text-gray-400" : "text-gray-600 dark:text-gray-400"}`}>
                          Código:
                        </p>
                        <code
                          className={`font-mono font-bold text-lg ${
                            isDisabled ? "text-gray-500 dark:text-gray-400" : "text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          {coupon.code}
                        </code>
                      </div>
                      {!isDisabled && (
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-200 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:scale-110"
                          title="Copiar código"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Botón de usar */}
                  {!isDisabled && (
                    <Link 
                      href={`/products/${coupon.product}`}
                      className="mt-4 block w-full bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white text-center py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Usar cupón</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                        </svg>
                      </div>
                    </Link>
                  )}

                  {/* Overlay para cupones deshabilitados */}
                  {isDisabled && (
                    <div className="absolute inset-0 bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            used ? "bg-red-500 dark:bg-red-600" : "bg-gray-500 dark:bg-gray-600"
                          } shadow-lg`}
                        >
                          <span className="text-white font-bold text-xl">
                            {used ? "✕" : "⏰"}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-semibold">
                          {used ? "Cupón Utilizado" : "Cupón Expirado"}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {used ? "Ya has usado este cupón" : "La fecha de validez ha expirado"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent dark:group-hover:from-white/10 transition-all duration-500 pointer-events-none rounded-3xl"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vacío mejorado */}
        {coupons.length === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <TicketPercent className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 dark:bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">0</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No tienes cupones disponibles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Los cupones aparecerán aquí cuando estén disponibles
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Compra productos para obtener cupones</span>
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
