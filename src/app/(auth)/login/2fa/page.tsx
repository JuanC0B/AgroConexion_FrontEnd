'use client'
import VerifyAccount from '@/components/forms/codeCount'
import { useSearchParams } from 'next/navigation';

// Funcion que permite inciar sesion en dos pasos
const Login2FA = () => {
    // Obtenemos el parametro pasado en la url
    const searchParams = useSearchParams();
    // Obtenemos el parametro
    const email = searchParams.get('email') || '';
    // Url a la cual se le ara la peticion
    const URL = '/users/login/step2/'
    // Llamamos la componente para hacer la peticion
    return <VerifyAccount email={email} URL={URL}/>;
}

export default Login2FA