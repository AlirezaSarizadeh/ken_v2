import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "new.bartehpub.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "bazeh.com",
      },
      {
        protocol: "https",
        hostname: "www.transparenttextures.com",
      },
      {
        protocol: "https",
        hostname: "api.kaizenryu.org",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
