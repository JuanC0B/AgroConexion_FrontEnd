// Rutas para peticiones
export const AUTH_ENDPOINTS = {
  LOGIN: '/users/login/',
  REGISTER: '/users/register/',
  REFRESH: '/token/refresh/',
  LOGOUT: '/users/logout/',
  MYINFO: '/users/my-info/'
} as const;

// Rutas de navegacion
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGIN2FA: '/login/2fa',

  VERIFYACCOUTN: '/verify-account',

  REGISTER: '/register',
  REGISTERAGROUP: '/register/agroup',

  PRODUCTOS: '/products',
  CARRITO: '/cart',
  COUPOND: '/products/Offert_And_Coupon/List-coupons',
  NEWPRODUCT: '/products/new',
  FACTURACION: '/invoices',
  ESTADISTICAS: '/finansas',
  PERFIL: '/profile',
  EDITINFO:'/profile/edit-info',
  FAVORITOS: '/favorites',
  MYPRODUCTS: '/profile/Products',
  FAVORITECATEGORIES: '/favorites/categories',

  CHANGUEPASSWORD: '/password/changue-my-password',
  LOSTPASSWORD: '/password/lost-my-password',
  RECOREVYPASSWORD: '/password/lost-my-password/recover-my-password'
} as const;