/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  // Только для production сборки (GitHub Pages/Netlify)
  output: isDev ? undefined : 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Для GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ferma-spec-lite' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/ferma-spec-lite' : '',
  // Для Netlify
  distDir: 'out',
}

module.exports = nextConfig
