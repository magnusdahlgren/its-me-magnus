"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./NoteForm.module.css";
import { TagSelector } from "./TagSelector";
import { generateNoteId, updateNote, insertNote } from "@/lib/notes";
import { ImageSelector } from "./ImageSelector";
import { deleteImage, getImageFileName, uploadImage } from "@/lib/images";
import { deleteTagsForNote, updateTagsForNote } from "@/lib/tags";

export function NoteForm({
  initialData,
  noteId,
  defaultTagId,
}: Readonly<{
  initialData?: {
    title: string | null;
    content: string | null;
    image_url: string | null;
    image_caption: string | null;
    tags?: string[];
  };
  noteId?: string;
  defaultTagId?: string;
}>) {
  const router = useRouter();

  const [form, setForm] = useState<{
    title: string | null;
    content: string | null;
    image_url: string | null;
    image_caption: string | null;
    tags?: string[];
  }>({
    title: initialData?.title ?? null,
    content: initialData?.content ?? null,
    image_url: initialData?.image_url ?? null,
    image_caption: initialData?.image_caption ?? null,
    tags: initialData?.tags ?? [],
  });

  const [tags, setTags] = useState<string[]>(
    initialData?.tags || (defaultTagId ? [defaultTagId] : [])
  );
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageWasRemoved, setImageWasRemoved] = useState(false);
  const [imageWasAdded, setImageWasAdded] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null); // set via ImageSelector
  const oldImageFilename = initialData?.image_url;

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageWasRemoved(true);
      setImageWasAdded(false);
      setNewImageFile(null);
      setForm((prev) => ({ ...prev, image_url: null }));
    } else {
      setImageWasAdded(true);
      setNewImageFile(file);
    }
  };

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
    await deleteTagsForNote(noteId);

    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) {
      console.error("Error deleting note:", error.message);
      return;
    }

    router.push("/p/start");
  }

  function buildNoteData(form: typeof initialData, imageUrl: string | null) {
    const { tags: _ignored, ...noteData } = form || {};
    return { ...noteData, image_url: imageUrl };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    // 1. Determine note id and image filename
    const noteAlreadyExists = !!noteId;
    const currentNoteId = noteAlreadyExists ? noteId : generateNoteId();
    let imageUrl: string | null;

    if (imageWasAdded) {
      imageUrl = `${getImageFileName(currentNoteId)}?t=${Date.now()}`; // bust cache
    } else if (imageWasRemoved) {
      imageUrl = null;
    } else {
      imageUrl = form.image_url;
    }
    const noteData = buildNoteData(form, imageUrl);

    // 2. Insert or update note in db
    if (noteAlreadyExists) {
      await updateNote(currentNoteId, noteData);
    } else {
      await insertNote(currentNoteId, noteData);
    }

    // 3. Update tags
    await updateTagsForNote(currentNoteId, tags);

    // 4. Image clean up and upload
    if (imageWasRemoved && oldImageFilename) {
      deleteImage(oldImageFilename);
    }

    if (imageWasAdded && newImageFile && imageUrl) {
      await uploadImage(newImageFile, imageUrl);
    }

    // 5. Redirect
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

        <ImageSelector
          onChange={handleImageChange}
          initialImageUrl={form.image_url ?? ""}
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
