"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./NoteForm.module.css";
import { TagSelector } from "./TagSelector";
import { generateNoteId } from "@/lib/notes";
import { ImageSelector } from "./ImageSelector";
import { deleteImage, getImageFileName } from "@/lib/images";

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

  const [form, setForm] = useState<{
    title?: string | null;
    content?: string | null;
    image_url?: string | null;
    image_caption?: string | null;
    tags?: string[];
  }>(initialData || {});

  const [tags, setTags] = useState<string[]>(
    initialData?.tags || (defaultTagId ? [defaultTagId] : [])
  );
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageWasRemoved, setImageWasRemoved] = useState(false);
  const [imageWasAdded, setImageWasAdded] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null); // set via ImageSelector

  const [oldImageFilename, setOldImageFilename] = useState(
    initialData?.image_url ?? null
  );

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageWasRemoved(true);
      setImageWasAdded(false);
      setForm((prev) => ({ ...prev, image_url: null }));
    } else {
      setImageWasAdded(true);
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

    const noteAlreadyExists = !!noteId;
    let currentNoteId;
    let imageUrl;

    if (noteId) {
      currentNoteId = noteId;
    } else {
      currentNoteId = generateNoteId();
    }

    if (imageWasAdded) {
      imageUrl = getImageFileName(currentNoteId);
    } else if (imageWasRemoved) {
      imageUrl = null;
    }

    // 1. Insert or update the note

    if (noteAlreadyExists) {
      const { tags: _ignored, ...noteData } = form;

      noteData.image_url = imageUrl;

      console.log("Updating note with form data:", noteData);

      const { error } = await supabase
        .from("notes")
        .update(noteData)
        .eq("id", noteId);
      if (error) {
        console.error("Error updating note:", error);
        return;
      }
    } else {
      const newNote = {
        id: currentNoteId,
        image_url: imageUrl,
        ...form,
      };

      console.log("Inserting note with form data:", newNote);

      const { data, error } = await supabase
        .from("notes")
        .insert([newNote])
        .select()
        .single();

      if (error) {
        console.error("Error inserting note:", error);
        return;
      }
    }

    // 2. Sync tags in notes_tags
    if (currentNoteId) {
      if (noteAlreadyExists) {
        // Remove existing tags
        const { error: deleteError } = await supabase
          .from("notes_tags")
          .delete()
          .eq("note_id", currentNoteId);

        if (deleteError) {
          console.error("Error clearing existing tags:", deleteError);
          return;
        }
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

    // 3. Handle image updates

    if (imageWasRemoved && oldImageFilename) {
      deleteImage(oldImageFilename);
    }

    if (imageWasAdded) {
      if (currentNoteId) {
        const newImageFilename = getImageFileName(currentNoteId);
      }
    }

    // 4. Redirect
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
