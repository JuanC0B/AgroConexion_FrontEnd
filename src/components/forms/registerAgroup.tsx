"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RegisterAgroup} from "@/types/auth.types";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import Link from "next/link";
import {ROUTES} from '@/lib/constants'
const organization_type = {
  cooperative: "Cooperativa",
  association: "Asociación",
  informal: "Grupo informal",
  other: "Otro",
};

// Funcion para registarr a un usuario
const RegisterAgropu = () => {
    const removeCedulaImage = () => {
        setCedulaImagePreview(null);
        setForm((prev) => ({ ...prev, image_cedula: null }));
        const input = document.getElementById("image_cedula") as HTMLInputElement;
        if (input) input.value = "";
    };
    // Permite navegar
    const router = useRouter();
    // URL de la solicitud
    const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_UR}/users/group/register/`;
    // Funcion para actualizar el estado de la vision de la contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
        null
    );
    const [cedulaImagePreview, setCedulaImagePreview] = useState<string | null>(
        null
    );
    const [rutPreview, setRutPreview] = useState<string | null>(null);
    const [form, setForm] = useState<RegisterAgroup>({
        username: "",
        email: "",
        phone_number: "",
        address: "",
        profile_image: null,
        password: "",
        password2: "",
        group_profile: {
        nit: "",
        organization_type: "",
        legal_representative: "",
        representative_cedula: "",
        image_cedula: null,
        rut_document: null,
        },
    });

    // Limpiar imagen seleccionada
    const removeProfileImage = () => {
        setProfileImagePreview(null);
        setForm((prev) => ({ ...prev, profile_image: null }));
        // Limpiar el input file visualmente
        const input = document.getElementById("profile_image") as HTMLInputElement;
        if (input) input.value = "";
    };

    // Funcion que actualiza los mensajes
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Estado para el cropper
    const [showCropper, setShowCropper] = useState<"profile" | "cedula" | null>(
        null
    );
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [tempImage, setTempImage] = useState<string | null>(null);

    const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    async function getCroppedImg(
        imageSrc: string,
        crop: Area
    ): Promise<Blob | null> {
        const image = new window.Image();
        image.src = imageSrc;
        await new Promise((resolve) => {
        image.onload = resolve;
        });
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
        );
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), "image/jpeg");
        });
    }

    const handleImageInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "profile" | "cedula"
    ) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
        const url = window.URL.createObjectURL(file);
        setTempImage(url);
        setShowCropper(type);
        }
    };

    const handleCropSave = async () => {
        if (!tempImage || !croppedAreaPixels) return;
        const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);
        if (croppedBlob) {
            const croppedFile = new File([croppedBlob], "cropped.jpg", {
                type: "image/jpeg",
            });
        if (showCropper === "profile") {
            setForm((prev) => ({ ...prev, profile_image: croppedFile }));
            setProfileImagePreview(window.URL.createObjectURL(croppedFile));
        } else if (showCropper === "cedula") {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, image_cedula: croppedFile }
                : null,
            }));
                setCedulaImagePreview(window.URL.createObjectURL(croppedFile));
            }
        }
        setShowCropper(null);
        setTempImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const handleCropCancel = () => {
        setShowCropper(null);
        setTempImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    // Funcion para manejar los combios echos por el usuario
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value, type, files } = e.target as HTMLInputElement;
        // Campos de agrupación
        const agroupFields = [
            "nit",
            "organization_type",
            "legal_representative",
            "representative_cedula",
            "image_cedula",
            "rut_document",
        ];
        if (type === "file") {
            const file = files && files.length > 0 ? files[0] : null;
        if (id === "profile_image") {
            setForm((prev) => ({ ...prev, profile_image: file }));
            if (file) setProfileImagePreview(window.URL.createObjectURL(file));
        } else if (id === "image_cedula") {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, image_cedula: file }
                : null,
            }));

            if (file) setCedulaImagePreview(window.URL.createObjectURL(file));
        } else if (id === "rut_document") {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, rut_document: file }
                : null,
            }));

            if (file && file.type === "application/pdf")
            setRutPreview(window.URL.createObjectURL(file));
        }
        } else {
        if (agroupFields.includes(id)) {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, [id]: value }
                : null,
            }));
        } else {
            setForm((prev) => ({ ...prev, [id]: value }));
        }
        }
        setError("");
        setSuccess("");
    };

    // Funcion que se ejecutara cuando se envie el formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.username || !form.email || !form.password || !form.password2) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (form.password !== form.password2) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setError("");
        setSuccess("");
        const formData = new FormData();
            formData.append("username", form.username);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("password2", form.password2);
            formData.append("phone_number", form.phone_number);
            formData.append("address", form.address);

        if (form.profile_image) {
            formData.append("profile_image", form.profile_image);
        }

        formData.append("group_profile.nit", form.group_profile?.nit ?? "");
            formData.append(
                "group_profile.organization_type",
            form.group_profile?.organization_type ?? "other"
        );
        formData.append(
            "group_profile.legal_representative",
            form.group_profile?.legal_representative ?? ""
        );
        formData.append(
            "group_profile.representative_cedula",
            form.group_profile?.representative_cedula ?? ""
        );

        if (form.group_profile?.image_cedula) {
            formData.append("group_profile.image_cedula", form.group_profile.image_cedula);
        }
        if (form.group_profile?.rut_document) {
            formData.append("group_profile.rut_document", form.group_profile.rut_document);
        }

        try {
            const response = await axios.post(BACKEND_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" }, 
            });
            setSuccess(response.data.message);
            router.push(`${ROUTES.VERIFYACCOUTN}=${encodeURIComponent(form.email)}`);
        } catch (error: any) {
            console.error(error.response?.data);
            if (error.response?.data) {
                const apiErrors = error.response.data;
                if (apiErrors.username) {
                    setError("Este nombre de usuario ya está en uso. Intenta con otro.");
                } else if (apiErrors.email) {
                    setError("Este correo ya está registrado. Usa uno diferente.");
                } else {
                    setError("Error en el registro. Intenta nuevamente.");
                }
            } else {
                setError("No se pudo conectar con el servidor");
            }
        }
    };

    // Componente que retorna la funcion XMl
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
            <form
                onSubmit={handleSubmit}
                className="bg-white/90 dark:bg-gray-800/95 shadow-2xl rounded-3xl px-10 py-10 w-full max-w-4xl mx-auto m-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <Image
                            src="/AgroConexion.svg"
                            alt="Logo"
                            height={80}
                            width={80}
                            className="rounded-full border-4 border-green-300 dark:border-green-500 shadow-lg bg-white dark:bg-gray-700 transition-colors duration-300"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-wide text-gray-800 dark:text-white transition-colors duration-300">
                        Registro de Organización
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-center max-w-2xl">
                        Únete a nuestra plataforma y conecta directamente con consumidores
                    </p>
                    <div className="mt-3 h-1 w-24 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-400 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Ingresa tu nombre de usuario"
                            value={form.username}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="ejemplo@correo.com"
                            value={form.email}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone_number" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Número de teléfono
                        </label>
                        <input
                            type="text"
                            id="phone_number"
                            placeholder="+57 300 123 4567"
                            value={form.phone_number}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="address" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Dirección
                        </label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Tu dirección completa"
                            value={form.address}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Organization Type */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="organization_type" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Tipo de organización
                        </label>
                        <select
                            id="organization_type"
                            value={form.group_profile?.organization_type || ""}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Selecciona una opción</option>
                            {Object.entries(organization_type).map(([key, label]) => (
                                <option key={key} value={key} className="bg-white dark:bg-gray-700">
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* NIT */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nit" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            NIT
                        </label>
                        <input
                            type="text"
                            id="nit"
                            placeholder="123456789-0"
                            value={form.group_profile?.nit || ""}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Legal Representative */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="legal_representative" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Representante legal
                        </label>
                        <input
                            type="text"
                            id="legal_representative"
                            placeholder="Nombre del representante legal"
                            value={form.group_profile?.legal_representative || ""}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Representative Cedula */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="representative_cedula" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            Cédula del representante
                        </label>
                        <input
                            type="text"
                            id="representative_cedula"
                            placeholder="Número de cédula"
                            value={form.group_profile?.representative_cedula || ""}
                            onChange={handleChange}
                            className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* File Upload Sections */}
                <div className="mt-8 space-y-6">
                    {/* Profile Image */}
                    <div className="bg-green-50 dark:bg-gray-700/50 border-2 border-green-200 dark:border-green-700/50 rounded-2xl p-6 hover:border-green-400 dark:hover:border-green-500 transition-all duration-200">
                        <label htmlFor="profile_image" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Imagen de perfil
                        </label>
                        <input
                            type="file"
                            id="profile_image"
                            accept="image/*"
                            onChange={(e) => handleImageInput(e, "profile")}
                            className="file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 dark:file:bg-green-900/30 file:text-green-700 dark:file:text-green-400 hover:file:bg-green-200 dark:hover:file:bg-green-800/50 w-full cursor-pointer bg-white dark:bg-gray-600 border-2 border-green-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all text-gray-700 dark:text-gray-300"
                        />
                        {profileImagePreview && (
                            <div className="relative mt-4 w-40 h-40 rounded-xl overflow-hidden border-2 border-green-300 dark:border-green-600 shadow-lg group">
                                <img
                                    src={profileImagePreview}
                                    alt="Previsualización perfil"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <button
                                    type="button"
                                    onClick={removeProfileImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg hover:scale-110 transition-all duration-200"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Cedula Image */}
                    <div className="bg-blue-50 dark:bg-gray-700/50 border-2 border-blue-200 dark:border-blue-700/50 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200">
                        <label htmlFor="image_cedula" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            Imagen de cédula
                        </label>
                        <input
                            type="file"
                            id="image_cedula"
                            accept="image/*"
                            onChange={(e) => handleImageInput(e, "cedula")}
                            className="file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-200 dark:hover:file:bg-blue-800/50 w-full cursor-pointer bg-white dark:bg-gray-600 border-2 border-blue-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all text-gray-700 dark:text-gray-300"
                        />
                        {cedulaImagePreview && (
                            <div className="relative mt-4 w-40 h-40 rounded-xl overflow-hidden border-2 border-blue-300 dark:border-blue-600 shadow-lg group">
                                <img
                                    src={cedulaImagePreview}
                                    alt="Previsualización cédula"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <button
                                    type="button"
                                    onClick={removeCedulaImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg hover:scale-110 transition-all duration-200"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RUT Document */}
                    <div className="bg-purple-50 dark:bg-gray-700/50 border-2 border-purple-200 dark:border-purple-700/50 rounded-2xl p-6 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200">
                        <label htmlFor="rut_document" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Documento RUT (PDF)
                        </label>
                        <input
                            type="file"
                            id="rut_document"
                            accept="application/pdf"
                            onChange={handleChange}
                            className="file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-200 dark:hover:file:bg-purple-800/50 w-full cursor-pointer bg-white dark:bg-gray-600 border-2 border-purple-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition-all text-gray-700 dark:text-gray-300"
                        />
                        {rutPreview && (
                            <div className="mt-4 w-full rounded-xl overflow-hidden border-2 border-purple-300 dark:border-purple-600 shadow-lg">
                                <embed
                                    src={rutPreview}
                                    type="application/pdf"
                                    width="100%"
                                    height="220px"
                                    className="rounded-lg bg-white dark:bg-gray-700"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Password Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Crea una contraseña segura"
                                value={form.password}
                                onChange={handleChange}
                                className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password2" className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword2 ? "text" : "password"}
                                id="password2"
                                placeholder="Confirma tu contraseña"
                                value={form.password2}
                                onChange={handleChange}
                                className="rounded-xl border-2 border-green-200 dark:border-gray-600 px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword2((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword2 ? (
                                    <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-red-600 dark:text-red-400 font-semibold">{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-green-600 dark:text-green-400 font-semibold">{success}</span>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Crear Cuenta</span>
                    </button>
                </div>

                {/* Cropper Modal */}
                {showCropper && tempImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-[90vw] max-w-lg m-4 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                                Recortar imagen
                            </h3>
                            <div className="relative w-80 h-80 bg-gray-200 dark:bg-gray-600 rounded-xl mx-auto mb-6 overflow-hidden">
                                <Cropper
                                    image={tempImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Zoom
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="flex gap-4 justify-center">
                                <button
                                    type="button"
                                    onClick={handleCropSave}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Recortar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCropCancel}
                                    className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Links */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link href={ROUTES.LOGIN}>
                        <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">Iniciar Sesión</span>
                        </div>
                    </Link>
                    <Link href={ROUTES.REGISTER}>
                        <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">Registro como Usuario</span>
                        </div>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterAgropu;