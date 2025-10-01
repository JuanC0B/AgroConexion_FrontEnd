// src/components/offers/CreateOfferForm.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Leaf, Percent, Calendar, FileText, Tag } from 'lucide-react';
import { useRouter } from "next/navigation";
interface CreateOfferFormProps {
  productId: number;
}
import { useLanguage } from '@/context/LanguageContext';
export default function CreateOfferForm({ productId }: CreateOfferFormProps) {
  const { t } = useLanguage();
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    percentage: 0,
    end_date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/offers_and_coupons/new-offert/", {
        product: productId,
        ...formData,
      });

      toast.success("✅ Oferta creada con éxito");
      setFormData({ title: "", description: "", percentage: 0, end_date: "" });
      setTimeout(() => {
        router.push(`/products/${productId}`); // limpiar después de 3s
      }, 3000);
    } catch (err: any) {
      toast.error("❌ Error al crear la oferta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen  p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="max-w-2xl mx-auto">

          {/* Header con tema campesino */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 dark:bg-green-700 rounded-full mb-4 shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-100 mb-2 transition-colors duration-300">
              {t('formOfertaTitulo')}
            </h1>
            <p className="text-green-600 dark:text-green-300 text-lg transition-colors duration-300">
              {t('formOfertaSubtitulo')}
            </p>
          </div>

          {/* Formulario principal */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden border-2 border-green-100 dark:border-gray-700">
            {/* Header del formulario */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 px-6 sm:px-8 py-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                <Tag className="w-6 h-6" />
                {t('formOfertaHeader')}
              </h2>
              <p className="text-green-100 dark:text-green-200 mt-1 text-sm">
                {t('formOfertaHeaderDesc')}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Campo Título */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
                  <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                  {t('formTituloLabel')}
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder={t('formTituloPlaceholder')}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-green-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                  required
                />
              </div>

              {/* Campo Descripción */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  {t('formDescripcionLabel')}
                </label>
                <textarea
                  name="description"
                  placeholder={t('formDescripcionPlaceholder')}
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-green-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none bg-white dark:bg-gray-700"
                />
              </div>

              {/* Grid responsivo para porcentaje y fecha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Porcentaje */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
                    <Percent className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {t('formDescuentoLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="percentage"
                      placeholder="15"
                      value={formData.percentage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-8 border-2 border-green-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                      min={1}
                      max={100}
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-400 font-semibold">
                      %
                    </span>
                  </div>
                </div>

                {/* Campo Fecha */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {t('formFechaLabel')}
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800/30 transition-all duration-200 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                    required
                  />
                </div>
              </div>

              {/* Vista previa de la oferta */}
              {formData.title && formData.percentage > 0 && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-dashed border-green-300 dark:border-green-600/50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {t('formVistaPrevia')}
                  </h3>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-green-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-green-800 dark:text-green-200 text-lg">{formData.title}</h4>
                        {formData.description && (
                          <p className="text-green-600 dark:text-green-300 text-sm mt-1">{formData.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formData.percentage}% OFF</div>
                        {formData.end_date && (
                          <div className="text-xs text-green-500 dark:text-green-400">{t('formVistaPreviaHasta')} {new Date(formData.end_date).toLocaleDateString()}</div>
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
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-700 dark:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg dark:shadow-gray-900/30 hover:shadow-xl dark:hover:shadow-gray-900/40 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t('formBotonCreando')}
                    </>
                  ) : (
                    <>
                      <Leaf className="w-5 h-5" />
                      {t('formBotonCrear')}
                    </>
                  )}
                </button>
              </div>

              {/* Mensaje informativo */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4 flex items-start gap-3">
                <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700 dark:text-green-300">
                  <p className="font-semibold mb-1">{t('formConsejoTitulo')}</p>
                  <p>{t('formConsejoTexto')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
