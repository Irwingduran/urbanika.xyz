/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Configuración para Wagmi/Web3
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      }
    }

    // Ignorar warnings de módulos opcionales
    config.ignoreWarnings = [
      { module: /node_modules\/@react-native-async-storage/ },
      { module: /node_modules\/pino-pretty/ },
    ]

    // Externalizar módulos problemáticos en servidor
    if (isServer) {
      config.externals.push('pino-pretty', '@react-native-async-storage/async-storage')
    }

    return config
  },
}

export default nextConfig
