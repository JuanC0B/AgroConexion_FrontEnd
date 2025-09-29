"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import EditUserInfo from "@/components/user/EditInfo";
import ToggleSeller from "@/components/user/ToggleSeller";
import Toggle2FA from "@/components/user/Toggle2FA";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return <p className="text-center">Cargando autenticación...</p>;
  }

  if (!isAuthenticated) {
    return (
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-lg font-semibold mb-2">🔐 Debes iniciar sesión</h2>
      <p className="text-gray-600 mb-4">
        Para ver y editar tu información de perfil necesitas estar autenticado.
      </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("miPerfil")}</h1>

      {/* Sección de edición de información */}
      <section>
        <EditUserInfo />
      </section>

      {/* Sección de vendedor */}
      <section>
        <ToggleSeller />
      </section>

      {/* Sección de 2FA */}
      <section>
        <Toggle2FA />
      </section>
    </main>
  );
}

