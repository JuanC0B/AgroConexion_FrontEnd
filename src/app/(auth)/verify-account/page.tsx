'use client'

import VerifyAccount from '@/components/forms/codeCount'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const VerifyAccountWrapper = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const URL = '/users/verify-account/'

  return <VerifyAccount email={email} URL={URL} />
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <VerifyAccountWrapper />
    </Suspense>
  )
}
