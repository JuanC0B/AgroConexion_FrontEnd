// src/app/products/new/page.tsx

"use client";

// Importación de tipos y dependencias
import {
  NewProduct,
  Categories,
  UnitOfMeasure,
  Image,
  CategoryProducs,
} from "@/types/product.types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getStoredTokens } from "@/lib/auth";
import axios from "axios";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Componente CreateProduct
 *
 * Pantalla para crear un nuevo producto en AgroConexión.
 * Incluye:
 * - Validación de autenticación
 * - Formulario con inputs controlados
 * - Manejo de imágenes
 * - Selección de categorías y unidades de medida
 * - Petición POST al backend
 */
const CreateProduct = () => {
  const router = useRouter();

  const { t } = useLanguage();

  // Estado para mensajes de error
  const [errores, setError] = useState("");
  // Token de autenticación (JWT)
  const [accessToken, setAccessToken] = useState<string | null>(null);

  /**
   * useEffect inicial:
   * - Revisa si el usuario está autenticado.
   * - Si no, lo redirige al login en 3 segundos.
   */
  useEffect(() => {
    const { access } = getStoredTokens();
    if (!access || !isAuthenticated()) {
      setError("No estás autenticado. Serás redirigido al login...");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setAccessToken(access);
    }
  }, [router]);

  // Endpoints de la API
  const UrlNewProduct: string = "/products/new-product/";
  const UrlCategories: string = "/products/categories/";

  /**
   * Opciones de unidades de medida para el formulario
   */
  const unitOptions: UnitOfMeasure[] = [
    { value: "kg", label: "Kilogramos" },
    { value: "g", label: "Gramos" },
    { value: "l", label: "Litros" },
    { value: "ml", label: "Mililitros" },
    { value: "unidad", label: "Unidad" },
    { value: "li", label: "Libra" },
  ];

  /**
   * Estado principal del formulario
   */
  const [form, setForm] = useState<NewProduct>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    unit_of_measure: [],
    images: [],
    category: [],
  });

  // Estados auxiliares
  const [success, setSuccess] = useState<boolean>(false); // Producto creado
  const [loading, setLoading] = useState<boolean>(false); // Spinner de carga
  const [categories, setCategories] = useState<CategoryProducs[]>([]); // Categorías de BD
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Archivos físicos seleccionados
  const [categoryDropdownOpen, setCategoryDropdownOpen] =
    useState<boolean>(false); // Dropdown categorías
  const [unitDropdownOpen, setUnitDropdownOpen] = useState<boolean>(false); // Dropdown unidades

  /**
   * Cargar categorías desde el backend al montar el componente
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!isAuthenticated()) {
          setError(t("crearProductoNoAutenticado"));
          const timeout = setTimeout(() => {
            router.push("/login");
          }, 3000);
          return () => clearTimeout(timeout);
        }
        const responseCategories = await api.get(UrlCategories);
        setCategories(responseCategories.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.detail ||
              "Ocurrió un error al obtener las categorías"
          );
        } else {
          setError("Error inesperado");
        }
      }
    };
    loadInitialData();
  }, []);

  /**
   * Manejo de inputs de texto y textarea (nombre, descripción, precio, stock)
   */
  const hanleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  /**
   * Selección/deselección de categorías
   */
  const hanleChangeCategory = (categoryId: number) => {
    const selectCategory = categories.find((cat) => cat.id === categoryId);
    if (!selectCategory) return;
    setForm((prev) => {
      const isSelected = prev.category.some((cat) => cat.id === categoryId);
      if (isSelected) {
        return {
          ...prev,
          category: prev.category.filter((cat) => cat.id !== categoryId),
        };
      } else {
        return { ...prev, category: [...prev.category, selectCategory] };
      }
    });
  };

  /**
   * Selección de unidades de medida (solo una a la vez)
   */
  const hanleChangeUnit = (unitValue: string) => {
    const selectedUnit = unitOptions.find((unit) => unit.value === unitValue);
    if (!selectedUnit) return;
    setForm((prev) => {
      const isAlreadySelected = prev.unit_of_measure?.[0]?.value === unitValue;
      return {
        ...prev,
        unit_of_measure: isAlreadySelected ? [] : [selectedUnit],
      };
    });
  };

  /**
   * Manejo de carga de imágenes locales
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles((prev) => [...prev, ...fileArray]);

      // Convertir a base64 para previsualización inmediata
      const imagePromises = fileArray.map((file) => {
        return new Promise<Image>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({ image: e.target?.result as string });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((imageObjects) => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...imageObjects],
        }));
      });
    }
  };

  /**
   * Eliminar imagen del formulario y de la vista previa
   */
  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Validaciones básicas del formulario
   */
  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      setError(t("crearProductoValidacionNombre"));
      return false;
    }
    if (!form.description.trim()) {
      setError(t("crearProductoValidacionDescripcion"));
      return false;
    }
    if (form.price <= 0) {
      setError(t("crearProductoValidacionPrecio"));
      return false;
    }
    if (form.stock < 0) {
      setError(t("crearProductoValidacionStock"));
      return false;
    }
    if (form.category.length === 0) {
      setError(t("crearProductoValidacionCategoria"));
      return false;
    }
    if (form.unit_of_measure.length === 0) {
      setError(t("crearProductoValidacionUnidad"));
      return false;
    }
    setError("");
    return true;
  };

  /**
   * Envío del formulario:
   * - Convierte datos en FormData (incluye imágenes)
   * - Llama al endpoint con autenticación
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price.toString());
      formData.append("stock", form.stock.toString());
      form.category.forEach((cat) =>
        formData.append("category", String(cat.id))
      );
      form.unit_of_measure.forEach((unit) =>
        formData.append("unit_of_measure", unit.value)
      );
      imageFiles.forEach((file) => formData.append("images", file));

      const { access } = getStoredTokens();
      await api.post(UrlNewProduct, formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Resetear formulario
      setSuccess(true);
      setForm({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        unit_of_measure: [],
        images: [],
        category: [],
      });
      setImageFiles([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error creating product:", error);
      setError(error.response?.data?.message || t("crearProductoError"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Si no hay token de acceso, se muestra un mensaje
   */
  if (!accessToken) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-red-600 font-medium">
          {errores || t("crearProductoCargando")}
        </p>
      </div>
    );
  }

  /**
   * Renderizado del formulario
   */
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl my-4 sm:my-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-green-700 dark:text-green-400">
        {t("crearProductoTitulo")}
      </h2>

      {/* Mensajes de éxito o error */}
      {success && (
        <div className="mb-4 p-3 sm:p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded text-center text-sm sm:text-base font-semibold">
          {t("crearProductoExito")}
        </div>
      )}
      {errores && (
        <div className="mb-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded text-center text-sm sm:text-base font-semibold">
          ⚠️ {errores}
        </div>
      )}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 text-black dark:text-white"
      >
        {/* Nombre */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            {t("crearProductoNombre")}
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={hanleChange}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-colors duration-200"
            placeholder="Ej: Tomate cherry fresco"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            {t("crearProductoDescripcion")}
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={hanleChange}
            rows={4}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 resize-none transition-colors duration-200"
            placeholder={t("agregaDescripcion")}
            required
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              {t("crearProductoPrecio")}
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={hanleChange}
              min="0"
              step="0.01"
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={hanleChange}
              min="0"
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Categorías */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {t("crearProductoCategorias")}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <span
                className={
                  form.category.length === 0
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-white"
                }
              >
                {form.category.length === 0
                  ? t("seleccionaCategorias")
                  : `${form.category.length} seleccionadas`}
              </span>
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300 transition-transform duration-200 ${
                  categoryDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {categoryDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-2xl max-h-48 sm:max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center p-2.5 sm:p-3 hover:bg-green-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={form.category.some(
                        (cat) => cat.id === category.id
                      )}
                      onChange={() => hanleChangeCategory(category.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-600 mr-2 sm:mr-3"
                    />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unidades */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {t("crearProductoUnidades")}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <span
                className={
                  form.unit_of_measure.length === 0
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-white"
                }
              >
                {form.unit_of_measure.length === 0
                  ? t("seleccionaUnidades")
                  : `${form.unit_of_measure.length} seleccionada(s)`}
              </span>
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300 transition-transform duration-200 ${
                  unitDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {unitDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-2xl max-h-48 sm:max-h-60 overflow-y-auto">
                {unitOptions.map((unit) => (
                  <label
                    key={unit.value}
                    className="flex items-center p-2.5 sm:p-3 hover:bg-green-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={form.unit_of_measure.some(
                        (u) => u.value === unit.value
                      )}
                      onChange={() => hanleChangeUnit(unit.value)}
                      className="rounded border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-600 mr-2 sm:mr-3"
                    />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
                      {unit.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {t("crearProductoImagenes")}
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-green-400 dark:hover:border-green-500 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="images"
            />
            <label
              htmlFor="images"
              className="cursor-pointer text-sm sm:text-base text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors duration-200"
            >
              {t("crearProductoImagenesSubir")}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("crearProductoImagenesFormatos")}
            </p>
          </div>
          {form.images.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <h4 className="text-xs sm:text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {t("crearProductoImagenesSeleccionadas")}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {form.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600 group-hover:border-green-400 dark:group-hover:border-green-500 transition-colors duration-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 dark:hover:bg-red-700 shadow-lg transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 dark:bg-green-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base hover:bg-green-700 dark:hover:bg-green-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("crearProductoBotonCargando")}
            </span>
          ) : (
            t("crearProductoBoton")
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
