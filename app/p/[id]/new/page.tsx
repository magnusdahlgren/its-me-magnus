"use client";

import { NoteForm } from "@/components/NoteForm";
import styles from "@/components/NoteForm.module.css";
import { useParams } from "next/navigation";

export default function NewNoteModal() {
  const params = useParams();
  const tagId = typeof params.id === "string" ? params.id : undefined;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <NoteForm defaultTagId={tagId} />
      </div>
    </div>
  );
}
