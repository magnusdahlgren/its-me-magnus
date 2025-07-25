"use client";

import { Modal } from "@/components/Modal";
import { NoteForm } from "@/components/NoteForm";
import { useParams } from "next/navigation";
import { defaultFormData, FormType } from "@/types/note";
import modalStyles from "@/components/Modal.module.css";

export default function NewNoteModal() {
  const params = useParams();
  const tagId = typeof params.id === "string" ? params.id : undefined;

  const initialData: FormType = {
    ...defaultFormData,
    tags: tagId ? [tagId] : [],
  };

  return (
    <Modal className={modalStyles.modalWidthWide}>
      <NoteForm initialData={initialData} />
    </Modal>
  );
}
