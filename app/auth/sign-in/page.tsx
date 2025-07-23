"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { SignInForm } from "@/components/SignInForm";
import modalStyles from "@/components/Modal.module.css";

export default function SignInModal() {
  const router = useRouter();

  return (
    <Modal className={modalStyles.modalWidthNarrow}>
      <SignInForm onSuccess={() => router.back()} />
    </Modal>
  );
}
