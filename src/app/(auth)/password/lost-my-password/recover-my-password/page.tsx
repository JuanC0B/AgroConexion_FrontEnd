'use client'
import ResetPassword from '@/components/forms/recoverpassword'
import { useSearchParams } from 'next/navigation';

const ResetPasswordPage = () => {
    // Obtenemos el email enviado como parametro por la url
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const URL = '/users/password-reset/confirm/'
    // Formulario de cambio de contraseña
    return <ResetPassword email={email} URL={URL}/>;
}

export default ResetPasswordPage