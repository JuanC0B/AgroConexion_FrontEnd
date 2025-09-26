// src/components/home/footer.tsx
'use client'

import React from "react";
import Image from "next/image";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage(); // 👈 hook dentro del componente, usando {}

  return (
    <footer
      className="bg-green-700 dark:bg-green-900 
               text-white dark:text-gray-100 
               pt-10 pb-6 transition-colors duration-500"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Descripción */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image
              src="/AgroConexion.svg"
              alt="AgroConexión"
              width={40}
              height={40}
              className="rounded-full border border-white dark:border-gray-200 shadow"
            />
            <h2 className="text-xl font-bold">AgroConexión</h2>
          </div>
          <p className="text-sm text-gray-200 dark:text-gray-300">
            {t('footerDescription')}
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t('enlaces')}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/about"
                className="hover:text-green-300 dark:hover:text-green-400 transition-colors"
              >
                {t('sobreNosotros')}
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-green-300 dark:hover:text-green-400 transition-colors"
              >
                {t('contacto')}
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-green-300 dark:hover:text-green-400 transition-colors"
              >
                {t('politicaDePrivacidad')}
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="hover:text-green-300 dark:hover:text-green-400 transition-colors"
              >
                {t('productos')}
              </a>
            </li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t("siguenos")}</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 dark:hover:text-green-400 transition-colors"
            >
              <SiFacebook className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 dark:hover:text-green-400 transition-colors"
            >
              <SiInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 dark:hover:text-green-400 transition-colors"
            >
              <SiX className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t("contactoTitle")}</h3>
          <p className="text-sm">📍 Funza, Cundinamarca</p>
          <p className="text-sm">📧 agroconexions@gmail.com</p>
          <p className="text-sm">📞 +57 350 742 7337</p>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="pt-5 text-center text-md text-gray-200 dark:text-gray-400">
        © {new Date().getFullYear()} AgroConexión. {t('todosLosDerechosReservados')}
      </div>
    </footer>
  );
};

export default Footer;