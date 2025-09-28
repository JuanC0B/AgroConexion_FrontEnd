'use client'

import VerifyAccount from '@/components/forms/codeCount'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Componente que usa useSearchParams
const Login2FAContent = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const URL = '/users/login/step2/'

  return <VerifyAccount email={email} URL={URL} />
}

const Login2FA = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Login2FAContent />
    </Suspense>
  )
}

export default Login2FA
