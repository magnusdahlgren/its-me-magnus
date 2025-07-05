"use client";

import { useRouter, useParams } from "next/navigation";
import { NoteForm } from "@/components/NoteForm";
import styles from "@/components/NoteForm.module.css";

export default function NewNoteModal() {
  const router = useRouter();
  const params = useParams();
  const tagId = typeof params.id === "string" ? params.id : undefined;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <NoteForm defaultTagId={tagId} />
      </div>
    </div>
  );
}
