// src/app/my-products/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import UserProducts from "@/components/user/MyProducts";
import { Product } from "@/types/product.types";
import { Package, Sparkles, Star, ShoppingBag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/my-products/");
        setProducts(res.data.products ?? []);
        console.log(res.data.products);
      } catch (error) {
        console.error(t("errorAlcargar"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const Router = () => {
    router.push(ROUTES.NEWPRODUCT);
  };

  if (loading) {
    return <p className="p-6">{t("cargandoProductos")}</p>;
  }

  return (
    <div className="p-6">
      {/* Header mejorado */}
      <div className="text-center mb-8 lg:mb-12">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Package className="w-8 h-8 text-white fill-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-orange-400 fill-orange-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              {t("misProductos")}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                {products.length} {t("myproductsparrafo")}
                {products.length !== 1 ? "s" : ""} {t("myproductsparrafo2")}
                {products.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-3xl mx-auto transition-colors duration-300 leading-relaxed">
          {t("myproductsparrafo3")}
        </p>
      </div>

      {/* Contenido condicional */}
      {products.length > 0 ? (
        <UserProducts products={products} />
      ) : (
        // Mensaje de "no productos" mejorado
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg animate-bounce">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              {t("noproductos")}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {t("mensaje")}
            </p>

            <div className="space-y-4">
              <button
                onClick={Router}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 inline-block mr-2" />
                {t("agregar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
