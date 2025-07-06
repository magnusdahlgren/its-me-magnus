"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./NoteForm.module.css";
import { TagSelector } from "./TagSelector";
import { generateNoteId } from "@/lib/notes";

export function NoteForm({
  initialData,
  noteId,
  defaultTagId,
}: Readonly<{
  initialData?: {
    title?: string;
    content?: string;
    image_url?: string;
    image_caption?: string;
    tags?: string[];
  };
  noteId?: string;
  defaultTagId?: string;
}>) {
  const router = useRouter();
  const [form, setForm] = useState(initialData || {});
  const [tags, setTags] = useState<string[]>(
    initialData?.tags || (defaultTagId ? [defaultTagId] : [])
  );
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      });
    }
  }, [form.content]);

  async function handleDelete() {
    if (!noteId) return;
    if (isLoading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    setIsLoading(true);
    await supabase.from("notes_tags").delete().eq("note_id", noteId); // Remove tags associated with this note
    await supabase.from("notes_tags").delete().eq("tag_id", noteId); // Remove this tag from other notes

    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) {
      console.error("Error deleting note:", error.message);
      return;
    }

    router.push("/p/start"); // or any fallback page
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    let currentNoteId = noteId;

    // 1. Insert or update the note
    if (noteId) {
      console.log("Updating note with form data:", form);

      const { tags: _ignored, ...noteData } = form;

      const { error } = await supabase
        .from("notes")
        .update(noteData)
        .eq("id", noteId);
      if (error) {
        console.error("Error updating note:", error);
        return;
      }
    } else {
      console.log("Inserting note with form data:", form);

      const newNoteId = generateNoteId();

      const newNote = {
        id: newNoteId,
        ...form,
      };

      const { data, error } = await supabase
        .from("notes")
        .insert([newNote])
        .select()
        .single();

      if (error) {
        console.error("Error inserting note:", error);
        return;
      }

      currentNoteId = data.id;
    }

    // 2. Sync tags in notes_tags
    if (currentNoteId) {
      // Remove existing tags
      const { error: deleteError } = await supabase
        .from("notes_tags")
        .delete()
        .eq("note_id", currentNoteId);

      if (deleteError) {
        console.error("Error clearing existing tags:", deleteError);
        return;
      }

      // Insert new tags
      const tagInserts = tags.map((tagId) => ({
        note_id: currentNoteId,
        tag_id: tagId,
      }));

      if (tagInserts.length > 0) {
        const { error: insertError } = await supabase
          .from("notes_tags")
          .insert(tagInserts);

        if (insertError) {
          console.error("Error inserting tags:", insertError);
          return;
        }
      }
    }

    // 3. Redirect
    router.push(`/p/${currentNoteId}`);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.modalBody}>
        <input
          type="text"
          name="title"
          className={styles.titleInput}
          value={form.title ?? ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Note title"
        />
        <textarea
          ref={textareaRef}
          name="content"
          className={styles.contentInput}
          rows={0}
          value={form.content ?? ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Note content"
        />
        <TagSelector selectedTags={tags} setSelectedTags={setTags} />
      </div>

      <div className={styles.modalFooter}>
        {noteId ? (
          <button
            type="button"
            className={styles.deleteButton}
            disabled={isLoading}
            onClick={handleDelete}
          >
            Delete Note
          </button>
        ) : null}
        <button
          type="submit"
          className={styles.saveButton}
          disabled={isLoading}
        >
          {noteId ? "Save Updates" : "Create Note"}
        </button>
      </div>
    </form>
  );
}
