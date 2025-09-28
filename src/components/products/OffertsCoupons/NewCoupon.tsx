// src/components/coupons/CreateCouponForm.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Percent,
  Calendar,
  FileText,
  DollarSign,
  Sparkles,
  Gift,
} from "lucide-react";
interface CreateCouponFormProps {
  productId: number;
}
import { useLanguage } from "@/context/LanguageContext";

export default function CreateCouponForm({ productId }: CreateCouponFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    percentage: 0,
    min_purchase_amount: 0,
    end_date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/offers_and_coupons/new-coupon/", {
        product: productId,
        ...formData,
      });

      toast.success("✅ Cupón creado con éxito");
      setFormData({
        title: "",
        description: "",
        percentage: 0,
        min_purchase_amount: 0,
        end_date: "",
      });
      setTimeout(() => {
        router.push(`/products/${productId}`); // limpiar después de 3s
      }, 3000);
    } catch (err: any) {
      toast.error("❌ Error al crear el cupón");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header con tema campesino para cupones */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-full mb-4 shadow-lg dark:shadow-gray-900/30">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-800 dark:text-orange-100 mb-2">
            {t("formCuponTitulo")}
          </h1>
          <p className="text-orange-600 dark:text-orange-300 text-lg flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            {t("formCuponSubtitulo")}
          </p>
        </div>

        {/* Formulario principal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden border-2 border-orange-100 dark:border-gray-700">
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 px-6 sm:px-8 py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              {t("formCuponHeader")}
            </h2>
            <p className="text-orange-100 dark:text-orange-200 mt-1 text-sm">
              {t("formCuponHeaderDesc")}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Campo Título */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Ticket className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                {t("formCuponNombreLabel")}
              </label>
              <input
                type="text"
                name="title"
                placeholder={t("formCuponNombrePlaceholder")}
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                required
              />
            </div>

            {/* Campo Descripción */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                {t("formCuponDescripcionLabel")}
              </label>
              <textarea
                name="description"
                placeholder={t("formCuponDescripcionPlaceholder")}
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none bg-white dark:bg-gray-700"
              />
            </div>

            {/* Grid responsivo para porcentaje y monto mínimo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Porcentaje */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <Percent className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  {t("formCuponDescuentoLabel")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="percentage"
                    placeholder="20"
                    value={formData.percentage || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-8 border-2 border-orange-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                    min={1}
                    max={100}
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 dark:text-orange-400 font-semibold">
                    %
                  </span>
                </div>
              </div>

              {/* Campo Monto Mínimo */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  {t("formCuponMinimoLabel")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 dark:text-orange-400 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    name="min_purchase_amount"
                    placeholder="50000"
                    value={formData.min_purchase_amount || ""}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Campo Fecha de Vencimiento */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                {t("formCuponFechaLabel")}
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                required
              />
            </div>

            {/* Vista previa del cupón */}
            {formData.title && formData.percentage > 0 && (
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-dashed border-orange-300 dark:border-orange-600/50 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t("formCuponVistaPrevia")}
                </h3>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-orange-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-orange-800 dark:text-orange-200 text-lg">
                        {formData.title}
                      </h4>
                      {formData.description && (
                        <p className="text-orange-600 dark:text-orange-300 text-sm mt-1">
                          {formData.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formData.percentage}% OFF
                      </div>
                      {formData.min_purchase_amount > 0 && (
                        <div className="text-xs text-orange-500 dark:text-orange-400">
                          Min: ${formData.min_purchase_amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 hover:from-orange-600 hover:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg dark:shadow-gray-900/30 hover:shadow-xl dark:hover:shadow-gray-900/40 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t("formCuponBotonCreando")}
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5" />
                    {t("formCuponBotonCrear")}
                  </>
                )}
              </button>
            </div>

            {/* Mensaje informativo */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex items-start gap-3">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-semibold mb-1">
                  {t("formCuponConsejoTitulo")}
                </p>
                <p>{t("formCuponConsejoTexto")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
