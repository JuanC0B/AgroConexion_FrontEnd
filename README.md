# 🌱 AgroConexion FrontEnd  

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
</p>  

<p align="center">
  <img src="https://img.shields.io/github/license/JuanC0B/AgroConexion_FrontEnd?style=flat-square"/>
  <img src="https://img.shields.io/github/stars/JuanC0B/AgroConexion_FrontEnd?style=flat-square"/>
  <img src="https://img.shields.io/github/forks/JuanC0B/AgroConexion_FrontEnd?style=flat-square"/>
</p>  

<p align="center">
  <!-- Aquí puedes subir tu banner a /public/banner.png -->
  <img src="https://github.com/JuanC0B/AgroConexion_FrontEnd/blob/main/public/banner.png" alt="AgroConexion Banner"/>
</p>  

---

**AgroConexion FrontEnd** es la interfaz web de la plataforma **AgroConexion**, un proyecto diseñado para conectar **productores** y **consumidores** de productos agrícolas. Su objetivo es facilitar la **compra, venta y gestión** de productos en el sector agroalimentario de forma sencilla, segura y accesible.  

---

## ✨ Características principales  

- 🔐 **Autenticación de usuarios**: registro, login y recuperación de contraseña  
- 🛒 **Gestión de productos**: creación, edición, listado y ofertas  
- 🧾 **Carrito de compras y proceso de checkout**  
- 📂 **Visualización de categorías** y productos destacados  
- 💳 **Gestión de facturas y finanzas**  
- ⭐ **Sistema de favoritos y comentarios**  
- 🌍 **Soporte multilenguaje** y temas personalizables  

---

## 🛠️ Tecnologías utilizadas  

- ⚡ [Next.js](https://nextjs.org/)  
- ⚛️ [React](https://react.dev/)  
- 🎨 [Tailwind CSS](https://tailwindcss.com/)  
- 📝 [TypeScript](https://www.typescriptlang.org/)  
- 🔗 [Axios](https://axios-http.com/)  

---

## 📂 Estructura del proyecto  

AgroConexion_FrontEnd/
│── app/ # Páginas principales y rutas
│── components/ # Componentes reutilizables
│── context/ # Contextos globales (ej. idioma, auth)
│── features/ # Funcionalidades específicas (ej. autenticación)
│── lib/ # Configuración y utilidades
│── types/ # Definiciones de tipos TypeScript
│── public/ # Recursos estáticos (imágenes, íconos)


---

## 🚀 Instalación y ejecución  

1. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/JuanC0B/AgroConexion_FrontEnd.git
   cd AgroConexion_FrontEnd

2. **Instalar dependencias**

    npm install


3. **Iniciar el servidor de desarrollo**

    npm run dev


## 🔑 Variables de entorno

Crea un archivo .env.local en la raíz del proyecto con las siguientes variables:
```env
NEXT_PUBLIC_API_URL=https://api-agroconexion.ddns.net/api
NEXT_PUBLIC_MEDIA_URL=
NEXT_PUBLIC_WS_URL=wss://api-agroconexion.ddns.net/ws
```

- `NEXT_PUBLIC_API_URL`: URL base de la API principal.
- `NEXT_PUBLIC_MEDIA_URL`:
- `NEXT_PUBLIC_WS_URL`: URL para la conexión WebSocket.

Estas variables son necesarias para que la aplicación funcione correctamente en desarrollo y producción.