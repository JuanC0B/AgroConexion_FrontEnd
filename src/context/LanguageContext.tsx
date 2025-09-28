"use client";

import { createContext, useContext, useState, useEffect } from "react";

/* ============================================================
   TIPOS
============================================================ */

type Language = "es" | "en";

type LanguageContextType = {
  language: Language;              // Idioma actual
  toggleLanguage: () => void;      // Cambiar entre idiomas
  t: (key: string) => string;      // Función para traducir textos
};

/* ============================================================
   TRADUCCIONES (clave → [es, en])
============================================================ */

const translations: Record<string, [string, string]> = {
  offers: ["Te pueden gustar", "You may like"],
  recommended: ["🌱 Recomendados", "🌱 Recommended"],
  messages1: [
    "🛒 ¡Compra directo del campesino sin intermediarios!",
    "🛒 Buy directly from farmers, no middlemen!",
  ],
  messages2: [
    "🌽 Productos frescos cosechados con amor colombiano",
    "🌽 Fresh products harvested with Colombian love",
  ],
  messages3: [
    "🚚 Entregas rápidas y seguras en toda Colombia",
    "🚚 Fast and secure delivery across Colombia",
  ],
  messages4: [
    "💰 ¡Aprovecha ofertas semanales y descuentos exclusivos!",
    "💰 Enjoy weekly offers and exclusive discounts!",
  ],
  messages5: [
    "🌱 Apoya el agro nacional con cada compra que haces",
    "🌱 Support local farmers with every purchase",
  ],
  messages6: [
    "🍅 Frutas y verduras frescas recién cosechadas",
    "🍅 Freshly harvested fruits and vegetables",
  ],
  messages7: [
    "📦 Envíos gratis por compras superiores a $50.000",
    "📦 Free shipping on orders over $50,000",
  ],
  messages8: [
    "🥚 ¡Huevos, lácteos y más del campo a tu mesa!",
    "🥚 Eggs, dairy, and more from farm to table!",
  ],
  messages9: [
    "🧑‍🌾 Cada producto tiene una historia campesina detrás",
    "🧑‍🌾 Every product has a farmer’s story behind it",
  ],
  welcome: ['Bienvenido a', 'Welcome to'],
  description: [
    'Conecta directamente con productos del campo colombiano. Calidad, frescura y apoyo al campesinado en un solo lugar.',
    'Connect directly with Colombian farm products. Quality, freshness, and support for farmers all in one place.'
  ],
  viewProducts: ['Ver productos', 'View products'],
  categorias: ['Categorías', 'Categories'],
  notificaciones: ['Notificaciones', 'Notifications'],
  detallenotificacion: ['📭 No tienes notificaciones aún', '📭 You have no notifications yet'],
  cargandoNotificaciones: ['Cargando notificaciones', 'Loading notifications'],
  iniciaSesionNotificaciones: ["🔒 Inicia sesión para ver tus notificaciones", "🔒 Log in to see your notifications"],
  footerDescription: ["Conectamos el campo colombiano con las familias, ofreciendo productos frescos, naturales y de calidad directamente de los campesinos.", "We connect Colombian farmers with families, offering fresh, natural, and quality products directly from farmers.",],
  enlaces: ["Enlaces", "Links"],
  sobreNosotros: ["Sobre Nosotros", "About Us"],
  contacto: ["Contacto", "Contact"],
  politicaDePrivacidad: ["Política de Privacidad", "Privacy Policy"],
  siguenos: ["Síguenos", "Follow Us"],
  contactoTitle: ["Contacto", "Contact"],
  todosLosDerechosReservados: ["Todos los derechos reservados.", "All rights reserved."], stock: ["Stock: ", "Stock: "],
  unitOfMeasure: ["Medida: ", "Unit: "],
  viewProduct: ["Ver producto", "View product"],
  VerTodos: ["Ver todos", "View all"],
  // Botones
  agregarCarrito: ['Añadir', 'Add'],
  quitarCarrito: ['Quitar', 'Remove'],
  verMas: ['Ver más', 'View More'],

  // Mensajes de favoritos
  productoAgregadoFavoritos: ['Producto agregado a favoritos ❤️', 'Product added to favorites ❤️'],
  productoEliminadoFavoritos: ['Producto eliminado de favoritos ❤️', 'Product removed from favorites ❤️'],
  iniciaSesionFavoritos: ['🔒 Inicia sesión para gestionar favoritos', '🔒 Log in to manage favorites'],
  errorFavoritos: ['❌ Error al actualizar favoritos', '❌ Error updating favorites'],

  // Mensajes del carrito
  productoAgregadoCarrito: ['Producto agregado al carrito 🛒', 'Product added to cart 🛒'],
  productoEliminadoCarrito: ['Producto eliminado del carrito 🛒', 'Product removed from cart 🛒'],
  iniciaSesionCarrito: ['🔒 Inicia sesión para agregar productos al carrito', '🔒 Log in to add products to cart'],
  errorCarrito: ['❌ Error al actualizar el carrito', '❌ Error updating cart'],

  // Información de producto
  exploraPorCategorias: ["✨ Explora por Categorías", "✨ Explore by Categories"],
  frutas: ["Frutas 🍎", "Fruits 🍎"],
  verduras: ["Verduras 🥕", "Vegetables 🥕"],
  lacteos: ["Lácteos 🧀", "Dairy 🧀"],
  pescados: ["Pescados 🐟", "Fish 🐟"],
  hierbas: ["Hierbas 🌿", "Herbs 🌿"],
  infproductos: ["Explora la variedad de productos campesinos disponibles en nuestra plataforma", "Explore the variety of farmer products available on our platform."],
  buscar: ["Buscar frutas, verduras, lácteos...", "Search fruits, vegetables, dairy..."],
  todos: ["Todas", "All"],

  // LoginForm
  iniciarSesion: ["Iniciar Sesión", "Log In"],
  accedeCuenta: ["Accede a tu cuenta", "Access your account"],
  nombreUsuario: ["Nombre de usuario", "Username"],
  contraseña: ["Contraseña", "Password"],
  mostrarContraseña: ["Mostrar contraseña", "Show password"],
  ocultarContraseña: ["Ocultar contraseña", "Hide password"],
  cargando: ["Cargando...", "Loading..."],
  crearCuenta: ["Crear Cuenta", "Create Account"],
  recuperarContraseña: ["Recuperar Contraseña", "Forgot Password"],
  ingresaNombreUsuario: ["Ingresa tu nombre de usuario", "Enter your username"],
  ingresarContrasena: ["Ingresa tu contraseña", "Enter your password"],


  // RegisterForm
  unetePlataforma: ["Únete a nuestra plataforma", "Join our platform"],
  email: ["Email", "Email"],
  minimo8Caracteres: ["Mínimo 8 caracteres", "At least 8 characters"],
  repetirContrasena: ["Repite tu contraseña", "Repeat your password"],
  confirmarContrasena: ["Confirmar contraseña", "Confirm Password"],
  yaTengoCuenta: ["Ya tengo cuenta", "Already have an account"],
  registrarAgrupacion: ["Registrar agrupación", "Register group"],

  // NavUser
  menuUsuario: ["Menú de usuario", "User menu"],
  sesionCerrada: ["👋 Sesión cerrada correctamente", "👋 Logged out successfully"],
  misFavoritos: ["Mis favoritos", "My favorites"],
  misFacturas: ["Mis Facturas", "My Invoices"],
  nuevoProducto: ["Nuevo producto", "New Product"],
  misProductos: ["Mis productos", "My Products"],
  estadisticas: ["Estadísticas", "Statistics"],
  ventas: ["Ventas", "Sales"],
  cerrarSesion: ["Cerrar sesión", "Log out"],
  registrarse: ["Registrarse", "Register"],
  estadistica: ['Estadisticas','Statistics'],

  // DetailProduct
  cargandoProducto: ["Cargando producto...", "Loading product..."],
  errorCargarProducto: ["No se pudo cargar el producto. Inténtalo más tarde.", "Could not load product. Please try again later."],
  productoNoEncontrado: ["Producto no encontrado", "Product not found"],
  inicio: ["Inicio", "Home"],
  productos: ["Productos", "Products"],
  ahorras: ["¡Ahorras", "You save"],
  stockDisponible: ["Stock disponible:", "Available stock:"],
  descripcion: ["Descripción", "Description"],
  cuponDisponible: ["¡Cupón disponible!", "Coupon available!"],
  productosPremium: ["Productos premium", "Premium products"],
  disfrutaProductos: ["Disfruta de los mejores productos", "Enjoy the best products"],
  garantiaTotal: ["Garantía total", "Full warranty"],
  garantiaCalidad: ["Garantía de calidad", "Quality guarantee"],
  noTienesProductos: ["No tienes productos registrados.", "You have no products registered."],
  errorAlCargar: ["Error al cargar los productos.", "Error loading products."],

  comentariosYResenas: ["Comentarios y reseñas", "Comments & Reviews"],

  // AgregarCarrito
  productoAgregado: ["Producto agregado al carrito 🛒", "Product added to cart 🛒"],
  errorAgregar: ["Error al agregar al carrito", "Error adding to cart"],
  cart:['Mi carrito','My cart'],
  agregando: ["Agregando...", "Adding..."],
  agregarAlCarrito: ["Agregar al carrito", "Add to cart"],

  // ComprarProducto
  cantidad: ["Cantidad", "Quantity"],
  comprarAhora: ["Comprar", "Buy now"],

  errorCantidad: ["❌ La cantidad debe ser mayor a 0", "❌ Quantity must be greater than 0"],

  // NewRating
  comoCalificarias: [
    "¿Cómo calificarías este producto?",
    "How would you rate this product?"
  ],
  graciasCalificacion: [
    "Gracias por tu calificación",
    "Thanks for your rating"
  ],
  errorCalificacion: [
    "Error al enviar la calificación. Intenta de nuevo.",
    "Error sending rating. Please try again."
  ],
  enviando: ["Enviando...", "Sending..."],
  calificarEstrellas: [
    "Calificar {n} estrellas",
    "Rate {n} stars"
  ],
  // Comments
  opinionUsuarios: [
    "Opiniones de usuarios",
    "User reviews"
  ],
  comentarios: ["comentarios", "comments"],
  noComentarios: [
    "Aún no hay comentarios",
    "No comments yet"
  ],
  sePrimeroOpinar: [
    "¡Sé el primero en compartir tu opinión!",
    "Be the first to share your opinion!"
  ],
  escribeOpinion: [
    "Escribe tu opinión",
    "Write your opinion"
  ],
  placeholderComentario: [
    "Comparte tu experiencia con este producto...",
    "Share your experience with this product..."
  ],
  imagenesAdjuntas: [
    "Imágenes adjuntas",
    "Attached images"
  ],
  agregarFotos: ["Agregar fotos", "Add photos"],
  publicar: ["Publicar", "Post"],

  // Toasts
  errorCargarComentarios: [
    "No se pudieron cargar los comentarios.",
    "Failed to load comments."
  ],
  comentarioAgregado: [
    "Comentario agregado 🌱",
    "Comment added 🌱"
  ],
  errorAgregarComentario: [
    "No se pudo agregar el comentario.",
    "Failed to add comment."
  ],
  comentarioActualizado: [
    "Comentario actualizado ✨",
    "Comment updated ✨"
  ],
  errorActualizarComentario: [
    "No se pudo actualizar el comentario.",
    "Failed to update comment."
  ],
  comentarioEliminado: [
    "Comentario eliminado 🗑️",
    "Comment deleted 🗑️"
  ],
  errorEliminarComentario: [
    "No se pudo eliminar el comentario.",
    "Failed to delete comment."
  ],
  guardar: ["Guardar", "Save"],
  cancelar: ["Cancelar", "Cancel"],
  eliminar: ["Eliminar", "Delete"],
  editar: ["Editar", "Edit"],

  // Loading & errors
  cargandoProductos: ["Cargando productos...", "Loading products..."],
  errorCategoria: ["Error al obtener categoría", "Error fetching category"],
  noCategoria: ["No se encontró la categoría", "Category not found"],

  // Hero / intro
  conoceProductos: [
    "Conoce nuestros productos campesinos",
    "Discover our farmers' products"
  ],
  textoIntroCategoria: [
    "Cada producto en esta categoría proviene directamente de campesinos locales, cultivado con dedicación y respeto por la tierra. Comprar aquí significa apoyar a las comunidades rurales y disfrutar de alimentos frescos y de calidad.",
    "Each product in this category comes directly from local farmers, cultivated with dedication and respect for the land. Shopping here means supporting rural communities and enjoying fresh, high-quality food."
  ],

  // Products section
  productosDisponibles: ["Productos disponibles", "Available products"],
  noProductos: [
    "No hay productos en esta categoría",
    "No products in this category"
  ],
  vuelvePronto: [
    "Vuelve pronto, nuestros campesinos están cosechando más productos para ti.",
    "Come back soon, our farmers are harvesting more products for you."
  ],

  // CTA final
  graciasCampesinos: [
    "🌾 Gracias por apoyar a nuestros campesinos",
    "🌾 Thank you for supporting our farmers"
  ],
  textoFinalCategoria: [
    "Cada compra impulsa el trabajo de las familias rurales y fomenta un comercio justo. Explora más categorías y descubre la riqueza del campo colombiano.",
    "Each purchase supports the work of rural families and promotes fair trade. Explore more categories and discover the richness of the Colombian countryside."
  ],
  verMasProductos: ["Ver más productos", "See more products"],
  anadirFavoritos: ["Añadir a favoritos", "Add to favorites"],
  anadiendo: ["Añadiendo...", "Adding..."],
  categoriaFavorito: [
    "✅ Categoría añadida a favoritos",
    "✅ Category added to favorites"
  ],
  yaFavorito: [
    "⚠️ Esta categoría ya está en favoritos",
    "⚠️ This category is already in favorites"
  ],
  errorFavorito: [
    "❌ Error al añadir a favoritos",
    "❌ Error adding to favorites"
  ],

  // Loading & states
  inicializando: ["Inicializando...", "Initializing..."],
  cargandoFacturas: ["Cargando facturas...", "Loading invoices..."],
  errorFacturas: ["Error al cargar las facturas", "Error loading invoices"],

  // Empty state
  noFacturas: ["No tienes facturas", "You don’t have any invoices"],
  textoNoFacturas: [
    "Aún no has registrado ninguna factura. Cuando realices tu primera compra, aparecerá aquí.",
    "You haven’t registered any invoices yet. Once you make your first purchase, it will appear here."
  ],
  explorarProductos: ["Explorar productos", "Browse products"],

  // Invoice header
  factura: ["Factura", "Invoice"],
  sinProductosFactura: [
    "Esta factura no tiene productos registrados.",
    "This invoice has no registered products."
  ],

  // Main header
  historialCompras: ["Historial completo de tus compras", "Complete history of your purchases"],

  // Stats
  totalFacturas: ["Total de Facturas", "Total Invoices"],
  ultimaCompra: ["Última Compra", "Last Purchase"],
  montoTotal: ["Monto Total", "Total Amount"],

  // Table headers
  producto: ["Producto", "Product"],
  precioUnitario: ["Precio Unitario", "Unit Price"],

  // Footer
  mostrandoFacturas: ["Mostrando", "Showing"],
  ultimaActualizacion: ["Última actualización:", "Last updated:"],

  usuario: ["Usuario", "User"],
  noInfoUsuario: ["No hay información disponible del usuario.", "No user information available."],
  agrupacionCampesina: ["👥 Agrupación campesina", "👥 Farmers' group"],
  administrador: ["🛡️ Administrador", "🛡️ Admin"],
  usuarioComun: ["👤 Usuario común", "👤 Common user"],
  correo: ["Correo", "Email"],
  telefono: ["Teléfono", "Phone"],
  direccion: ["Dirección", "Address"],
  rol: ["Rol", "Role"],
  noRegistrado: ["No registrado", "Not registered"],
  noRegistrada: ["No registrada", "Not registered"],
  vendedor: ["Vendedor", "Seller"],
  cliente: ["Cliente", "Customer"],
  autenticacionDosPasos: ["Autenticación en dos pasos", "Two-factor authentication"],
  activada: ["✅ Activada", "✅ Enabled"],
  desactivada: ["❌ Desactivada", "❌ Disabled"],
  infoAgrupacion: ["Información de la Agrupación", "Group Information"],
  nit: ["NIT", "NIT"],
  tipoOrganizacion: ["Tipo de organización", "Organization type"],
  representante: ["Representante", "Representative"],
  cedula: ["Cédula", "ID"],

  cartTitle: ["🛒 Tu carrito", "🛒 Your cart"],
  loading: ["Cargando tu carrito...", "Loading your cart..."],
  emptyTitle: ["Tu carrito está vacío", "Your cart is empty"],
  emptyDescription: ["Explora nuestros productos y agrégalos al carrito.", "Browse our products and add them to the cart."],
  goShopping: ["Ir a comprar", "Go Shopping"],
  updatedQuantity: ["Cantidad actualizada ✅", "Quantity updated ✅"],
  updateError: ["No se pudo actualizar la cantidad ❌", "Could not update quantity ❌"],
  productRemoved: ["Producto eliminado 🗑️", "Product removed 🗑️"],
  removeError: ["No se pudo eliminar el producto ❌", "Failed to remove product ❌"],
  updating: ["Actualizando...", "Updating..."],
  subtotal: ["Subtotal", "Subtotal"],
  each: ["c/u", "each"],
  summary: ["Resumen", "Summary"],
  items: ["productos", "items"],
  itemsInCart: ["Artículos en tu carrito", "Items in your cart"],
  total: ["Total:", "Total:"],
  remove: ["Eliminar", "Remove"],
  sinLeer: ["sin leer", "unread"],

  carritoVacio: ["Tu carrito está vacío ❌", "Your cart is empty ❌"],
  compraExitosa: ["✅ Compra realizada con éxito", "✅ Purchase completed successfully"],
  facturaGenerada: ["Factura generada", "Invoice generated"],
  verFactura: ["Ver factura", "View invoice"],
  errorCompra: ["Error al realizar la compra ❌", "Error processing purchase ❌"],
  resumenCompra: ["Resumen de tu compra", "Your purchase summary"],
  productosEnCarrito: ["producto(s) en tu carrito", "item(s) in your cart"],
  totalAPagar: ["Total a pagar", "Total to pay"],
  procesandoCompra: ["Procesando compra...", "Processing purchase..."],
  comprarTodo: ["Comprar todo el carrito", "Buy entire cart"],
  explorarMas: ["Explorar más productos", "Browse more products"],
  notaFactura: ["*Factura disponible en tu historial de compras", "*Invoice available in your purchase history"],

  panelVendedor: ["Panel de Vendedor", "Seller Panel"],
  verPerfil: ["Ver perfil", "View profile"],


  favoritosTitulo: ["❤️ Mis favoritos", "❤️ My favorites"],
  favoritosDescripcion: [
    "Aquí puedes ver todos los productos que has marcado como favoritos",
    "Here you can see all the products you’ve marked as favorites"
  ],
  favoritosError: [
    "⚠️ Hubo un error cargando tus favoritos, revisa consola",
    "⚠️ There was an error loading your favorites, check the console"
  ],
  favoritosDebesIniciarSesion: [
    "🔒 Debes iniciar sesión para ver tus favoritos.",
    "🔒 You must log in to see your favorites."
  ],
  favoritosVacio: [
    "🚫 No tienes productos favoritos aún.",
    "🚫 You don’t have any favorite products yet."
  ],
  favoritosCargando: [
    "Cargando favoritos...",
    "Loading favorites..."
  ],


  crearProductoTitulo: [
    "🌱 Crear Nuevo Producto",
    "🌱 Create New Product"
  ],
  crearProductoExito: [
    "✅ ¡Producto creado exitosamente!",
    "✅ Product created successfully!"
  ],
  crearProductoError: [
    "⚠️ Error al crear el producto. Inténtalo de nuevo.",
    "⚠️ Error creating the product. Please try again."
  ],
  crearProductoNoAutenticado: [
    "No estás autenticado. Serás redirigido al login...",
    "You are not authenticated. You will be redirected to login..."
  ],
  crearProductoCargando: [
    "Cargando...",
    "Loading..."
  ],
  crearProductoNombre: [
    "Nombre del Producto",
    "Product Name"
  ],
  crearProductoDescripcion: [
    "Descripción",
    "Description"
  ],
  agregaDescripcion: [
    "Agrega una descripción detallada del producto",
    "Add a detailed description of the product"
  ],
  crearProductoPrecio: [
    "Precio",
    "Price"
  ],
  crearProductoStock: [
    "Stock",
    "Stock"
  ],
  crearProductoCategorias: [
    "Categorías",
    "Categories"
  ],
  crearProductoUnidades: [
    "Unidades de Medida",
    "Units of Measure"
  ],
  crearProductoImagenes: [
    "Imágenes del Producto",
    "Product Images"
  ],
  crearProductoImagenesSubir: [
    "📷 Haz clic aquí para subir imágenes",
    "📷 Click here to upload images"
  ],
  crearProductoImagenesFormatos: [
    "Formatos soportados: JPG, PNG, GIF",
    "Supported formats: JPG, PNG, GIF"
  ],
  crearProductoImagenesSeleccionadas: [
    "Imágenes seleccionadas:",
    "Selected images:"
  ],
  seleccionaCategorias: [
    "Selecciona las categorías del producto",
    "Select the product categories"],

  crearProductoBoton: [
    "✅ Crear Producto",
    "✅ Create Product"
  ],
  crearProductoBotonCargando: [
    "🌱 Creando Producto...",
    "🌱 Creating Product..."
  ],
  crearProductoValidacionNombre: [
    "El nombre del producto es requerido",
    "Product name is required"
  ],
  crearProductoValidacionDescripcion: [
    "La descripción es requerida",
    "Description is required"
  ],
  crearProductoValidacionPrecio: [
    "El precio debe ser mayor a 0",
    "Price must be greater than 0"
  ],
  crearProductoValidacionStock: [
    "El stock no puede ser negativo",
    "Stock cannot be negative"
  ],
  crearProductoValidacionCategoria: [
    "Debe seleccionar al menos una categoría",
    "You must select at least one category"
  ],
  crearProductoValidacionUnidad: [
    "Debe seleccionar al menos una unidad de medida",
    "You must select at least one unit of measure"
  ],
  seleccionaUnidades: [
    "Selecciona las unidades de medida",
    "Select the units of measure"
  ],
  seleccionadas: [
    "seleccionada(s)",
    "selected"
  ],

  userProductsSinImagen: [
    "Sin imagen",
    "No image"
  ],
  userProductsOferta: [
    "Oferta",
    "Offer"
  ],
  userProductsCupon: [
    "Cupón",
    "Coupon"
  ],
  userProductsSinStock: [
    "Sin stock",
    "Out of stock"
  ],
  userProductsSinDescripcion: [
    "Sin descripción disponible",
    "No description available"
  ],
  userProductsUnidad: [
    "unidad",
    "unit"
  ],
  userProductsStock: [
    "Stock",
    "Stock"
  ],
  userProductsQuitarOferta: [
    "Quitar oferta",
    "Remove offer"
  ],
  userProductsAnadirOferta: [
    "Añadir oferta",
    "Add offer"
  ],
  userProductsQuitarCupon: [
    "Quitar cupón",
    "Remove coupon"
  ],
  userProductsAnadirCupon: [
    "Añadir cupón",
    "Add coupon"
  ],
  userProductsEditar: [
    "Editar",
    "Edit"
  ],
  userProductsEliminar: [
    "Eliminar",
    "Delete"
  ],
  userProductsOfertaDesactivada: [
    "❌ Oferta desactivada",
    "❌ Offer deactivated"
  ],
  userProductsErrorDesactivarOferta: [
    "⚠️ Error al desactivar la oferta",
    "⚠️ Error deactivating the offer"
  ],
  userProductsCuponDesactivado: [
    "❌ Cupón desactivado",
    "❌ Coupon deactivated"
  ],
  userProductsErrorDesactivarCupon: [
    "⚠️ Error al desactivar el cupón",
    "⚠️ Error deactivating the coupon"
  ],
  userProductsEliminado: [
    "Producto eliminado",
    "Product deleted"
  ],

  finanzasCargando: [
    "Cargando...",
    "Loading..."
  ],
  finanzasCargandoEstadisticas: [
    "Cargando estadísticas...",
    "Loading statistics..."
  ],
  finanzasErrorTitulo: [
    "No se pudieron cargar las estadísticas.",
    "Statistics could not be loaded."
  ],
  finanzasErrorMensaje: [
    "Por favor, inténtalo de nuevo más tarde.",
    "Please try again later."
  ],
  finanzasTotalGastado: [
    "Total Gastado",
    "Total Spent"
  ],
  finanzasTotalGastadoDesc: [
    "En todas tus compras",
    "On all your purchases"
  ],
  finanzasTotalGanado: [
    "Total Ganado",
    "Total Earned"
  ],
  finanzasTotalGanadoDesc: [
    "De tus ventas",
    "From your sales"
  ],
  finanzasProductoMasVendido: [
    "Producto Más Vendido",
    "Best Selling Product"
  ],
  finanzasProductoMasVendidoDesc: [
    "unidades",
    "units"
  ],
  finanzasProductoMenosVendido: [
    "Producto Menos Vendido",
    "Least Selling Product"
  ],
  finanzasProductoMenosVendidoDesc: [
    "unidades",
    "units"
  ],
  finanzasBalanceGeneral: [
    "Balance General",
    "General Balance"
  ],
  finanzasIngresos: [
    "Ingresos",
    "Income"
  ],
  finanzasGastos: [
    "Gastos",
    "Expenses"
  ],
  finanzasBalanceNeto: [
    "Balance Neto",
    "Net Balance"
  ],
  finanzasProductosDestacados: [
    "Productos Destacados",
    "Featured Products"
  ],
  finanzasMasVendido: [
    "Más Vendido",
    "Best Seller"
  ],
  finanzasMenosVendido: [
    "Menos Vendido",
    "Worst Seller"
  ],
  finanzasVendidos: [
    "vendidos",
    "sold"
  ],
  finanzasTendenciaPopular: [
    "Popular",
    "Popular"
  ],
  finanzasTendenciaMejorar: [
    "Mejorar",
    "Improve"
  ]


};

/* ============================================================
   CONTEXTO
============================================================ */

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/* ============================================================
   PROVIDER
============================================================ */

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  // Cargar idioma guardado en localStorage al iniciar
  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "es";
    setLanguage(savedLang);
  }, []);

  // Cambiar idioma (es <-> en)
  const toggleLanguage = () => {
    const newLang = language === "es" ? "en" : "es";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // Función de traducción usando array [es, en]
  const t = (key: string) => {
    const index = language === "es" ? 0 : 1;
    return translations[key]?.[index] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ============================================================
   HOOK PERSONALIZADO
============================================================ */

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
