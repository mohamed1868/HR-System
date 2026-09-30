import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/admin", destination: "/admin/dashboard", permanent: false },
      { source: "/user", destination: "/user/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
