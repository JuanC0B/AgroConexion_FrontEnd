// src/components/comments/comments.tsx
"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Send, Trash2, Edit2, Check, X } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

interface CommentImage {
  id: number;
  image: string;
}

interface Comment {
  id: number;
  comment: string;
  images: CommentImage[];
  user?: {
    id: number;
    username: string;
    profile_image?: string;
  };
}

interface ComentsProductProps {
  productId: number;
}

const ComentsProduct: React.FC<ComentsProductProps> = ({ productId }) => {
  const auth = useAuth();
  const currentUser = (auth as any)?.user;
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingImages, setEditingImages] = useState<File[]>([]);
  const [deleteImages, setDeleteImages] = useState<number[]>([]);

  const getFullImageUrl = (path: string) =>
    path?.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_MEDIA_URL}${path}`;

  const fetchComments = async () => {
    try {
      const res = await api.get(
        `/comments/product-comments/${productId}/`
      );
      setComments(res.data);
    } catch {
      toast.error(t("errorCargarComentarios"));
    }
  };

  useEffect(() => {
    if (productId) fetchComments();
  }, [productId]);

  /** Crear comentario */
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && newImages.length === 0) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("product", String(productId));
      formData.append("comment", newComment);
      newImages.forEach((file) => formData.append("images", file));

      await api.post("/comments/new-comment/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewComment("");
      setNewImages([]);
      toast.success(t("comentarioAgregado"));
      fetchComments();
    } catch {
      toast.error(t("errorAgregarComentario"));
    } finally {
      setLoading(false);
    }
  };

  /** Editar comentario */
  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingId(commentId);
    setEditingText(currentText);
    setEditingImages([]);
    setDeleteImages([]);
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editingText.trim() && editingImages.length === 0 && deleteImages.length === 0) {
      setEditingId(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comment", editingText);
      editingImages.forEach((file) => formData.append("images", file));
      deleteImages.forEach((id) => formData.append("delete_images", String(id)));

      await api.put(`/comments/edit-comment/${commentId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("comentarioActualizado"));
      setEditingId(null);
      setEditingText("");
      setEditingImages([]);
      setDeleteImages([]);
      fetchComments();
    } catch {
      toast.error(t("errorActualizarComentario"));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingImages([]);
    setDeleteImages([]);
  };

  /** Eliminar comentario */
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/delete-comment/${commentId}/`);
      toast.success(t("comentarioEliminado"));
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      toast.error(t("errorEliminarComentario"));
    }
  };

  /** Manejar selección de nuevas imágenes */
  const handleNewImagesChange = (files: FileList | null, isEditing = false) => {
    if (!files) return;
    const fileArray = Array.from(files);
    if (isEditing) {
      setEditingImages([...editingImages, ...fileArray]);
    } else {
      setNewImages([...newImages, ...fileArray]);
    }
  };

  /** Eliminar imagen seleccionada antes de enviar (nueva) */
  const handleRemoveNewImage = (index: number, isEditing = false) => {
    if (isEditing) {
      setEditingImages(editingImages.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">🌿</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
          {t("opinionUsuarios")}
        </h2>
        <div className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full font-medium">
          {comments.length} {t("comentarios")}
        </div>
      </div>

      {/* Lista de comentarios */}
      {comments.length > 0 ? (
        <ul className="space-y-6">
          {comments.map((c, index) => (
            <li 
              key={c.id} 
              className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {c.user?.profile_image ? (
                    <div className="relative">
                      <img
                        src={getFullImageUrl(c.user.profile_image)}
                        alt={c.user.username}
                        className="w-12 h-12 rounded-full border-2 border-green-400 dark:border-green-500 object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {c.user?.username?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {c.user?.username || "Usuario"}
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    </div>
                  </div>

                  {/* Modo edición */}
                  {editingId === c.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      />

                      {/* Imágenes existentes con opción de borrar */}
                      {c.images.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {c.images.map((img) => (
                            <div key={img.id} className="relative group">
                              <img
                                src={getFullImageUrl(img.image)}
                                alt="comment-img"
                                className="w-20 h-20 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                              />
                              <button
                                type="button"
                                onClick={() => setDeleteImages([...deleteImages, img.id])}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                title="Eliminar imagen"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Previsualización nuevas imágenes */}
                      {editingImages.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {editingImages.map((file, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt="new-img"
                                className="w-20 h-20 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveNewImage(i, true)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                title={t("eliminar")}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Agregar nuevas imágenes */}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleNewImagesChange(e.target.files, true)}
                        className="text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400 dark:hover:file:bg-green-800/50"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSaveEdit(c.id)}
                          className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          {t("guardar")}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-xl transition-all duration-200 font-medium"
                        >
                          {t("cancelar")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{c.comment}</p>
                      {c.images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-3">
                          {c.images.map((img, imgIndex) => (
                            <div key={img.id} className="relative group">
                              <img
                                src={getFullImageUrl(img.image)}
                                alt="comment-img"
                                className="w-24 h-24 rounded-lg object-cover border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
                                style={{ animationDelay: `${imgIndex * 100}ms` }}
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Acciones solo para el creador */}
              {c.user?.id === currentUser?.id && editingId !== c.id && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                    title={t("eliminar")}
                  >
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleEditComment(c.id, c.comment)}
                    className="p-2 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                    title={t("editar")}
                  >
                    <Edit2 size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            {t("noComentarios")}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {t("sePrimeroOpinar")}
          </p>
        </div>
      )}

      {/* Separador */}
      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
          {t("escribeOpinion")}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      </div>

      {/* Formulario nuevo comentario */}
      <form onSubmit={handleAddComment} className="space-y-4">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("placeholderComentario")}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 min-h-[100px] resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
            {newComment.length}/500
          </div>
        </div>

        {/* Previsualización nuevas imágenes */}
        {newImages.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("imagenesAdjuntas")} ({newImages.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {newImages.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new-img"
                    className="w-20 h-20 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    title="Eliminar"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleNewImagesChange(e.target.files)}
              className="hidden"
            />
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t("agregarFotos")}
            </div>
          </label>

          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl hover:scale-105 group"
          >
            <Send size={18} className="group-hover:scale-110 transition-transform" />
            <span>{loading ? (t("enviando")) : (t("publicar"))}</span>
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-1"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComentsProduct;
