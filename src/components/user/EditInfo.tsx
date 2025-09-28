"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from '@/features/auth/services/authService';
import { toast } from "react-hot-toast";
import ChangePassword from "@/components/user/ChanguePassword";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Camera, 
  Save, 
  Loader2,
  Upload,
  X
} from "lucide-react";

interface GroupProfile {
  id?: number;
  nit?: string;
  organization_type?: string;
  legal_representative?: string;
  image_cedula?: File | null;
  rut_document?: File | null;
}

interface UserFormData {
  id?: number;
  username: string;
  email: string;
  phone_number: string;
  address: string | null;
  profile_image: File | null;
  group_profile: GroupProfile | null;
  user_type: string;
  is_seller: boolean;
}

export default function EditInfo() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    phone_number: "",
    address: null,
    profile_image: null,
    group_profile: null,
    user_type: "common",
    is_seller: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setUser } = useAuth();
  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      api
        .get("/users/my-info/")
        .then((res) => {
          const userData = res.data;
          setFormData({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            phone_number: userData.phone_number,
            address: userData.address,
            profile_image: null,
            group_profile: userData.group_profile,
            user_type: userData.user_type,
            is_seller: userData.is_seller,
          });
          
          // Guardar la URL original del backend
          const imageUrl = userData.profile_image;
          if (imageUrl) {
            setOriginalImageUrl(imageUrl);
            // Si la URL ya es completa (http/https), úsala directamente
            if (imageUrl.startsWith('http')) {
              setPreviewImage(imageUrl);
            } else {
              // Si es una URL relativa, agregar el dominio del backend
              setPreviewImage(`${process.env.NEXT_PUBLIC_MEDIA_URL}${imageUrl}`);
            }
          }
        })
        .catch((error) => {
          console.error("Error cargando datos:", error);
          toast.error("Error al cargar la información del perfil");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Validación de campos
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "El teléfono es requerido";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Formato de teléfono inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de inputs normales
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Manejo de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor selecciona una imagen válida");
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profile_image: file,
      }));
      
      // Crear URL del objeto para vista previa
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  // Remover imagen
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profile_image: null,
    }));
    
    // Limpiar preview y volver a la imagen original si existe
    if (originalImageUrl) {
      if (originalImageUrl.startsWith('http')) {
        setPreviewImage(originalImageUrl);
      } else {
        setPreviewImage(`${process.env.NEXT_PUBLIC_MEDIA_URL}${originalImageUrl}`);
      }
    } else {
      setPreviewImage(null);
    }
  };

  // Enviar datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setSaving(true);

    try {
      const dataToSend = { ...formData };

      // Eliminar profile_image si no es File
      if (!(dataToSend.profile_image instanceof File)) {
        delete (dataToSend as any).profile_image;
      }

      // Limpiar group_profile si no existe
      if (!dataToSend.group_profile) {
        delete (dataToSend as any).group_profile;
      }

      const hasFiles =
        dataToSend.profile_image instanceof File ||
        (dataToSend.group_profile &&
          Object.values(dataToSend.group_profile).some(
            (v: any) => v instanceof File
          ));

      if (hasFiles) {
        const fd = new FormData();

        ["username", "phone_number", "address", "user_type", "is_seller"].forEach(
          (k) => {
            if (
              (dataToSend as any)[k] !== undefined &&
              (dataToSend as any)[k] !== null
            ) {
              fd.append(k, String((dataToSend as any)[k]));
            }
          }
        );

        if (dataToSend.profile_image instanceof File) {
          fd.append("profile_image", dataToSend.profile_image);
        }

        if (dataToSend.group_profile) {
          const gpClone: any = { ...dataToSend.group_profile };

          ["image_cedula", "rut_document"].forEach((fkey) => {
            if (gpClone[fkey] instanceof File) {
              fd.append(`group_profile.${fkey}`, gpClone[fkey]);
              delete gpClone[fkey];
            }
          });

          if (Object.keys(gpClone).length > 0) {
            fd.append("group_profile", JSON.stringify(gpClone));
          }
        }

        await api.put("/users/update/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put("/users/update/", dataToSend, {
          headers: { "Content-Type": "application/json" },
        });
      }

      const access = localStorage.getItem("access_token")
      const user = await authService.getUserInfo(access!);

      // 4. Actualizar el store con la información real del backend
      setUser(user);
      toast.success("Perfil actualizado exitosamente ✅");
    } catch (err: any) {
      console.error("PUT /users/update/ error:", err.response?.data ?? err);
      const errorMessage = err.response?.data?.message || "No se pudo actualizar el perfil";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Editar Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Actualiza tu información personal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {previewImage ? (
                  <div className="relative">
                    <Image
                      src={previewImage}
                      alt="Vista previa del perfil"
                      width={120}
                      height={120}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      priority
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                    <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
              
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md">
                <Upload className="w-4 h-4 mr-2" />
                Cambiar foto
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG o GIF (máx. 5MB)
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.username ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ingresa tu nombre de usuario"
                />
                {errors.username && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  El correo electrónico no se puede modificar
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number ?? ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.phone_number ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ej: +57 300 123 4567"
                />
                {errors.phone_number && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phone_number}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address ?? ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Ingresa tu dirección"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors shadow-lg disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar cambios
                  </>
                )}
              </button>
                <div className="mt-8">
                  <ChangePassword/>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}