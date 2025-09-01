// components/BuyProduct.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ShoppingBasket, Minus, Plus } from "lucide-react";

const BuyProduct = ({ productId }: { productId: number }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (quantity < 1) {
      toast.error("❌ La cantidad debe ser mayor a 0");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/invoices/create/", {
        method: "efectivo", // o 'tarjeta_debito'
        items: [{ product_id: productId, quantity }],
      });

      toast.success("🌾 ¡Producto comprado con éxito!");
      console.log(response.data);
    } catch (error: any) {
      // Manejo de errores más detallado
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) toast.error("⚠️ Datos inválidos. Verifica la cantidad o el producto");
        else if (status === 401) toast.error("🔒 Debes iniciar sesión para comprar");
        else if (status === 404) toast.error("❌ Producto no encontrado");
        else toast.error(`❌ Error inesperado: ${data?.message || data || error.message}`);
      } else {
        toast.error(`❌ Error de conexión: ${error.message}`);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="w-full p-4 rounded-2xl shadow-md border bg-white/90 backdrop-blur-sm space-y-4">
      {/* Selector de cantidad */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={decreaseQty}
          className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition"
        >
          <Minus className="w-4 h-4 text-green-700" />
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 text-center border rounded-lg p-2 font-medium text-green-800"
        />
        <button
          onClick={increaseQty}
          className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition"
        >
          <Plus className="w-4 h-4 text-green-700" />
        </button>
      </div>

      {/* Botón de compra */}
      <button
        disabled={loading}
        onClick={handleBuy}
        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          "Procesando compra..."
        ) : (
          <>
            <ShoppingBasket className="w-5 h-5" />
            Comprar ahora
          </>
        )}
      </button>

      {/* Nota campesina */}
      <p className="text-sm text-center text-gray-600 italic">
        Compra directa al campesino 🌿
      </p>
    </div>
  );
};

export default BuyProduct;
