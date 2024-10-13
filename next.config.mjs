

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  basePath: '/connect',
  assetPrefix: '/connect',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/connect/api/:path*',
      },
    ];
  },
});
