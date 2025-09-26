"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: Category[];
  images: ProductImage[];
}

export default function EditProductForm({ productId }: { productId: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deleteImages, setDeleteImages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar producto y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/detail/${productId}/`),
          api.get("/products/categories/"),
        ]);

        setProduct(productRes.data);
        setCategories(categoriesRes.data);
        console.log(productRes.data.images);
        // Extraer ids de categorías del producto
        if (productRes.data.categories) {
          setSelectedCategories(productRes.data.categories.map((c: Category) => c.id));
        }
      } catch (error) {
        toast.error("Error cargando datos del producto");
        console.error(error);
      }
    };

    fetchData();
  }, [productId]);

  // 2. Manejo de selección de categorías
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // 3. Manejo de imágenes nuevas
  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  // 4. Manejo de eliminar imágenes existentes
  const handleDeleteImage = (id: number) => {
    setDeleteImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  // 5. Submit edición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));

      formData.append("categories", JSON.stringify(selectedCategories));
      newImages.forEach((img) => formData.append("images", img));
      deleteImages.forEach((id) => formData.append("delete_images", String(id)));

      // Debug 👇
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await api.put(`/products/edit-product/${product.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Producto actualizado con éxito");
    } catch (error) {
      toast.error("❌ Error al actualizar producto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center text-gray-500">Cargando producto...</p>;

return (
  <form
    onSubmit={handleSubmit}
    className="mt-10 mb-10 max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
  >
    {/* Header */}
    <div className="text-center">
      <div className="inline-flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
          Editar producto
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Modifica los detalles de tu producto
      </p>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-400 rounded-full mx-auto"></div>
    </div>

    {/* Nombre */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Nombre del producto
      </label>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        className="mt-2 block w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 p-3 transition-all duration-200"
        placeholder="Ej. Café orgánico premium"
      />
    </div>

    {/* Descripción */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Descripción
      </label>
      <textarea
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        className="mt-2 block w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 p-3 transition-all duration-200 resize-none"
        rows={4}
        placeholder="Agrega detalles sobre el producto..."
      />
    </div>

    {/* Precio y Stock */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Precio (COP)
        </label>
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          className="mt-2 block w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 p-3 transition-all duration-200"
          placeholder="0"
          min="0"
        />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Stock disponible
        </label>
        <input
          type="number"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
          className="mt-2 block w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 p-3 transition-all duration-200"
          placeholder="0"
          min="0"
        />
      </div>
    </div>

    {/* Categorías */}
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Categorías
      </label>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat, index) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggleCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              selectedCategories.includes(cat.id)
                ? "bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>

    {/* Imágenes existentes */}
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Imágenes actuales
      </label>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap gap-4">
          {product.images?.length > 0 ? (
            product.images.map((img, index) => (
              <div 
                key={img.id} 
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${img.image}`}
                    alt="Product"
                    width={112}
                    height={112}
                    className={`w-28 h-28 object-cover rounded-xl border-2 shadow-lg transition-all duration-300 group-hover:scale-105 ${
                      deleteImages.includes(img.id) 
                        ? "opacity-40 border-red-400 dark:border-red-500" 
                        : "border-gray-200 dark:border-gray-600 group-hover:border-green-400 dark:group-hover:border-green-500"
                    }`}
                    style={{ objectFit: "cover" }}
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className={`absolute -top-2 -right-2 text-white text-xs px-3 py-1 rounded-lg shadow-lg font-semibold transition-all duration-200 hover:scale-110 ${
                    deleteImages.includes(img.id)
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deleteImages.includes(img.id) ? "Deshacer" : "Eliminar"}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 w-full">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No hay imágenes registradas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Nuevas imágenes */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Agregar nuevas imágenes
      </label>
      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImages}
          className="mt-2 block w-full text-sm text-gray-700 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer focus:outline-none hover:border-green-400 dark:hover:border-green-500 transition-colors duration-200 p-4 bg-gray-50 dark:bg-gray-700/50"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Arrastra archivos aquí o haz clic para seleccionar
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Botón de envío */}
    <div className="flex justify-end pt-4">
      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center gap-3 group"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Guardando cambios...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Guardar cambios</span>
          </>
        )}
      </button>
    </div>
  </form>
);

}
