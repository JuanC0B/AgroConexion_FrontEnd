// src/components/cart/FavoriteCategories.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2, Heart, Star, Sparkles, Eye } from "lucide-react";
import { FavoriteCategory } from "@/types/product.types";
import { useRouter } from "next/navigation";

export default function FavoriteCategories() {
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter()
  // Cargar las categorías favoritas
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/cart/categories/");
        setFavorites(res.data);
      } catch (error) {
        toast.error("❌ Error al cargar categorías favoritas");
      }
    };
    fetchFavorites();
  }, []);

  // Eliminar categoría
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await api.delete(`/cart/delete-category/${id}/`);
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      toast.success("✅ Eliminado de favoritos");
    } catch (error) {
      toast.error("❌ Error al eliminar");
    } finally {
      setLoading(false);
    }
  };
  const handleViewCategory = (id: number) => {
    route.push(`/categories/${id}`)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-500 dark:to-emerald-600 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-orange-400 fill-orange-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                Mis Categorías Favoritas
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                  {favorites.length} categoría{favorites.length !== 1 ? 's' : ''} guardada{favorites.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-3xl mx-auto transition-colors duration-300 leading-relaxed">
            Tus categorías preferidas en un solo lugar. Explora y gestiona tus intereses favoritos de manera fácil y rápida
          </p>
        </div>

        {/* Contenido principal */}
        {favorites.length === 0 ? (
          /* Estado vacío mejorado */
          <div className="text-center py-16 lg:py-24">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                <Heart className="w-16 h-16 text-green-500 dark:text-green-400 animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-orange-400 dark:bg-orange-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              {/* Círculos decorativos */}
              <div className="absolute -top-4 -left-4 w-6 h-6 border-2 border-green-300 dark:border-green-600 rounded-full animate-ping"></div>
              <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
              ¡Aún no tienes favoritos!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed transition-colors duration-300">
              Explora nuestras categorías y guarda tus preferidas para acceder a ellas rápidamente
            </p>
          </div>
        ) : (
          /* Grid de categorías mejorado */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((fav, index) => (
              <div
                key={fav.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl dark:shadow-xl dark:hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Imagen mejorada */}
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 transition-colors duration-300">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${fav.category.image}`}
                      alt={fav.category.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 dark:opacity-90 dark:group-hover:opacity-100"
                      onError={(e) => {
                        // Placeholder para manejar errores de imagen
                      }}
                    />
                  </div>
                  
                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badge de favorito */}
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                      <Heart className="w-5 h-5 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Botón de ver (aparece en hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleViewCategory(fav.category.id)}
                      className="px-6 py-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl text-gray-800 dark:text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-3 hover:scale-105 border border-white/20 dark:border-gray-600/50"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver categoría</span>
                    </button>
                  </div>

                  {/* Elementos decorativos en hover */}
                  <div className="absolute top-2 left-2 w-3 h-3 bg-green-400 dark:bg-green-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-emerald-400 dark:bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"></div>
                </div>

                {/* Contenido mejorado */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1 transition-colors duration-300">
                      {fav.category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed transition-colors duration-300">
                      {fav.category.description}
                    </p>
                  </div>

                  {/* Línea decorativa */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent mb-4"></div>

                  {/* Acciones */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewCategory(fav.category.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-500 dark:to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 group"
                    >
                      <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>Ver</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(fav.id)}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
                      title="Eliminar de favoritos"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Indicador de carga mejorado */}
                {loading && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md flex items-center justify-center transition-all duration-300">
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-700 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
                      <div className="w-5 h-5 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Eliminando...</span>
                    </div>
                  </div>
                )}

                {/* Brillo sutil en hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500 pointer-events-none dark:group-hover:from-white/10"></div>
              </div>
            ))}
          </div>
        )}

        {/* Elementos decorativos de fondo */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
    </div>
);
}
