'use client'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLanguage}
        className={`px-3 py-1 rounded ${language === 'es' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
      >
        ES
      </button>
      <button
        onClick={toggleLanguage}
        className={`px-3 py-1 rounded ${language === 'en' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
      >
        EN
      </button>

    </div>
  )
}
