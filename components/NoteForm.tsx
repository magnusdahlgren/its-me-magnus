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
import { NoteSettingsMenu } from "./NoteSettingsMenu";
import type { FormType } from "@/types/note";

export function NoteForm({
  initialData,
  noteId,
  defaultTagId,
}: Readonly<{
  initialData?: Partial<FormType>;
  noteId?: string;
  defaultTagId?: string;
}>) {
  const router = useRouter();

  const [form, setForm] = useState<FormType>({
    title: initialData?.title ?? null,
    content: initialData?.content ?? null,
    image_url: initialData?.image_url ?? null,
    is_important: initialData?.is_important ?? false,
    is_private: initialData?.is_private ?? false,
    use_as_tag: initialData?.use_as_tag ?? false,
    sort_index: initialData?.sort_index ?? null,
    tags: initialData?.tags ?? [],
    updated_at: initialData?.updated_at ?? null,
  });

  const [tags, setTags] = useState<string[]>(
    initialData?.tags || (defaultTagId ? [defaultTagId] : [])
  );
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageWasRemoved, setImageWasRemoved] = useState(false);
  const [imageWasAdded, setImageWasAdded] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null); // set via ImageSelector
  const [settingsOpen, setSettingsOpen] = useState(false);
  const oldImageFilename = initialData?.image_url;
  const [significantUpdate, setSignificantUpdate] = useState(false);

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

  function buildNoteData(form: FormType, imageUrl: string | null) {
    const { tags: _ignored, ...noteData } = form;
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

    // If it's a significant update, include updated_at
    const finalData = { ...noteData };

    if (noteAlreadyExists) {
      if (significantUpdate) {
        finalData.updated_at = new Date().toISOString();
      } else {
        delete finalData.updated_at;
      }
    }

    // 2. Insert or update note in db
    if (noteAlreadyExists) {
      await updateNote(currentNoteId, finalData);
    } else {
      await insertNote(currentNoteId, finalData);
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
        <NoteSettingsMenu
          isLoading={isLoading}
          onDelete={handleDelete}
          form={form}
          setForm={setForm}
          isOpen={settingsOpen}
          setIsOpen={setSettingsOpen}
        />
        {noteId && (
          <label className={styles.significantUpdateLabel}>
            <input
              type="checkbox"
              checked={significantUpdate}
              onChange={(e) => setSignificantUpdate(e.target.checked)}
              className={styles.significantUpdateCheckbox}
            />
            <span>Significant update</span>
          </label>
        )}
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
