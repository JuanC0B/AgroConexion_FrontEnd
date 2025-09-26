"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/types/product.types";
import { Carousel } from "@/components/home/Carousel";
import { ProductSection } from "@/components/home/ProductSection";
import { HomeIntro } from "@/components/home/HomeIntro";
import { TickerText } from "@/components/ui/TickerText";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import Footer from "@/components/home/footer";
import TopProductsBuy from "@/components/home/ProductsTopSeller";
import { useLanguage } from "@/context/LanguageContext"; // ⬅️ Importamos contexto

/**
 * Página principal (Landing Page) de AgroConexión
 * ------------------------------------------------------------
 * - Obtiene productos desde la API al cargarse.
 * - Presenta diferentes secciones dinámicas (ofertas, más vendidos, recomendados).
 * - Integra componentes visuales (carrusel, ticker de mensajes, showcase de categorías).
 * - Incluye soporte para modo oscuro gracias a clases `dark:`.
 */
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [errores, setErrores] = useState("");

  // ⬅️ Acceso a traducciones
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/list-products/`
        );
        setProducts(res.data);
      } catch (err) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.detail || "Error al obtener productos."
          : "Error inesperado.";
        setErrores(msg);
      }
    };
    fetchProducts();
  }, []);

  const ofertas = products.slice(0, 3);
  const masVendidos = products.slice(0, 5);
  const recomendados = products.slice(6, 9);

  const selectedSlides = products
    .filter((p) => p.images?.[0]?.image)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      src: `${p.images[0].image}`,
      alt: p.name,
    }));

  // ✅ Ahora los mensajes salen del diccionario
  const mensajes = [
    t("messages1"),
    t("messages2"),
    t("messages3"),
    t("messages4"),
    t("messages5"),
    t("messages6"),
    t("messages7"),
    t("messages8"),
    t("messages9"),
  ];

  return (
    <div
      className="
        flex flex-col min-h-screen
        bg-gradient-to-br from-green-100 via-white to-green-50
        dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
        transition-colors duration-300
      "
    >
      <main className="flex-1 flex flex-col gap-8 pb-8">
        <HomeIntro />

        {/* Carrusel principal */}
        <div className="px-4">
          <Carousel slides={selectedSlides} />
        </div>

        {/* Ofertas traducidas */}
        <ProductSection title={t("offers")} productos={ofertas} />

        {/* Ticker con mensajes traducidos */}
        <TickerText items={mensajes} speed={70} />

        <TopProductsBuy />

        <TickerText items={mensajes} speed={70} />

        {/* Recomendados traducidos */}
        <ProductSection title={t("recommended")} productos={recomendados} />

        {errores && (
          <p className="text-center text-red-500 dark:text-red-400 font-medium mt-4">
            {errores}
          </p>
        )}

        <CategoryShowcase />
      </main>

      <Footer />
    </div>
  );
}
