// src/components/home/footer.tsx
'use client'

import React from "react";
import Image from "next/image";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer
      className="bg-green-700 dark:bg-green-900 
                 text-white dark:text-gray-100 
                 pt-10 pb-6 transition-colors duration-500"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + Descripción */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
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
          <p className="text-sm text-gray-200 dark:text-gray-300 max-w-xs">
            {t('footerDescription')}
          </p>
        </div>

        {/* Redes Sociales */}
        <div className="flex flex-col items-center text-center">
          <h3 className="font-semibold text-lg mb-3">{t("siguenos")}</h3>
          <div className="flex space-x-6">
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
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <h3 className="font-semibold text-lg mb-3">{t("contactoTitle")}</h3>
          <p className="text-sm">📍 Funza, Cundinamarca</p>
          <p className="text-sm">📧 agroconexion@gmail.com</p>
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
