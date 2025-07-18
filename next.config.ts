import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const nextConfig: NextConfig = {
  images: {
    domains: [new URL(SUPABASE_URL).hostname],
  },
};
