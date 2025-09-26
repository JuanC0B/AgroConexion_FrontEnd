"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { 
  Store, 
  ShoppingBag, 
  Users, 
  Loader2, 
  Repeat,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function ToggleSeller() {
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [hasGroup, setHasGroup] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get("/users/my-info/");
        setIsSeller(res.data.is_seller);
        setHasGroup(!!res.data.group_profile);
      } catch (error) {
        console.error("Error al obtener info:", error);
        toast.error("Error al obtener estado de vendedor");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleToggle = async () => {
    setUpdating(true);
    try {
      await api.put("/users/update/", { is_seller: !isSeller });
      setIsSeller(!isSeller);
      toast.success(
        `Ahora eres ${!isSeller ? "vendedor ✅" : "comprador ❌"}`
      );
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("No se pudo actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Cargando información...
          </span>
        </div>
      </div>
    );
  }

    return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
      {/* Header con icono */}
      <div className="flex items-center justify-center mb-6">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 transition-colors duration-300 ${
            isSeller
              ? "bg-blue-100 dark:bg-blue-900/30"
              : "bg-purple-100 dark:bg-purple-900/30"
          }`}
        >
          {isSeller ? (
            <Store className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ) : (
            <ShoppingBag className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          )}
        </div>
      </div>

      {/* Título */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Estado de Usuario
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Cambia entre modo comprador y vendedor
        </p>
      </div>

      {/* Estado actual */}
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            isSeller
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 transition-colors duration-300 ${
              isSeller
                ? "bg-blue-500 dark:bg-blue-400"
                : "bg-purple-500 dark:bg-purple-400"
            }`}
          ></div>
          {isSeller ? "Vendedor" : "Comprador"}
        </div>
      </div>

      {/* Descripción del estado */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {isSeller
            ? "Tienes permisos para crear y gestionar productos en tu tienda. Los compradores pueden ver tu inventario."
            : "Puedes navegar y comprar productos de los vendedores registrados en la plataforma."}
        </p>
      </div>

      {/* Contenido principal */}
      {hasGroup ? (
        /* Usuario con agrupación - No puede cambiar */
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Miembro de agrupación
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                  No puedes cambiar tu estado de vendedor porque perteneces a
                  una agrupación. Los permisos son gestionados por el
                  administrador del grupo.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              disabled
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-all duration-200"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Cambio no disponible
            </button>
          </div>
        </div>
      ) : (
        /* Usuario sin agrupación */
        <div className="space-y-4">
          {/* Solo mostrar beneficios y botón si NO es vendedor */}
          {!isSeller && (
            <>
              {/* Beneficios del modo vendedor */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/50">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <Store className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Beneficios del modo vendedor:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                    Crear y gestionar tu propia tienda
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                    Publicar productos y servicios
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                    Panel de estadísticas y ventas
                  </li>
                </ul>
              </div>

              {/* Botón de cambio */}
              <div className="text-center">
                <button
                  onClick={handleToggle}
                  disabled={updating}
                  className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-200 dark:focus:ring-blue-900/30 shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <Repeat className="w-5 h-5 mr-2" />
                      Cambiar a vendedor
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

}

