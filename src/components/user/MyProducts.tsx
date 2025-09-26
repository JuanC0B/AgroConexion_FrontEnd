// src/components/products/UserProducts.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product.types";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Edit2, Trash2, Tag, Gift, AlertTriangle } from 'lucide-react';
interface Props {
  products: Product[];
}

const UserProducts: React.FC<Props> = ({ products }) => {
  const router = useRouter();

  // Desactivar oferta
  const handleDeactivateOffer = async (offerId: number) => {
    try {
      await api.put(`/offers_and_coupons/offers/${offerId}/active/`, {
        active: false,
      });
      toast.success("❌ Oferta desactivada");

      router.refresh();
    } catch (error) {
      toast.error("⚠️ Error al desactivar la oferta");
      console.log(error)
    }
  };

  // Desactivar cupón
  const handleDeactivateCoupon = async (couponId: number) => {
    try {
      await api.put(`/offers_and_coupons/coupon/${couponId}/active/`, {
        active: false,
      });
      toast.success("❌ Cupón desactivado");
      router.refresh();
    } catch (error) {
      toast.error("⚠️ Error al desactivar el cupón");
    }
  };
  
  const handleDeleteProduct = async (productId: number) => {
    try {
        await api.put(`/products/delete-product/${productId}/`,);
      toast.success("Producto Eliminado");
      router.refresh();
    } catch (error) {
        
    }
  }
  

return (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/20 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/30 transition-shadow duration-300 flex flex-col border dark:border-gray-700"
      >
        {/* Imagen principal */}
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
          {product.images?.length > 0 ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${product.images[0].image}`}
              alt={`Imagen de ${product.name}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
          
          {/* Badges de estado */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.offers && (
              <span className="bg-red-500 dark:bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                Oferta
              </span>
            )}
            {product.coupon && (
              <span className="bg-green-500 dark:bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                Cupón
              </span>
            )}
            {product.stock <= 0 && (
              <span className="bg-gray-500 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                Sin stock
              </span>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
            {product.name}
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 flex-1">
            {product.description || 'Sin descripción disponible'}
          </p>
          
          <div className="space-y-2 mb-4">
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              ${product.price?.toLocaleString() || '0'} 
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                / {product.unit_of_measure || 'unidad'}
              </span>
            </p>
            
            <p className={`text-sm ${product.stock <= 10 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
              Stock: {product.stock || 0} 
              {product.stock <= 10 && product.stock > 0 && (
                <AlertTriangle className="inline w-4 h-4 ml-1" />
              )}
            </p>
          </div>

          {/* Botones de ofertas y cupones */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {product.offers ? (
              <button
                onClick={() => handleDeactivateOffer(product.offers!.id)}
                className="flex items-center justify-center gap-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 py-2 px-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                aria-label={`Desactivar oferta de ${product.name}`}
              >
                <Tag className="w-4 h-4" />
                Quitar oferta
              </button>
            ) : (
              <button
                onClick={() => router.push(`/products/Offert_And_Coupon/offert/${product.id}`)}
                className="flex items-center justify-center gap-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                aria-label={`Añadir oferta a ${product.name}`}
              >
                <Tag className="w-4 h-4" />
                Añadir oferta
              </button>
            )}

            {product.coupon ? (
              <button
                onClick={() => handleDeactivateCoupon(product.coupon!.id)}
                className="flex items-center justify-center gap-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 py-2 px-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                aria-label={`Desactivar cupón de ${product.name}`}
              >
                <Gift className="w-4 h-4" />
                Quitar cupón
              </button>
            ) : (
              <button
                onClick={() => router.push(`/products/Offert_And_Coupon/coupon/${product.id}`)}
                className="flex items-center justify-center gap-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 py-2 px-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
                aria-label={`Añadir cupón a ${product.name}`}
              >
                <Gift className="w-4 h-4" />
                Añadir cupón
              </button>
            )}
          </div>

          {/* Botones de acción principales */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => router.push(`/products/edit/${product.id}`)}
              className="flex items-center justify-center gap-2 bg-amber-500 dark:bg-amber-600 text-white py-2.5 px-4 rounded-lg hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors font-medium shadow-sm"
              aria-label={`Editar producto ${product.name}`}
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            
            <button
              onClick={() => {handleDeleteProduct(product.id)}}
              className="flex items-center justify-center gap-2 bg-red-500 dark:bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors font-medium shadow-sm"
              aria-label={`Eliminar producto ${product.name}`}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);
};

export default UserProducts;


