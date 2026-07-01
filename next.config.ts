import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Firefox and Safari refuse <video> playback when the server's declared
  // Content-Type doesn't match the file (some proxies serve .m4v as
  // application/octet-stream). Chrome/Edge sniff the bytes and play anyway,
  // which is why the transition videos only broke on Firefox/iOS Safari.
  async headers() {
    return [
      {
        source: "/transitions/:path*.m4v",
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
