"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { X, Upload, ImageIcon, Plus } from "lucide-react";

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

// Interfaz para manejar las nuevas imágenes con preview
interface NewImagePreview {
  file: File;
  preview: string;
  id: string; // ID temporal para identificarlas
}

export default function EditProductForm({ productId }: { productId: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
  const [deleteImages, setDeleteImages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  // Limpiar URLs de preview al desmontar el componente
  useEffect(() => {
    return () => {
      newImages.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [newImages]);

  // 2. Manejo de selección de categorías
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // 3. Procesar archivos seleccionados
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen válida`);
        return false;
      }
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} es muy grande (máximo 5MB)`);
        return false;
      }
      return true;
    });

    // Crear previews para archivos válidos
    const newPreviews: NewImagePreview[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `new-${Date.now()}-${Math.random()}`
    }));

    setNewImages(prev => [...prev, ...newPreviews]);
  };

  // 4. Manejo de archivos desde input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
      e.target.value = '';
    }
  };

  // 5. Manejo de drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // 6. Eliminar imagen nueva (preview)
  const removeNewImage = (id: string) => {
    setNewImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  // 7. Manejo de eliminar imágenes existentes
  const handleDeleteImage = (id: number) => {
    setDeleteImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  // 8. Submit edición
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
      
      // Agregar solo los archivos File al FormData
      newImages.forEach((img) => formData.append("images", img.file));
      deleteImages.forEach((id) => formData.append("delete_images", String(id)));

      await api.put(`/products/edit-product/${product.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Producto actualizado con éxito");
      
      // Limpiar las nuevas imágenes después del éxito
      newImages.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      setNewImages([]);
      
    } catch (error) {
      toast.error("❌ Error al actualizar producto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Cargando producto...</p>
      </div>
    </div>
  );

return (
  <form
    onSubmit={handleSubmit}
    className="mt-10 mb-10 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
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
        <ImageIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
        Imágenes actuales
      </label>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {product.images?.length > 0 ? (
            product.images.map((img, index) => (
              <div 
                key={img.id} 
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${img.image}`}
                    alt="Product"
                    fill
                    className={`object-cover rounded-xl border-2 shadow-lg transition-all duration-300 group-hover:scale-105 ${
                      deleteImages.includes(img.id) 
                        ? "opacity-40 border-red-400 dark:border-red-500 grayscale" 
                        : "border-gray-200 dark:border-gray-600 group-hover:border-green-400 dark:group-hover:border-green-500"
                    }`}
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className={`absolute -top-2 -right-2 text-white text-xs px-2 py-1 rounded-lg shadow-lg font-semibold transition-all duration-200 hover:scale-110 flex items-center gap-1 ${
                    deleteImages.includes(img.id)
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deleteImages.includes(img.id) ? (
                    <>
                      <Plus className="w-3 h-3 rotate-45" />
                      Deshacer
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No hay imágenes registradas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Zona de subida mejorada con drag & drop */}
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <Upload className="w-4 h-4 text-green-500 dark:text-green-400" />
        Agregar nuevas imágenes
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
          (Máximo 5MB por imagen)
        </span>
      </label>
      
      {/* Drag & Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group ${
          dragActive
            ? "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20 scale-102"
            : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700/30"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            dragActive 
              ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 scale-110" 
              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-green-100 dark:group-hover:bg-green-800 group-hover:text-green-600 dark:group-hover:text-green-400"
          }`}>
            <Upload className={`w-8 h-8 transition-transform duration-300 ${dragActive ? "scale-110" : "group-hover:scale-110"}`} />
          </div>
          
          <div className="space-y-2">
            <p className={`text-lg font-medium transition-colors duration-300 ${
              dragActive 
                ? "text-green-600 dark:text-green-400" 
                : "text-gray-700 dark:text-gray-300"
            }`}>
              {dragActive ? "¡Suelta las imágenes aquí!" : "Arrastra imágenes aquí"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              o <span className="text-green-600 dark:text-green-400 font-medium">haz clic para seleccionar archivos</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              PNG, JPG, GIF hasta 5MB cada una
            </p>
          </div>
        </div>
      </div>

      {/* Preview de nuevas imágenes */}
      {newImages.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              Nuevas imágenes ({newImages.length})
            </h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newImages.map((img, index) => (
              <div 
                key={img.id} 
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <Image
                    src={img.preview}
                    alt="Nueva imagen"
                    fill
                    className="object-cover rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeNewImage(img.id)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow-lg font-semibold transition-all duration-200 hover:scale-110 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Quitar
                </button>

                {/* Indicador de archivo nuevo */}
                <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg shadow-lg font-semibold">
                  Nuevo
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2">
            💡 Estas imágenes se subirán al guardar los cambios
          </div>
        </div>
      )}
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
            <span>
              Guardar cambios
              {(newImages.length > 0 || deleteImages.length > 0) && (
                <span className="text-xs ml-1 opacity-80">
                  ({newImages.length > 0 && `+${newImages.length}`}{newImages.length > 0 && deleteImages.length > 0 && ", "}{deleteImages.length > 0 && `-${deleteImages.length}`})
                </span>
              )}
            </span>
          </>
        )}
      </button>
    </div>
  </form>
);

}