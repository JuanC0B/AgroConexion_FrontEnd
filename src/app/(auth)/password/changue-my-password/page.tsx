'use client'

import ChanguePassword from '@/components/forms/changuePassword'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from "@/context/LanguageContext";

const ChanguePasswordWrapper = () => {
  const searchParams = useSearchParams()
  const { t } = useLanguage();
  const email = searchParams.get('email') || ''
  const URL = '/users/change-password/confirm/'

  return <ChanguePassword email={email} URL={URL}/>
}

export default function ChanguePasswordPage() {
  return (
    <Suspense fallback={<p>(t("cargando")).</p>}>
      <ChanguePasswordWrapper />
    </Suspense>
  )
}
