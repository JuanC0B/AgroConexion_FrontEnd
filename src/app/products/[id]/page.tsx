// src/app/products/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";
import Image from "next/image";
import { Product } from "@/types/product.types";
import { useParams } from "next/navigation";
import AgregarCarrito from "@/components/cart/agregar";
import BuyProduct from "@/components/cart/ComprarProducto";
import ComentsProduct from "@/components/comments/comments";
import { useLanguage } from '@/context/LanguageContext';

import {
  Home,
  ChevronRight,
  Heart,
  Truck,
  ShieldCheck,
  Tag,
} from "lucide-react";
import Link from "next/link";
import RatingStats from "@/components/products/ratingProdfuct";
import NewRating from "@/components/products/NewRating";


const DetailProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { t } = useLanguage();
  const params = useParams();
  const productId = params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/detail/${productId}/`
        );
        setProduct(res.data);

        if (res.data.images?.length > 0) {
          setSelectedImage(res.data.images[0].image);
        }
      } catch (err) {
        setError("No se pudo cargar el producto. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const toggleFavorite = async () => {
  if (!product) return;

  try {
    if (favorites.includes(product.id)) {
      // Si ya está en favoritos, eliminar
      await api.delete(`/cart/delete-favorites/${product.id}/`);
      setFavorites(favorites.filter((id) => id !== product.id));
    } else {
      // Intentamos agregarlo
      await api.post(`/cart/favorites/`, { product: product.id });
      setFavorites([...favorites, product.id]);
    }
  } catch (error: any) {
    // Revisamos si el error es 400 y corresponde a "ya agregado"
    if (error.response?.status === 400) {
      console.log("El producto ya estaba en favoritos, se eliminará.");
      try {
        await api.delete(`/cart/delete-favorites/${product.id}/`);
        setFavorites(favorites.filter((id) => id !== product.id));
      } catch (deleteError) {
        console.error("Error al eliminar favorito duplicado:", deleteError);
      }
    } else {
      console.error("Error al manejar favoritos:", error);
    }
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">
          {t("cargandoProducto")}
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center p-10">
        <p className="text-red-600 font-medium">
          {error || "Producto no encontrado"}
        </p>
      </div>
    );
  }

  // 🔥 Calcular precios con oferta
  const originalPrice = product.price;

  const discountPercentage = product.offers
    ? parseFloat(product.offers.percentage)
    : 0;

  const discountedPrice =
    discountPercentage > 0
      ? originalPrice - (originalPrice * discountPercentage) / 100
      : originalPrice; // 👈 en vez de null, mantenemos el precio original

  const ahorro = discountPercentage > 0 ? originalPrice - discountedPrice : 0; // 👈 si no hay oferta, no hay ahorro

  return (
    <>
      {/* 🧭 Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Home className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              {t("inicio")}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              {t("productos")}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 📦 Contenido */}
      <div className="container mx-auto px-6 py-6 max-w-7xl bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 🖼️ Imágenes */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}
              {selectedImage && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${selectedImage}`}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-500 hover:scale-105 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {product.images?.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setSelectedImage(img.image);
                      setImageLoaded(false);
                    }}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shadow-sm flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                      selectedImage === img.image
                        ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${img.image}`}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="object-cover rounded transition-transform duration-200 hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 📊 Estadísticas de calificaciones debajo de la imagen */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <RatingStats productId={product.id} />
            </div>
          </div>

          {/* 📝 Información */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full"></div>
            </div>

            {/* 💰 Bloque de precios + rating + stock */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Precios */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      ${discountedPrice.toLocaleString("es-CO")}
                    </p>
                    {discountPercentage > 0 && (
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-1 rounded-full font-semibold animate-pulse">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {discountPercentage > 0 && (
                    <div className="space-y-1">
                      <p className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${originalPrice.toLocaleString("es-CO")}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {t("¡ahorras")} ${ahorro.toLocaleString("es-CO")}!
                      </p>
                    </div>
                  )}
                </div>

                {/* ⭐ Nuevo rating + stock */}
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                    <NewRating productId={product.id} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("stockDisponible")}{" "}
                      <span className="font-semibold text-green-600 dark:text-green-400">{product.stock}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 🛒 Acciones */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <AgregarCarrito productId={product.id} />
              </div>
              <div className="flex-1">
                <BuyProduct productId={product.id} />
              </div>
              <button
                onClick={toggleFavorite}
                className={`p-4 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:scale-105 group ${
                  favorites.includes(product.id)
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 shadow-red-200 dark:shadow-red-900/50"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Heart className={`w-6 h-6 transition-transform duration-200 ${favorites.includes(product.id) ? 'fill-current animate-pulse' : 'group-hover:scale-110'}`} />
              </button>
            </div>

            {/* 📜 Descripción */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📝</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t("descripcion")}</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* 🎁 Info extra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.coupon ? (
                <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Tag className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">{t("cuponDisponible")}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Compra un mínimo de $
                      {parseFloat(product.coupon.min_purchase_amount).toLocaleString("es-CO")}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                      <span className="text-xs text-purple-700 dark:text-purple-300 font-mono font-bold">
                        {product.coupon.code}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Truck className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-700 dark:text-green-300 mb-1">{t("productosPremium")}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("disfrutaProductos")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <ShieldCheck className="text-white w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">{t("garantiaTotal")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("garantiaCalidad")} 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 💬 Comentarios */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t("comentariosYResenas")}</h2>
          </div>
          <ComentsProduct productId={product.id} />
        </div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/10 dark:bg-blue-900/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-200/10 dark:bg-green-900/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </>
  );
};

export default DetailProduct;
