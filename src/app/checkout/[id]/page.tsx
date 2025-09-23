// src/app/checkout/[id]/page.tsx
"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import axios from "axios";
import NotAuthenticated from "@/components/errores/Authorization";

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id;
  const quantity = Number(searchParams.get("qty") || 1);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<"efectivo" | "tarjeta_debito">("efectivo");
  const [coupon, setCoupon] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const router = useRouter()
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/products/detail/${productId}/`);
        setProduct(res.data);
      } catch (err) {
        toast.error("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleConfirm = async () => {
    try {
      const payload: any = {
        method,
        items: [
            {
                product_id: productId,
                quantity,
                ...(coupon ? { coupon: { code: coupon } } : {}),
            },
        ],
      };

      const res = await api.post("/invoices/create/", payload);
      toast.success("✅ Compra realizada con éxito");
      const timer = setTimeout(() => {
        router.push(ROUTES.FACTURACION);
    }, 3000); // 3 segundos
    } catch (err: any) {
        const status = err.response?.status;
        if (status === 401) {
            toast.error('No estas autorizado')
        }
      toast.error("❌ Error al procesar la compra");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>Producto no encontrado</p>;

  // 🔥 calcular precios
  const originalPrice = product.price;
  const discount = product.offers
    ? parseFloat(product.offers.percentage)
    : 0;
  const discountedPrice =
    discount > 0
      ? originalPrice - (originalPrice * discount) / 100
      : originalPrice;
  const total = discountedPrice * quantity;

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Finalizar Compra</h1>
        <p className="text-gray-600 dark:text-gray-400">Revisa tu pedido y completa la información de pago</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Columna Principal - Información del producto y pago */}
        <div className="lg:col-span-2 space-y-6">
          {/* Producto */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-6 h-6 mr-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              Producto Seleccionado
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative group">
                  <Image
                    src={`http://127.0.0.1:8000${product.images[0]?.image}`}
                    alt={product.name}
                    width={140}
                    height={140}
                    className="rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-300"
                  />
                  {discount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      -{discount}%
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Cantidad: <span className="font-medium text-gray-900 dark:text-white">{quantity} unidades</span>
                </p>
                
                <div className="space-y-2">
                  {discount > 0 ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${discountedPrice.toLocaleString("es-CO")}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${originalPrice.toLocaleString("es-CO")}
                      </span>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                        Ahorro: ${((originalPrice - discountedPrice) * quantity).toLocaleString("es-CO")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${discountedPrice.toLocaleString("es-CO")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cupón de descuento */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-6 h-6 mr-2 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              Cupón de Descuento
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Ingresa tu cupón de descuento"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
              <button 
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-500 dark:hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Aplicar
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              ¿Tienes un cupón? Ingrésalo para obtener descuentos adicionales
            </p>
          </div>

          {/* Método de pago */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-6 h-6 mr-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              Método de Pago
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                method === "efectivo" 
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800" 
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
              }`}>
                <input
                  type="radio"
                  value="efectivo"
                  checked={method === "efectivo"}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                    <span className="text-lg">💵</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Efectivo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pago contra entrega</p>
                  </div>
                </div>
              </label>

              <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                method === "tarjeta_debito" 
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800" 
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
              }`}>
                <input
                  type="radio"
                  value="tarjeta_debito"
                  checked={method === "tarjeta_debito"}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Tarjeta</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Débito/Crédito</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Formulario de tarjeta */}
            {method === "tarjeta_debito" && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="w-5 h-5 mr-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  Datos de la Tarjeta
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del titular</label>
                    <input
                      type="text"
                      placeholder="Juan Pérez"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de vencimiento</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Tu información está protegida con encriptación SSL
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Lateral - Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8 transition-colors duration-300">
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
                <span>Subtotal ({quantity} {quantity === 1 ? 'producto' : 'productos'})</span>
                <span>${(originalPrice * quantity).toLocaleString("es-CO")}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Descuento ({discount}%)</span>
                  <span>-${((originalPrice - discountedPrice) * quantity).toLocaleString("es-CO")}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Envío</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">${total.toLocaleString("es-CO")}</span>
                </div>
              </div>
            </div>

            {discount > 0 && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <p className="text-green-800 dark:text-green-300 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ¡Excelente! Estás ahorrando ${((originalPrice - discountedPrice) * quantity).toLocaleString("es-CO")}
                </p>
              </div>
            )}

            <button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Confirmar Compra
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Al confirmar tu compra, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
