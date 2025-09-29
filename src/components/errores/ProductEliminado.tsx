import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductoEliminado() {
  const [mostrar, setMostrar] = useState(true);
  const [animarSalida, setAnimarSalida] = useState(false);

  const { t } = useLanguage();

  if (!mostrar) return null;

  const handleClose = () => {
    setAnimarSalida(true);
    setTimeout(() => setMostrar(false), 300); // espera animación antes de ocultar
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
      <div
        className={`relative flex flex-col justify-center max-w-md w-full overflow-hidden transition-all duration-300 ${
          animarSalida ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 p-6 rounded-2xl shadow-lg relative">
          
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition"
            aria-label={t("cerrar")}
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-white">
            <div
              className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4 animate-bounce"
              aria-hidden="true"
            >
              <AlertTriangle size={48} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {t("productonoencontro")}
            </h2>
            <p className="text-amber-100 dark:text-yellow-100 text-center text-sm">
              {t("productonoencontroparrafo")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

