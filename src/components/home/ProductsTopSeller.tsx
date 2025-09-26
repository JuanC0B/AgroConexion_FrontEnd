"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { TopProducts } from "@/types/product.types";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';


const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(price);

const TopProductsBuy = () => {
  const [products, setProducts] = useState<TopProducts[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const GetProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/top-selling/`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos", error);
      }
    };
    GetProducts();
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === products.length - 1 ? 0 : prev + 1
    );
  };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const { t } = useLanguage();

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Carousel Container */}
            <div className="relative h-96 overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {products.map((product) => {
                        const imageUrl =
                            product.images && product.images.length > 0
                                ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${product.images[0].image}`
                                : `https://via.placeholder.com/800x400/10b981/ffffff?text=${encodeURIComponent(
                                    product.name
                                )}`;

            return (
              <div
                key={product.id}
                className="w-full flex-shrink-0 relative"
              >
                {/* Product Image */}
                <div className="h-full relative">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    unoptimized // 🔧 permite imágenes externas sin configurar dominio
                    className="object-cover"
                  />
                </div>

                {/* Product Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-200 mb-3 text-sm">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-green-400">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-300">
                        Stock: {product.stock} · {product.unit_of_measure}
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      {t("viewProduct")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
      >
        <ChevronRight size={20} />
      </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                ? "bg-white w-6"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopProductsBuy;
