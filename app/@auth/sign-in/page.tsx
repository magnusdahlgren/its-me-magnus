"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { SignInForm } from "@/components/SignInForm";

export default function SignInModal() {
  const router = useRouter();

  return (
    <Modal>
      <SignInForm onSuccess={() => router.back()} />
    </Modal>
  );
}
