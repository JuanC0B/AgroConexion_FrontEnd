// Pagina que permite al usuario verificar la cuenta
'use client'
import VerifyAccount from '@/components/forms/codeCount'
import { useSearchParams } from 'next/navigation';

const VerifyAccountPage = () => {
    // Obtenemos el email del usuario enviuado por la url
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const URL = '/users/verify-account/'
    // Formulario de codigo para el incio de sesion
    return <VerifyAccount email={email} URL={URL}/>;
}

export default VerifyAccountPage