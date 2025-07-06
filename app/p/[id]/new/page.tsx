"use client";

import { Modal } from "@/components/Modal";
import { NoteForm } from "@/components/NoteForm";
import { useParams } from "next/navigation";

export default function NewNoteModal() {
  const params = useParams();
  const tagId = typeof params.id === "string" ? params.id : undefined;

  return (
    <Modal>
      <NoteForm defaultTagId={tagId} />
    </Modal>
  );
}
