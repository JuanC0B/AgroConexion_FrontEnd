/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-agroconexion.ddns.net',
        port: '',
        pathname: '/media/**', // ajusta si tus imágenes siempre van en /media
      },
      {
        protocol: 'https',
        hostname: 'api-agroconexion-archivos.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
