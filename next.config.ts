import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/admin", destination: "/admin/dashboard", permanent: false },
      { source: "/user", destination: "/user/dashboard", permanent: false },
    ];
  },
};

export default createNextIntlPlugin()(nextConfig);
