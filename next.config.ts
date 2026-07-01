import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Some proxies don't map uncommon extensions to the right Content-Type,
  // which breaks <video> playback in browsers that enforce it strictly
  // (Firefox, Safari). .mp4 is mapped correctly almost everywhere, but this
  // stays as a safe, explicit guarantee.
  async headers() {
    return [
      {
        source: "/transitions_mp4/:path*.mp4",
        headers: [
          { key: "Content-Type", value: "video/mp4" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
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
