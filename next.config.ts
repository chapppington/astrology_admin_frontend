import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    NEXT_PUBLIC_MODE: process.env.MODE,
    NEXT_PUBLIC_API_URL:
      process.env.MODE === "prod"
        ? "https://backend:8000/api"
        : "http://localhost:8000/api",
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;
