// src/app/profile/page.tsx

'use client'

import Image from 'next/image'
import { Mail, Phone, MapPin, Shield, User, Lock } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

const ProfilePage = () => {
  const auth = useAuth()
  const isAuthenticated = (auth as any).isAuthenticated
  const rawUser = (auth as any).user as any

  const getField = (obj: any, ...keys: string[]) => {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k]
    }
    return undefined
  }


  const { t } = useLanguage();
  const displayName = getField(rawUser, 'userName', 'username', 'name') || 'Usuario'
  const email = getField(rawUser, 'email')
  const phone = getField(rawUser, 'phoneNumber', 'phone_number', 'phone')
  const address = getField(rawUser, 'address')
  const profileImagePath = getField(rawUser, 'profileImage', 'profile_image', 'userImage', 'user_image')
  const isSeller = !!getField(rawUser, 'isSeller', 'is_seller')
  const userType = getField(rawUser, 'userType', 'user_type') || (isSeller ? 'group' : 'common')
  const twoFactor = !!getField(rawUser, 'twoFactorEnabled', 'two_factor_enabled')
  const groupProfile = getField(rawUser, 'groupProfile', 'group_profile')

  const getFullImageUrl = (path?: string) => {
    if (!path) return undefined
    return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_MEDIA_URL}${path}`
  }

  if (!isAuthenticated || !rawUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        <User className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
        <p>{t("noInfoUsuario")}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-12">
      {/* ----------------- ENCABEZADO DEL PERFIL ----------------- */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r 
        from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 
        shadow-xl rounded-3xl p-8 border border-green-200 dark:border-green-700">

        {/* Imagen o inicial */}
        <div className="flex-shrink-0">
          {profileImagePath ? (
            <Image
              src={getFullImageUrl(profileImagePath) as string}
              alt={displayName}
              width={130}
              height={130}
              className="rounded-full border-4 border-green-600 object-cover shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center 
              bg-gradient-to-br from-green-600 to-green-400 
              text-white text-4xl font-bold rounded-full shadow-lg">
              {displayName?.charAt(0).toUpperCase() ?? 'U'}
            </div>
          )}
        </div>

        {/* Nombre y tipo de usuario */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {displayName}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            {userType === 'group'
              ? (t('agrupacionCampesina'))
              : userType === 'admin'
                ? (t('administrador'))
                : (t('usuarioComun'))}
          </p>
        </div>
        <Link href={ROUTES.EDITINFO} className='text-lg text-gray-600 dark:text-gray-400 mt-2'>Editar</Link>
      </div>

      {/* ----------------- INFORMACIÓN PRINCIPAL ----------------- */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[
          { icon: Mail, label: (t('correo')), value: email || (t('noRegistrado')) },
          { icon: Phone, label: (t('telefono')), value: phone || (t('noRegistrado')) },
          { icon: MapPin, label: (t('direccion')), value: address || (t('noRegistrada')) },
          { icon: Shield, label: (t('rol')), value: isSeller ? (t('vendedor')) : (t('cliente')) },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg 
              transition rounded-2xl p-5 flex items-center gap-5 
              border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full 
              bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 shadow-sm">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold">{item.value}</p>
            </div>
          </div>
        ))}

        {/* Estado 2FA */}
        <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg 
          transition rounded-2xl p-5 flex items-center gap-5 
          border border-gray-100 dark:border-gray-700 md:col-span-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full 
            bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("autenticacionDosPasos")}</p>
            <p className="text-gray-800 dark:text-gray-200 font-semibold">
              {twoFactor ? (t('activada')) : (t('desactivada'))}
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- INFORMACIÓN EXTRA AGRUPACIONES ----------------- */}
      {userType === 'group' && groupProfile && (
        <div className="mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 
          border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-4">
            📑 {t("infoAgrupacion")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-gray-700 dark:text-gray-200">
            <p><strong>NIT:</strong> {groupProfile.nit || (t('noRegistrado'))}</p>
            <p><strong>{t("tipoOrganizacion")}:</strong> {groupProfile.organization_type || groupProfile.organizationType}</p>
            <p><strong>{t("representante")}:</strong> {groupProfile.legal_representative || groupProfile.legalRepresentative}</p>
            <p><strong>{t("cedula")}:</strong> {groupProfile.representative_cedula || groupProfile.representativeCedula}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
