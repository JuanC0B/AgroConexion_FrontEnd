'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { isAuthenticated as checkAuth, getStoredTokens } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ReceiptText, Moon, Sun, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import NotAuthenticated from "@/components/errores/Authorization";
import { useLanguage } from '@/context/LanguageContext';

/**
 * Componente principal que lista todas las facturas del usuario.
 * 
 * Características:
 * - Valida autenticación del usuario (cliente y servidor).
 * - Redirige al login si no está autenticado.
 * - Consume la API `/invoices/list-invoice/` para obtener las facturas.
 * - Muestra las facturas ordenadas por fecha de creación (más recientes primero).
 * - Cada factura puede expandirse para mostrar el detalle de productos.
 * - Incluye animaciones con Framer Motion al expandir/colapsar.
 * - Soporte completo para modo oscuro con Tailwind CSS.
 */
const ListInvoices = () => {
  const router = useRouter();

  const { t } = useLanguage();
  // Estado que guarda la lista de facturas obtenidas de la API
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  // Estado de carga para mostrar "Cargando..."
  const [loading, setLoading] = useState(true);
  // Estado de autenticación proporcionado por el hook de autenticación global
  const { isAuthenticated } = useAuth();
  // Estado para manejar errores relacionados a autenticación u obtención de datos
  const [error, setError] = useState('');
  // Token de acceso obtenido del almacenamiento local
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // Estado que guarda el ID de la factura actualmente expandida (o null si ninguna está abierta)
  const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null);
  // Controla si el componente ya se montó en el cliente (para evitar problemas de SSR)
  const [hasMounted, setHasMounted] = useState(false);
  // Estado que indica si el cliente está autenticado correctamente
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  /**
   * Verifica si el usuario está autenticado.
   * Si no lo está, muestra un error y lo redirige al login en 3 segundos.
   * Si lo está, guarda el accessToken y permite continuar.
   */
  useEffect(() => {
    if (!hasMounted) return;

    const { access } = getStoredTokens();
    if (!access || !checkAuth()) {
      setIsClientAuthenticated(false);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setAccessToken(access);
      setIsClientAuthenticated(true);
    }
  }, [router, hasMounted]);

  /**
   * Obtiene la lista de facturas desde la API.
   * Ordena las facturas de más reciente a más antigua por `date_created`.
   */
  useEffect(() => {
    if (!hasMounted || !isClientAuthenticated) return;

    const fetchInvoices = async () => {
      try {
        const response = await api.get('/invoices/list-invoice/');
        const sorted = response.data.sort(
          (a: Invoice, b: Invoice) =>
            new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        );
        setInvoices(sorted);
      } catch (error) {
        toast.error(t("errorFacturas"));
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [hasMounted, isClientAuthenticated]);

  /**
   * Alterna entre mostrar u ocultar los detalles de una factura.
   * @param id - ID de la factura seleccionada
   */
  const toggleDetails = (id: number) => {
    setExpandedInvoice((prev) => (prev === id ? null : id));
  };

  /**
   * Da formato legible a una fecha en español (ej: "12 de agosto de 2025").
   */
  const formatDate = (dateString: string) => {
    if (!hasMounted) return dateString;
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  /**
   * Da formato de moneda a valores numéricos en COP.
   */
  const formatCurrency = (amount: string) => {
    if (!hasMounted) return amount;
    return parseFloat(amount).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    });
  };

  // --- COMPONENTES INTERNOS ---

  /**
   * Componente de carga
   */
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 dark:border-green-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">{t("cargandoFacturas")}</p>
      </div>
    </div>
  );

  /**
   * Componente de estado vacío
   */
  const EmptyState = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
          {t("noFacturas")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("textoNoFacturas")}
        </p>
        <Link 
          href="/productos" 
          className="inline-flex items-center px-6 py-3 bg-green-600 dark:bg-green-500 text-white font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
        >
          {t("explorarProductos")}
        </Link>
      </div>
    </div>
  );

  /**
   * Componente de cabecera de factura
   */
  const InvoiceHeader = ({ invoice }: { invoice: Invoice }) => (
    <div
      className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 flex justify-between items-center cursor-pointer text-white hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-all duration-200"
      onClick={() => toggleDetails(invoice.id)}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white dark:bg-gray-100 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200">
          <ReceiptText className="text-green-700 dark:text-green-600 w-6 h-6" />
        </div>
        <div>
          <Link href={`/invoices/${invoice.id}`}>
            <h2 className="text-lg font-bold hover:text-green-100 transition-colors duration-200">
              {t("factura")} #{invoice.id}
            </h2>
          </Link>
          <p className="text-sm opacity-90 text-green-100">
            {formatDate(invoice.date_created)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="bg-white dark:bg-gray-100 text-green-700 dark:text-green-600 px-4 py-2 rounded-full font-bold shadow-lg text-sm">
          {formatCurrency(invoice.total)}
        </span>
        <div className="bg-green-500 dark:bg-green-600 p-2 rounded-full">
          {expandedInvoice === invoice.id ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );

  /**
   * Componente de detalles de productos
   */
  const ProductDetails = ({ invoice }: { invoice: Invoice }) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden bg-gradient-to-b from-green-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border-t border-green-200 dark:border-gray-700"
    >
      <div className="p-6">
        {invoice.details.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-green-200 dark:bg-gray-700 text-green-900 dark:text-gray-100">
                  <th className="py-3 px-4 text-left font-semibold">🌽 {t("producto")}</th>
                  <th className="py-3 px-4 text-left font-semibold">👨‍🌾 {t("vendedor")}</th>
                  <th className="py-3 px-4 text-left font-semibold">📦 {t("cantidad")}</th>
                  <th className="py-3 px-4 text-left font-semibold">💲 {t("precioUnitario")}</th>
                  <th className="py-3 px-4 text-left font-semibold">🧾 {t("subtotal")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100 dark:divide-gray-600">
                {invoice.details.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-green-50 dark:bg-gray-750'
                    } text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:bg-gray-600 transition-colors duration-150`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {item.product_name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {item.seller_name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-700 dark:text-green-400">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 italic">
              Esta factura no tiene productos registrados.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  // --- VISTAS SEGÚN EL ESTADO DEL COMPONENTE ---

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">Inicializando...</div>
      </div>
    );
  }

  if (!isClientAuthenticated) {
    return <NotAuthenticated />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (invoices.length === 0) {
    return <EmptyState />;
  }

  // --- RENDER PRINCIPAL ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header con título y botón de modo oscuro */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-center flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 dark:text-green-100 mb-2">
              🌾 {t("misFacturas")}
            </h1>
            <p className="text-green-700 dark:text-green-300 text-lg">
              {t("historialCompras")}
            </p>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t("totalFacturas")}</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{invoices.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t("ultimaCompra")}</h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {formatDate(invoices[0]?.date_created)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t("montoTotal")}</h3>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(
                invoices.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0).toString()
              )}
            </p>
          </div>
        </div>

        {/* Listado de facturas */}
        <div className="space-y-6">
          {invoices.map((invoice) => (
            <motion.div
              key={invoice.id}
              className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <InvoiceHeader invoice={invoice} />
              
              <AnimatePresence>
                {expandedInvoice === invoice.id && (
                  <ProductDetails invoice={invoice} />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer con información adicional */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("mostrandoFacturas")} {invoices.length} {t("factura")}{invoices.length !== 1 ? 's' : ''} •  
            {t("ultimaActualizacion")} {new Date().toLocaleDateString('es-CO')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListInvoices;