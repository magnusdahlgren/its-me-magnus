"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./SignInForm.module.css"; // Assuming you have a CSS file for styling
import { useRouter } from "next/navigation";

export function SignInForm({
  onSuccess,
}: Readonly<{
  onSuccess?: () => void;
}>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.refresh();
      onSuccess?.(); // Close modal
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.signInForm}>
      <h2>Sign In</h2>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <label>
        <span>Email:</span>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        <span>Password:</span>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
