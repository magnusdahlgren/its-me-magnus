"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./NoteForm.module.css";
import { TagSelector } from "./TagSelector";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (noteId) {
      await supabase.from("notes").update(form).eq("id", noteId);
    } else {
      const { data } = await supabase
        .from("notes")
        .insert([form])
        .select()
        .single();
      if (data?.id) {
        router.push(`/p/${data.id}`);
        return;
      }
    }

    router.refresh();
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button
          type="button"
          className={styles.modalClose}
          aria-label="Close"
          onClick={() => router.back()}
        />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.modalBody}>
            <input
              type="text"
              name="title"
              className={styles.titleInput}
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Note title"
            />
            <textarea
              ref={textareaRef}
              name="content"
              className={styles.contentInput}
              rows={0}
              value={form.content || ""}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Note content"
            />
            <TagSelector selectedTags={tags} setSelectedTags={setTags} />
          </div>

          <div className={styles.modalFooter}>
            {noteId ? (
              <button type="submit" className={styles.deleteButton}>
                Delete Note
              </button>
            ) : null}
            <button type="submit" className={styles.saveButton}>
              {noteId ? "Save Updates" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
