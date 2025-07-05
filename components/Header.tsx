"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

export function Header() {
  const { isLoggedIn } = useAuth();
  const ptrt = encodeURIComponent(usePathname() || "/p/start");

  return (
    <header className="site-header">
      <p className="site-logo">
        <Link href="/p/start">It’s Me Magnus</Link>
      </p>
      <nav>
        <ul>
          <li>
            <Link href="/p/start">Start</Link>
          </li>
          <li>
            <Link href="/tags">All tags</Link>
          </li>
          <li>
            <Link href="/random">Random note</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <Link href="/sign-out">Sign out</Link>
            </li>
          ) : (
            <li>
              <Link href={`/sign-in?ptrt=${ptrt}`}>Sign in</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
