'use client'

import ResetPassword from '@/components/forms/recoverpassword'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';

const ResetPasswordWrapper = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const URL = '/users/password-reset/confirm/';

  return <ResetPassword email={email} URL={URL} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <ResetPasswordWrapper />
    </Suspense>
  );
}
