"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { SignOutButton } from "./SignOutButton";

export function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="site-header">
      <p className="site-logo">
        <Link href="/p/start" aria-label="MXGNS homepage">
          Mxgns
        </Link>
      </p>
      <nav>
        <ul>
          <li>
            <Link href="/p/start">Start</Link>
          </li>
          <li>
            <Link href="/tags">Tags</Link>
          </li>
          <li>
            <Link href="/random">Random</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <SignOutButton />
            </li>
          ) : (
            <li>
              <Link href="/auth/sign-in" scroll={false}>
                Sign in
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
