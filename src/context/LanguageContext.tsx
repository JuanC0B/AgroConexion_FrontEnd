"use client";

import { createContext, useContext, useState, useEffect } from "react";

/* ============================================================
   TIPOS
============================================================ */

type Language = "es" | "en";

type LanguageContextType = {
  language: Language; // Idioma actual
  toggleLanguage: () => void; // Cambiar entre idiomas
  t: (key: string) => string; // Función para traducir textos
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
  welcome: ["Bienvenido a", "Welcome to"],
  description: [
    "Conecta directamente con productos del campo colombiano. Calidad, frescura y apoyo al campesinado en un solo lugar.",
    "Connect directly with Colombian farm products. Quality, freshness, and support for farmers all in one place.",
  ],
  viewProducts: ["Ver productos", "View products"],
  categorias: ["Categorías", "Categories"],
  notificaciones: ["Notificaciones", "Notifications"],
  detallenotificacion: [
    "📭 No tienes notificaciones aún",
    "📭 You have no notifications yet",
  ],
  cargandoNotificaciones: ["Cargando notificaciones", "Loading notifications"],
  iniciaSesionNotificaciones: [
    "🔒 Inicia sesión para ver tus notificaciones",
    "🔒 Log in to see your notifications",
  ],
  footerDescription: [
    "Conectamos el campo colombiano con las familias, ofreciendo productos frescos, naturales y de calidad directamente de los campesinos.",
    "We connect Colombian farmers with families, offering fresh, natural, and quality products directly from farmers.",
  ],
  enlaces: ["Enlaces", "Links"],
  sobreNosotros: ["Sobre Nosotros", "About Us"],
  contacto: ["Contacto", "Contact"],
  politicaDePrivacidad: ["Política de Privacidad", "Privacy Policy"],
  siguenos: ["Síguenos", "Follow Us"],
  contactoTitle: ["Contacto", "Contact"],
  todosLosDerechosReservados: [
    "Todos los derechos reservados.",
    "All rights reserved.",
  ],
  stock: ["Stock: ", "Stock: "],
  unitOfMeasure: ["Medida: ", "Unit: "],
  viewProduct: ["Ver producto", "View product"],
  VerTodos: ["Ver todos", "View all"],
  // Botones
  agregarCarrito: ["Añadir", "Add"],
  quitarCarrito: ["Quitar", "Remove"],
  verMas: ["Ver más", "View More"],

  // Mensajes de favoritos
  productoAgregadoFavoritos: [
    "Producto agregado a favoritos ❤️",
    "Product added to favorites ❤️",
  ],
  productoEliminadoFavoritos: [
    "Producto eliminado de favoritos ❤️",
    "Product removed from favorites ❤️",
  ],
  iniciaSesionFavoritos: [
    "🔒 Inicia sesión para gestionar favoritos",
    "🔒 Log in to manage favorites",
  ],
  errorFavoritos: [
    "❌ Error al actualizar favoritos",
    "❌ Error updating favorites",
  ],

  // Mensajes del carrito
  productoAgregadoCarrito: [
    "Producto agregado al carrito 🛒",
    "Product added to cart 🛒",
  ],
  productoEliminadoCarrito: [
    "Producto eliminado del carrito 🛒",
    "Product removed from cart 🛒",
  ],
  iniciaSesionCarrito: [
    "🔒 Inicia sesión para agregar productos al carrito",
    "🔒 Log in to add products to cart",
  ],
  errorCarrito: ["❌ Error al actualizar el carrito", "❌ Error updating cart"],

  // Información de producto
  exploraPorCategorias: [
    "✨ Explora por Categorías",
    "✨ Explore by Categories",
  ],
  frutas: ["Frutas 🍎", "Fruits 🍎"],
  verduras: ["Verduras 🥕", "Vegetables 🥕"],
  lacteos: ["Lácteos 🧀", "Dairy 🧀"],
  pescados: ["Pescados 🐟", "Fish 🐟"],
  hierbas: ["Hierbas 🌿", "Herbs 🌿"],
  infproductos: [
    "Explora la variedad de productos campesinos disponibles en nuestra plataforma",
    "Explore the variety of farmer products available on our platform.",
  ],
  buscar: [
    "Buscar frutas, verduras, lácteos...",
    "Search fruits, vegetables, dairy...",
  ],
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
  sesionCerrada: [
    "👋 Sesión cerrada correctamente",
    "👋 Logged out successfully",
  ],
  misFavoritos: ["Mis favoritos", "My favorites"],
  misFacturas: ["Mis Facturas", "My Invoices"],
  nuevoProducto: ["Nuevo producto", "New Product"],
  misProductos: ["Mis productos", "My Products"],
  estadisticas: ["Estadísticas", "Statistics"],
  ventas: ["Ventas", "Sales"],
  cerrarSesion: ["Cerrar sesión", "Log out"],
  registrarse: ["Registrarse", "Register"],
  estadistica: ["Estadisticas", "Statistics"],

  // DetailProduct
  cargandoProducto: ["Cargando producto...", "Loading product..."],
  errorCargarProducto: [
    "No se pudo cargar el producto. Inténtalo más tarde.",
    "Could not load product. Please try again later.",
  ],
  productoNoEncontrado: ["Producto no encontrado", "Product not found"],
  inicio: ["Inicio", "Home"],
  productos: ["Productos", "Products"],
  ahorras: ["¡Ahorras", "You save"],
  stockDisponible: ["Stock disponible:", "Available stock:"],
  descripcion: ["Descripción", "Description"],
  cuponDisponible: ["¡Cupón disponible!", "Coupon available!"],
  productosPremium: ["Productos premium", "Premium products"],
  disfrutaProductos: [
    "Disfruta de los mejores productos",
    "Enjoy the best products",
  ],
  garantiaTotal: ["Garantía total", "Full warranty"],
  garantiaCalidad: ["Garantía de calidad", "Quality guarantee"],
  noTienesProductos: [
    "No tienes productos registrados.",
    "You have no products registered.",
  ],
  errorAlCargar: ["Error al cargar los productos.", "Error loading products."],

  comentariosYResenas: ["Comentarios y reseñas", "Comments & Reviews"],

  // AgregarCarrito
  productoAgregado: [
    "Producto agregado al carrito 🛒",
    "Product added to cart 🛒",
  ],
  errorAgregar: ["Error al agregar al carrito", "Error adding to cart"],
  cart: ["Mi carrito", "My cart"],
  agregando: ["Agregando...", "Adding..."],
  agregarAlCarrito: ["Agregar al carrito", "Add to cart"],

  // ComprarProducto
  cantidad: ["Cantidad", "Quantity"],
  comprarAhora: ["Comprar", "Buy now"],

  errorCantidad: [
    "❌ La cantidad debe ser mayor a 0",
    "❌ Quantity must be greater than 0",
  ],

  // NewRating
  comoCalificarias: [
    "¿Cómo calificarías este producto?",
    "How would you rate this product?",
  ],
  graciasCalificacion: [
    "Gracias por tu calificación",
    "Thanks for your rating",
  ],
  errorCalificacion: [
    "Error al enviar la calificación. Intenta de nuevo.",
    "Error sending rating. Please try again.",
  ],
  enviando: ["Enviando...", "Sending..."],
  calificarEstrellas: ["Calificar {n} estrellas", "Rate {n} stars"],
  // Comments
  opinionUsuarios: ["Opiniones de usuarios", "User reviews"],
  comentarios: ["comentarios", "comments"],
  noComentarios: ["Aún no hay comentarios", "No comments yet"],
  sePrimeroOpinar: [
    "¡Sé el primero en compartir tu opinión!",
    "Be the first to share your opinion!",
  ],
  escribeOpinion: ["Escribe tu opinión", "Write your opinion"],
  placeholderComentario: [
    "Comparte tu experiencia con este producto...",
    "Share your experience with this product...",
  ],
  imagenesAdjuntas: ["Imágenes adjuntas", "Attached images"],
  agregarFotos: ["Agregar fotos", "Add photos"],
  publicar: ["Publicar", "Post"],

  // Toasts
  errorCargarComentarios: [
    "No se pudieron cargar los comentarios.",
    "Failed to load comments.",
  ],
  comentarioAgregado: ["Comentario agregado 🌱", "Comment added 🌱"],
  errorAgregarComentario: [
    "No se pudo agregar el comentario.",
    "Failed to add comment.",
  ],
  comentarioActualizado: ["Comentario actualizado ✨", "Comment updated ✨"],
  errorActualizarComentario: [
    "No se pudo actualizar el comentario.",
    "Failed to update comment.",
  ],
  comentarioEliminado: ["Comentario eliminado 🗑️", "Comment deleted 🗑️"],
  errorEliminarComentario: [
    "No se pudo eliminar el comentario.",
    "Failed to delete comment.",
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
    "Discover our farmers' products",
  ],
  textoIntroCategoria: [
    "Cada producto en esta categoría proviene directamente de campesinos locales, cultivado con dedicación y respeto por la tierra. Comprar aquí significa apoyar a las comunidades rurales y disfrutar de alimentos frescos y de calidad.",
    "Each product in this category comes directly from local farmers, cultivated with dedication and respect for the land. Shopping here means supporting rural communities and enjoying fresh, high-quality food.",
  ],

  // Products section
  productosDisponibles: ["Productos disponibles", "Available products"],
  noProductos: [
    "No hay productos en esta categoría",
    "No products in this category",
  ],
  vuelvePronto: [
    "Vuelve pronto, nuestros campesinos están cosechando más productos para ti.",
    "Come back soon, our farmers are harvesting more products for you.",
  ],

  // CTA final
  graciasCampesinos: [
    "🌾 Gracias por apoyar a nuestros campesinos",
    "🌾 Thank you for supporting our farmers",
  ],
  textoFinalCategoria: [
    "Cada compra impulsa el trabajo de las familias rurales y fomenta un comercio justo. Explora más categorías y descubre la riqueza del campo colombiano.",
    "Each purchase supports the work of rural families and promotes fair trade. Explore more categories and discover the richness of the Colombian countryside.",
  ],
  verMasProductos: ["Ver más productos", "See more products"],
  anadirFavoritos: ["Añadir a favoritos", "Add to favorites"],
  anadiendo: ["Añadiendo...", "Adding..."],
  categoriaFavorito: [
    "✅ Categoría añadida a favoritos",
    "✅ Category added to favorites",
  ],
  yaFavorito: [
    "⚠️ Esta categoría ya está en favoritos",
    "⚠️ This category is already in favorites",
  ],
  errorFavorito: [
    "❌ Error al añadir a favoritos",
    "❌ Error adding to favorites",
  ],

  // Loading & states
  inicializando: ["Inicializando...", "Initializing..."],
  cargandoFacturas: ["Cargando facturas...", "Loading invoices..."],
  errorFacturas: ["Error al cargar las facturas", "Error loading invoices"],

  // Empty state
  noFacturas: ["No tienes facturas", "You don’t have any invoices"],
  textoNoFacturas: [
    "Aún no has registrado ninguna factura. Cuando realices tu primera compra, aparecerá aquí.",
    "You haven’t registered any invoices yet. Once you make your first purchase, it will appear here.",
  ],
  explorarProductos: ["Explorar productos", "Browse products"],

  // Invoice header
  factura: ["Factura", "Invoice"],
  sinProductosFactura: [
    "Esta factura no tiene productos registrados.",
    "This invoice has no registered products.",
  ],

  // Main header
  historialCompras: [
    "Historial completo de tus compras",
    "Complete history of your purchases",
  ],

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
  noInfoUsuario: [
    "No hay información disponible del usuario.",
    "No user information available.",
  ],
  agrupacionCampesina: ["👥 Agrupación campesina", "👥 Farmers' group"],
  administrador: ["🛡️ Administrador", "🛡️ Admin"],
  usuarioComun: ["👤 Usuario común", "👤 Common user"],
  correo: ["Correo Electronico", "Email"],
  telefono: ["Teléfono", "Phone"],
  direccion: ["Dirección", "Address"],
  rol: ["Rol", "Role"],
  noRegistrado: ["No registrado", "Not registered"],
  noRegistrada: ["No registrada", "Not registered"],
  vendedor: ["Vendedor", "Seller"],
  cliente: ["Cliente", "Customer"],
  autenticacionDosPasos: [
    "Autenticación en dos pasos",
    "Two-factor authentication",
  ],
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
  emptyDescription: [
    "Explora nuestros productos y agrégalos al carrito.",
    "Browse our products and add them to the cart.",
  ],
  goShopping: ["Ir a comprar", "Go Shopping"],
  updatedQuantity: ["Cantidad actualizada ✅", "Quantity updated ✅"],
  updateError: [
    "No se pudo actualizar la cantidad ❌",
    "Could not update quantity ❌",
  ],
  productRemoved: ["Producto eliminado 🗑️", "Product removed 🗑️"],
  removeError: [
    "No se pudo eliminar el producto ❌",
    "Failed to remove product ❌",
  ],
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
  compraExitosa: [
    "✅ Compra realizada con éxito",
    "✅ Purchase completed successfully",
  ],
  facturaGenerada: ["Factura generada", "Invoice generated"],
  verFactura: ["Ver factura", "View invoice"],
  errorCompra: [
    "Error al realizar la compra ❌",
    "Error processing purchase ❌",
  ],
  resumenCompra: ["Resumen de tu compra", "Your purchase summary"],
  productosEnCarrito: ["producto(s) en tu carrito", "item(s) in your cart"],
  totalAPagar: ["Total a pagar", "Total to pay"],
  procesandoCompra: ["Procesando compra...", "Processing purchase..."],
  comprarTodo: ["Comprar todo el carrito", "Buy entire cart"],
  explorarMas: ["Explorar más productos", "Browse more products"],
  notaFactura: [
    "*Factura disponible en tu historial de compras",
    "*Invoice available in your purchase history",
  ],

  panelVendedor: ["Panel de Vendedor", "Seller Panel"],
  verPerfil: ["Ver perfil", "View profile"],

  favoritosTitulo: ["❤️ Mis favoritos", "❤️ My favorites"],
  favoritosDescripcion: [
    "Aquí puedes ver todos los productos que has marcado como favoritos",
    "Here you can see all the products you’ve marked as favorites",
  ],
  favoritosError: [
    "⚠️ Hubo un error cargando tus favoritos, revisa consola",
    "⚠️ There was an error loading your favorites, check the console",
  ],
  favoritosDebesIniciarSesion: [
    "🔒 Debes iniciar sesión para ver tus favoritos.",
    "🔒 You must log in to see your favorites.",
  ],
  favoritosVacio: [
    "🚫 No tienes productos favoritos aún.",
    "🚫 You don’t have any favorite products yet.",
  ],
  favoritosCargando: ["Cargando favoritos...", "Loading favorites..."],

  crearProductoTitulo: ["🌱 Crear Nuevo Producto", "🌱 Create New Product"],
  crearProductoExito: [
    "✅ ¡Producto creado exitosamente!",
    "✅ Product created successfully!",
  ],
  crearProductoError: [
    "⚠️ Error al crear el producto. Inténtalo de nuevo.",
    "⚠️ Error creating the product. Please try again.",
  ],
  crearProductoNoAutenticado: [
    "No estás autenticado. Serás redirigido al login...",
    "You are not authenticated. You will be redirected to login...",
  ],
  crearProductoCargando: ["Cargando...", "Loading..."],
  crearProductoNombre: ["Nombre del Producto", "Product Name"],
  crearProductoDescripcion: ["Descripción", "Description"],
  agregaDescripcion: [
    "Agrega una descripción detallada del producto",
    "Add a detailed description of the product",
  ],
  crearProductoPrecio: ["Precio", "Price"],
  crearProductoStock: ["Stock", "Stock"],
  crearProductoCategorias: ["Categorías", "Categories"],
  crearProductoUnidades: ["Unidades de Medida", "Units of Measure"],
  crearProductoImagenes: ["Imágenes del Producto", "Product Images"],
  crearProductoImagenesSubir: [
    "📷 Haz clic aquí para subir imágenes",
    "📷 Click here to upload images",
  ],
  crearProductoImagenesFormatos: [
    "Formatos soportados: JPG, PNG, GIF",
    "Supported formats: JPG, PNG, GIF",
  ],
  crearProductoImagenesSeleccionadas: [
    "Imágenes seleccionadas:",
    "Selected images:",
  ],
  seleccionaCategorias: [
    "Selecciona las categorías del producto",
    "Select the product categories",
  ],

  crearProductoBoton: ["✅ Crear Producto", "✅ Create Product"],
  crearProductoBotonCargando: [
    "🌱 Creando Producto...",
    "🌱 Creating Product...",
  ],
  crearProductoValidacionNombre: [
    "El nombre del producto es requerido",
    "Product name is required",
  ],
  crearProductoValidacionDescripcion: [
    "La descripción es requerida",
    "Description is required",
  ],
  crearProductoValidacionPrecio: [
    "El precio debe ser mayor a 0",
    "Price must be greater than 0",
  ],
  crearProductoValidacionStock: [
    "El stock no puede ser negativo",
    "Stock cannot be negative",
  ],
  crearProductoValidacionCategoria: [
    "Debe seleccionar al menos una categoría",
    "You must select at least one category",
  ],
  crearProductoValidacionUnidad: [
    "Debe seleccionar al menos una unidad de medida",
    "You must select at least one unit of measure",
  ],
  seleccionaUnidades: [
    "Selecciona las unidades de medida",
    "Select the units of measure",
  ],
  seleccionadas: ["seleccionada(s)", "selected"],

  userProductsSinImagen: ["Sin imagen", "No image"],
  userProductsOferta: ["Oferta", "Offer"],
  userProductsCupon: ["Cupón", "Coupon"],
  userProductsSinStock: ["Sin stock", "Out of stock"],
  userProductsSinDescripcion: [
    "Sin descripción disponible",
    "No description available",
  ],
  userProductsUnidad: ["unidad", "unit"],
  userProductsStock: ["Stock", "Stock"],
  userProductsQuitarOferta: ["Quitar oferta", "Remove offer"],
  userProductsAnadirOferta: ["Añadir oferta", "Add offer"],
  userProductsQuitarCupon: ["Quitar cupón", "Remove coupon"],
  userProductsAnadirCupon: ["Añadir cupón", "Add coupon"],
  userProductsEditar: ["Editar", "Edit"],
  userProductsEliminar: ["Eliminar", "Delete"],
  userProductsOfertaDesactivada: [
    "❌ Oferta desactivada",
    "❌ Offer deactivated",
  ],
  userProductsErrorDesactivarOferta: [
    "⚠️ Error al desactivar la oferta",
    "⚠️ Error deactivating the offer",
  ],
  userProductsCuponDesactivado: [
    "❌ Cupón desactivado",
    "❌ Coupon deactivated",
  ],
  userProductsErrorDesactivarCupon: [
    "⚠️ Error al desactivar el cupón",
    "⚠️ Error deactivating the coupon",
  ],
  userProductsEliminado: ["Producto eliminado", "Product deleted"],

  finanzasCargando: ["Cargando...", "Loading..."],
  finanzasCargandoEstadisticas: [
    "Cargando estadísticas...",
    "Loading statistics...",
  ],
  finanzasErrorTitulo: [
    "No se pudieron cargar las estadísticas.",
    "Statistics could not be loaded.",
  ],
  finanzasErrorMensaje: [
    "Por favor, inténtalo de nuevo más tarde.",
    "Please try again later.",
  ],
  finanzasTotalGastado: ["Total Gastado", "Total Spent"],
  finanzasTotalGastadoDesc: ["En todas tus compras", "On all your purchases"],
  finanzasTotalGanado: ["Total Ganado", "Total Earned"],
  finanzasTotalGanadoDesc: ["De tus ventas", "From your sales"],
  finanzasProductoMasVendido: ["Producto Más Vendido", "Best Selling Product"],
  finanzasProductoMasVendidoDesc: ["unidades", "units"],
  finanzasProductoMenosVendido: [
    "Producto Menos Vendido",
    "Least Selling Product",
  ],
  finanzasProductoMenosVendidoDesc: ["unidades", "units"],
  finanzasBalanceGeneral: ["Balance General", "General Balance"],
  finanzasIngresos: ["Ingresos", "Income"],
  finanzasGastos: ["Gastos", "Expenses"],
  finanzasBalanceNeto: ["Balance Neto", "Net Balance"],
  finanzasProductosDestacados: ["Productos Destacados", "Featured Products"],
  finanzasMasVendido: ["Más Vendido", "Best Seller"],
  finanzasMenosVendido: ["Menos Vendido", "Worst Seller"],
  finanzasVendidos: ["vendidos", "sold"],
  finanzasTendenciaPopular: ["Popular", "Popular"],
  finanzasTendenciaMejorar: ["Mejorar", "Improve"],

  // Productos del usuario
  myproductsparrafo: ["Producto", "Product"],
  myproductsparrafo2: ["registrado", "registered"],
  myproductsparrafo3: [
    "Administra y visualiza todos tus productos de manera fácil y organizada",
    "Manage and view all your products easily and in an organized manner",
  ],
  noproductos: [
    "¡Aún no tienes productos!",
    "You don't have any products yet!",
  ],
  mensaje: [
    "Comienza agregando tu primer producto para ver todo organizado aquí. Es rápido y fácil de configurar.",
    "Start by adding your first product to see everything organized here. It's quick and easy to set up.",
  ],
  agregar: ["Agregar mi primer producto", "Add my first product"],

  // formulario de ofertas
  formOfertaTitulo: ["Crear Nueva Oferta", "Create New Offer"],
  formOfertaSubtitulo: [
    "Promociona tus productos del campo",
    "Promote your farm products",
  ],

  formOfertaHeader: ["Detalles de la Oferta", "Offer Details"],
  formOfertaHeaderDesc: [
    "Promociona tus productos frescos del campo",
    "Promote your fresh farm products",
  ],

  formTituloLabel: ["Título de la Oferta", "Offer Title"],
  formTituloPlaceholder: [
    "Ej: Tomates frescos de la finca",
    "Ex: Fresh tomatoes from the farm",
  ],

  formDescripcionLabel: ["Descripción del Producto", "Product Description"],
  formDescripcionPlaceholder: [
    "Describe tu producto: origen, calidad, características especiales...",
    "Describe your product: origin, quality, special features...",
  ],

  formDescuentoLabel: ["Descuento (%)", "Discount (%)"],
  formDescuentoPlaceholder: ["15", "15"],

  formFechaLabel: ["Fecha de Vencimiento", "Expiration Date"],

  formVistaPrevia: ["Vista Previa de la Oferta", "Offer Preview"],
  formVistaPreviaHasta: ["Hasta:", "Until:"],
  formVistaPreviaOff: ["% OFF", "% OFF"],

  formBotonCrear: ["Crear Oferta Campesina", "Create Farm Offer"],
  formBotonCreando: ["Creando Oferta...", "Creating Offer..."],

  formConsejoTitulo: ["💡 Consejo para campesinos", "💡 Tip for farmers"],
  formConsejoTexto: [
    "Describe la frescura y origen de tus productos. Los compradores valoran la calidad y la historia detrás de cada cosecha.",
    "Describe the freshness and origin of your products. Buyers value the quality and the story behind each harvest.",
  ],

  // formulario de cupon

  // Variables de idioma para el formulario "Crear Cupón Campesino"
  formCuponTitulo: ["Crear Cupón de Descuento", "Create Discount Coupon"],
  formCuponSubtitulo: [
    "Recompensa la fidelidad de tus clientes",
    "Reward your customers' loyalty",
  ],

  formCuponHeader: ["Configuración del Cupón", "Coupon Settings"],
  formCuponHeaderDesc: [
    "Crea incentivos especiales para tus productos del campo",
    "Create special incentives for your farm products",
  ],

  formCuponNombreLabel: ["Nombre del Cupón", "Coupon Name"],
  formCuponNombrePlaceholder: [
    "Ej: Descuento cosecha fresca",
    "Ex: Fresh harvest discount",
  ],

  formCuponDescripcionLabel: ["Descripción del Cupón", "Coupon Description"],
  formCuponDescripcionPlaceholder: [
    "Explica los beneficios: productos frescos, calidad garantizada, directo del productor...",
    "Explain the benefits: fresh products, guaranteed quality, direct from the farmer...",
  ],

  formCuponDescuentoLabel: ["Descuento (%)", "Discount (%)"],

  formCuponMinimoLabel: ["Compra Mínima ($)", "Minimum Purchase ($)"],

  formCuponFechaLabel: ["Fecha de Vencimiento", "Expiration Date"],

  formCuponVistaPrevia: ["Vista Previa del Cupón", "Coupon Preview"],

  formCuponBotonCrear: ["Crear Cupón Campesino", "Create Farm Coupon"],
  formCuponBotonCreando: ["Creando Cupón...", "Creating Coupon..."],

  formCuponConsejoTitulo: ["🎁 Estrategia de cupones", "🎁 Coupon Strategy"],
  formCuponConsejoTexto: [
    "Los cupones aumentan la fidelidad del cliente y las ventas repetidas. Considera ofrecer descuentos por volumen o por temporada de cosecha.",
    "Coupons increase customer loyalty and repeat sales. Consider offering discounts for bulk purchases or harvest seasons.",
  ],


  errorCargaCupones: [
    "❌ Error cargando los cupones",
    "❌ Error loading coupons"
  ],
  NoCuponesdisponibles: [
    "🎟️ No hay cupones disponibles",
    "🎟️ No coupons available"
  ],
  misCupones: [
    "Mis Cupones",
    "My Coupons"
  ],
  disponibles: [
    "disponibles",
    "available"
  ],
  descripcionCupones: [
    "Aprovecha tus descuentos disponibles y ahorra en tu próxima compra",
    "Take advantage of your available discounts and save on your next purchase"
  ],
  cuponEspecial: [
    "Cupón especial",
    "Special coupon"
  ],
  usado: [
    "Usado",
    "Used"
  ],
  expirado: [
    "Expirado",
    "Expired"
  ],
  disponible: [
    "Disponible",
    "Available"
  ],
  descuento: [
    "de descuento",
    "discount"
  ],
  compraMinima: [
    "Compra mínima:",
    "Minimum purchase:"
  ],
  validoHasta: [
    "Válido hasta:",
    "Valid until:"
  ],
  codigo: [
    "Código:",
    "Code:"
  ],
  usarCupon: [
    "Usar cupón",
    "Use coupon"
  ],
  cuponUtilizado: [
    "Cupón Utilizado",
    "Coupon Used"
  ],
  cuponExpirado: [
    "Cupón Expirado",
    "Coupon Expired"
  ],
  yaUsado: [
    "Ya has usado este cupón",
    "You have already used this coupon"
  ],
  fechaExpirada: [
    "La fecha de validez ha expirado",
    "The validity date has expired"
  ],
  sinCupones: [
    "No tienes cupones disponibles",
    "You have no available coupons"
  ],
  descripcionSinCupones: [
    "Los cupones aparecerán aquí cuando estén disponibles",
    "Coupons will appear here when they are available"
  ],
  obtenerCupones: [
    "Compra productos para obtener cupones",
    "Buy products to get coupons"
  ],



  errorCargaCategorias: [
    "❌ Error al cargar categorías favoritas",
    "❌ Error loading favorite categories"
  ],
  eliminadoFavoritos: [
    "✅ Eliminado de favoritos",
    "✅ Removed from favorites"
  ],
  errorEliminar: [
    "❌ Error al eliminar",
    "❌ Error deleting"
  ],
  misCategoriasFavoritas: [
    "Mis Categorías Favoritas",
    "My Favorite Categories"
  ],
  categoriasGuardadas: [
    "{count} categoría(s) guardada(s)",
    "{count} saved category(ies)"
  ],

  descripcionCategorias: [
    "Tus categorías preferidas en un solo lugar. Explora y gestiona tus intereses favoritos de manera fácil y rápida",
    "Your favorite categories in one place. Explore and manage your interests easily and quickly"
  ],
  sinFavoritos: [
    "¡Aún no tienes favoritos!",
    "You don't have any favorites yet!"
  ],
  descripcionSinFavoritos: [
    "Explora nuestras categorías y guarda tus preferidas para acceder a ellas rápidamente",
    "Browse our categories and save your favorites to access them quickly"
  ],
  verCategoria: [
    "Ver categoría",
    "View category"
  ],
  ver: [
    "Ver",
    "View"
  ],
  eliminarFavoritos: [
    "Eliminar de favoritos",
    "Remove from favorites"
  ],
  eliminando: [
    "Eliminando...",
    "Deleting..."
  ],


  editProduct: ["Editar producto", "Edit product"],
  subtituloEditar: ["Modifica los detalles de tu producto", "Modify your product details"],


  nombreProducto: ["Nombre del producto", "Product name"],
  placeholderNombre: ["Ej. Café orgánico premium", "E.g. Premium organic coffee"],

  placeholderDescripcion: ["Agrega detalles sobre el producto...", "Add details about the product..."],

  precio: ["Precio (COP)", "Price (COP)"],

  imagenesActuales: ["Imágenes actuales", "Current images"],
  deshacer: ["Deshacer", "Undo"],
  noHayImagenes: ["No hay imágenes registradas", "No images registered"],

  agregarImagenes: ["Agregar nuevas imágenes", "Add new images"],
  limiteImagen: ["(Máximo 5MB por imagen)", "(Maximum 5MB per image)"],
  arrastrar: ["Arrastra imágenes aquí", "Drag images here"],
  soltar: ["¡Suelta las imágenes aquí!", "Drop images here!"],
  oHazClick: ["o haz clic para seleccionar archivos", "or click to select files"],
  formatosImagen: ["PNG, JPG, GIF hasta 5MB cada una", "PNG, JPG, GIF up to 5MB each"],

  nuevasImagenes: ["Nuevas imágenes", "New images"],
  quitar: ["Quitar", "Remove"],
  nuevo: ["Nuevo", "New"],
  notaNuevasImagenes: ["💡 Estas imágenes se subirán al guardar los cambios", "💡 These images will be uploaded when saving changes"],

  guardarCambios: ["Guardar cambios", "Save changes"],
  guardandoCambios: ["Guardando cambios...", "Saving changes..."],

  editarPerfil: ["Editar perfil", "Edit profile"],
  actualizaInfo: ["Actualiza tu información personal", "Update your personal information"],
  vistaPreviaPerfil: ["Vista previa del perfil", "Profile preview"],
  cambiarFoto: ["Cambiar foto", "Change photo"],
  correonoModificable:["El correo no se puede modificar","Email cannot be changed"],
  ingresaDireccion: ["Ingresa tu dirección", "Enter your address"],
  guardando: ["Guardando...", "Saving..."],
  miPerfil: ["Mi perfil", "My profile"],

  estadoUsuario: ["Estado del usuario", "User status"],
  cambiaModo: ["cambia entre modo comprador y vendedor", "switch between buyer and seller mode"],
  comprador: ["Comprador", "Buyer"],
  infoPermisos: ["Tienes permisos para crear y gestionar productos en tu tienda. Los compradores pueden ver tu inventario.", "You have permissions to create and manage products in your store. Buyers can view your inventory."],
  puedesNavegar: ["Puedes navegar y comprar productos de los vendedores registrados en la plataforma.", "You can browse and purchase products from sellers registered on the platform."],
  miembroAgrupacion: ["Miembro de una agrupacion", "Member of a group"],
  noPuedesCambiar: ["No puedes cambiar tu estado de vendedor porque perteneces a una agrupación. Los permisos son gestionados por el administrador del grupo.", "You cannot change your seller status because you belong to a group. Permissions are managed by the group administrator."],
  cambioNoDisponible: ["El cambio de estado no está disponible en este momento. Inténtalo más tarde.", "Status change is not available at this time. Please try again later."],
  beneficiosVendedor: ["Beneficios del modo vendedor:", "Benefits of seller mode:"],
  crearTienda: ["Crear y gestionar tu propia tienda.", "Create and manage your own store."],
  publicarProductos: ["Publicar productos y servicios.", "Publish products and services."],
  panelEstadisticas: ["Acceder a un panel de estadísticas de ventas.", "Access a sales statistics panel."],
  cambiando: ["Cambiando...", "Changing..."],
  cambiarVendedor: ["Cambiar a vendedor", "Switch to seller"],

  autenticacionDosFactores: ["Autenticacion de dos factores", "Two-factor authentication"],
  protegeCuenta: ["Protege tu cuenta con una capa extra de seguridad", "Protect your account with an extra layer of security"],
  sesionDosFactores: ["Debes iniciar sesión para configurar la autenticación en dos pasos", "You must log in to set up two-step authentication"],
  autenticacionActivada: ["🔐 Autenticación en dos pasos activada", "🔐 Two-step authentication enabled"],
  autenticacionDesactivada: ["🔓 Autenticación en dos pasos desactivada", "🔓 Two-step authentication disabled"],
  cuentaProtegida: ["Tu cuenta está protegida con autenticación de dos factores. Necesitarás tu dispositivo móvil para iniciar sesión.", "Your account is protected with two-factor authentication. You will need your mobile device to log in."],
  activaAutenticacion: ["Activa la autenticación en dos pasos para mejorar la seguridad de tu cuenta.", "Enable two-step authentication to enhance your account security."],
  consejoSeguridad: ["💡 Consejo de seguridad", "💡 Security tip"],
  consejoSeguridadTexto: ["Usa una aplicación de autenticación como Google Authenticator o Authy para generar códigos seguros.", "Use an authentication app like Google Authenticator or Authy to generate secure codes."],
  mantenerAutenticacion: ["Mantén siempre acceso a tu aplicación de autenticación y guarda los códigos de respaldo en un lugar seguro.", "Always keep access to your authentication app and store backup codes in a safe place."],
  infAutenticacion: ["La autenticación de dos factores reduce significativamente el riesgo de acceso no autorizado a tu cuenta.", "Two-factor authentication significantly reduces the risk of unauthorized access to your account."],
  beneficiosAutenticacion: ["Beneficios de activar 2FA:", "Benefits of enabling 2FA:"],
  beneficios1: ["Protección contra accesos no autorizados.", "Protection against unauthorized access."],
  beneficios2: ["Seguridad adicional para tus datos personales.", "Additional security for your personal data."],
  beneficios3: ["Notificaciones de intentos de acceso sospechosos.", "Notifications of suspicious login attempts."],
  beneficios4: ["Compatible con aplicaciones como Google Authenticator", "Compatible with apps like Google Authenticator"],
  cuentaSegura: ["Tu cuenta esta protegida", "Your account is secure"],
  recuerdaGuardar: ["Recuerda guardar los códigos de respaldo en un lugar seguro y mantener acceso a tu aplicación de autenticación.", "Remember to save backup codes in a safe place and maintain access to your authentication app."],
  activar2FA: ["Activar 2FA", "Enable 2FA"],
  desactivar2FA: ["Desactivar 2FA", "Disable 2FA"],

  noTienesAcceso: ["No tienes acceso a esta acción. Por favor inicia sesión.", "You do not have access to this action. Please log in."],
  cambiarContraseña: ["Cambiar contraseña", "Change password"],
  actualizaContraseña: ["Actualiza tu contraseña regularmente para mantener tu cuenta segura", "Update your password regularly to keep your account secure"],
  enviandoSolicitud: ["Enviando solicitud...", "Sending request..."],
  procesandoSolicitud: ["Procesando solicitud...", "Processing request..."],

  verificaCodigo: ["Verifica tu codigo y crea una nueva contraseña", "Verify your code and create a new password"],
  codigoVerificacion: ["Código de verificación", "Verification code"],
  nuevaContraseña: ["Nueva contraseña", "New password"],
  ingresaNuevaContraseña: ["Ingresa tu nueva contraseña", "Enter your new password"],
  confirmarNuevaContraseña: ["Confirmar nueva contraseña", "Confirm new password"],
  confirmaNuevaContraseña: ["Confirma tu nueva contraseña", "Confirm your new password"],
  recuperarContraseña: ["Recuperar contraseña", "Recover password"],
  debesIngresarDigitos: ["Debes ingresar los 6 dígitos del código", "You must enter all 6 digits of the code"],
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
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
