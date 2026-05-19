/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? repo : '',
  assetPrefix: isProd ? repo : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: repo,
  },
};

export default nextConfig;
