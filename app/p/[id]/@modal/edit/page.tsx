"use client";
import { useEffect, useState } from "react";
import { NoteForm } from "@/components/NoteForm";
import { getTagsForNote } from "@/lib/tags";
import modalStyles from "@/components/Modal.module.css";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import type { FormType } from "@/types/note";
import { getNoteById } from "@/lib/notes";

export default function EditNoteModal() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<FormType | null>(null);
  let content: React.ReactNode;

  if (error) {
    content = (
      <div>
        <h3>Error</h3>
        <p>{error}</p>
        <Link href="/p/start">Go back</Link>
      </div>
    );
  } else if (!id) {
    content = (
      <div>
        <h3>Invalid ID</h3>
        <p>Invalid Note ID</p>
        <Link href="/p/start">Go back</Link>
      </div>
    );
  } else if (!initialData) {
    content = <p>Loading…</p>;
  } else {
    content = (
      <NoteForm
        noteId={id}
        initialData={initialData}
        onSuccess={() => router.back()}
      />
    );
  }

  useEffect(() => {
    if (!id) return;

    const safeId = id as string;

    async function fetchNoteAndTags() {
      const note = await getNoteById(safeId);

      if (!note) {
        setError("Note not found");
        return;
      }

      const tags = await getTagsForNote(safeId);
      const tagIds = tags.map((tag) => tag.id);

      setInitialData({
        title: note.title,
        content: note.content,
        image_url: note.image_url,
        is_important: note.is_important,
        is_private: note.is_private,
        use_as_tag: note.use_as_tag,
        order_tagged_by: note.order_tagged_by ?? "oldest",
        sort_index: note.sort_index,
        updated_at: note.updated_at,
        tags: tagIds,
      });
    }

    fetchNoteAndTags();
  }, [id]);

  return <Modal className={modalStyles.modalWidthWide}>{content}</Modal>;
}
