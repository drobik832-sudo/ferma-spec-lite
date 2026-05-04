/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
