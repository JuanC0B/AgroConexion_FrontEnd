'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext';

interface Slide {
  id: number
  src: string
  alt: string
}

interface Props {
  slides: Slide[]
}

export const Carousel = ({ slides }: Props) => {
  const [current, setCurrent] = useState(0)
  const [validSlides, setValidSlides] = useState<Slide[]>([])
  const { t } = useLanguage();

  // Validar que las imágenes existan
  useEffect(() => {
    const validateImages = async () => {
      const filtered = await Promise.all(
        slides.map(async (slide) => {
          try {
            const res = await fetch(slide.src, { method: 'HEAD' })
            return res.ok ? slide : null
          } catch {
            console.warn(`Imagen inválida: ${slide.src}`)
            return null
          }
        })
      )
      setValidSlides(filtered.filter(Boolean) as Slide[])
    }
    validateImages()
  }, [slides])

  // Autoplay
  useEffect(() => {
    const filtered = slides.filter((slide) => !!slide.src) // solo descarta vacíos
    setValidSlides(filtered.length > 0 ? filtered : [
      { id: 0, src: "/default.jpg", alt: "Producto destacado" }
    ])
  }, [slides])


  if (validSlides.length === 0) return null

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? validSlides.length - 1 : prev - 1))
  const nextSlide = () =>
    setCurrent((prev) => (prev === validSlides.length - 1 ? 0 : prev + 1))

  return (
    <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] lg:h-[520px] overflow-hidden rounded-2xl shadow-2xl">
      {validSlides.map((slide, index) => (
        <Link
          href={`/products/${slide.id}`}
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            priority={index === current}
          />

          {/* Overlay con degradado y CTA */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
            <div className="p-6 sm:p-10 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">
                {slide.alt}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                Descubre lo mejor de nuestros productos campesinos 🌱
              </p>
              <button className="mt-4 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold transition-colors">
                {t("viewProduct")}
              </button>
            </div>
          </div>
        </Link>
      ))}

      {/* Flechas navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 z-20"
      >
        <ChevronLeft className="text-gray-800" size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 z-20"
      >
        <ChevronRight className="text-gray-800" size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {validSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? 'bg-green-500 w-6' : 'bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
