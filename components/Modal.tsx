"use client";

import { useRouter } from "next/navigation";
import styles from "./Modal.module.css";

export function Modal({
  children,
  onClose,
  className,
}: Readonly<{
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}>) {
  const router = useRouter();

  const handleClose = () => {
    onClose?.() ?? router.back();
  };

  return (
    <dialog className={styles.modalBackdrop}>
      <div className={`${styles.modalContent} ${className}`}>
        <button
          type="button"
          className={styles.modalClose}
          aria-label="Close"
          onClick={handleClose}
        />
        {children}
      </div>
    </dialog>
  );
}
