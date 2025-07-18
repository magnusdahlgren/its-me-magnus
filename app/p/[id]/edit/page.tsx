"use client";

import { useEffect, useState } from "react";
import { NoteForm } from "@/components/NoteForm";
import { supabase } from "@/lib/supabase";
import { getTagsForNote } from "@/lib/tags";
import styles from "@/components/NoteForm.module.css";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Modal } from "@/components/Modal";

export default function EditNoteModal() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const [error, setError] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<null | {
    title: string | null;
    content: string | null;
    image_url: string | null;
    is_important: boolean | null;
    is_private: boolean | null;
    use_as_tag: boolean | null;
    sort_index: number | null;
    tags: string[];
  }>(null);

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
    content = <NoteForm noteId={id} initialData={initialData} />;
  }

  useEffect(() => {
    if (!id) return;

    const safeId = id as string;

    async function fetchNoteAndTags() {
      const { data: note, error: noteError } = await supabase
        .from("notes")
        .select(
          "id, title, content, image_url, is_important, is_private, use_as_tag, sort_index"
        )
        .eq("id", id)
        .single();

      if (noteError || !note) {
        console.error("Error fetching note:", noteError);
        setError("Failed to load note");
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
        sort_index: note.sort_index,
        tags: tagIds,
      });
    }

    fetchNoteAndTags();
  }, [id]);

  return (
    <Modal>
      <div className={styles.modalContent}>{content}</div>
    </Modal>
  );
}
