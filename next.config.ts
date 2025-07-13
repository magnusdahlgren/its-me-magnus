import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const nextConfig: NextConfig = {
  images: {
    domains: ["oaefxsopmhkbbxgiaecc.supabase.co"],
  },
};

export default nextConfig;
