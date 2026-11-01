import type { NextConfig } from 'next';
const config: NextConfig = { serverExternalPackages: ['@napi-rs/canvas'], poweredByHeader: false };
export default config;