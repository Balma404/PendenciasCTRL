/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Gera build "standalone" para uma imagem Docker enxuta.
  output: "standalone",
};

module.exports = nextConfig;
