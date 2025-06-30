import { supabase } from "@/lib/supabase";
import { Tag } from "@/types/tag";
import { Note } from "@/types/note";
import { JSX } from "react";
import Link from "next/link";

export async function getTagsForNote(noteId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("notes_tags")
    .select("tag:tag_id(id, title)")
    .eq("note_id", noteId);

  if (error || !data) return [];

  return data.map((entry) => ({
    id: entry.tag.id,
    title: entry.tag.title,
    isImportant: null,
    notesCount: null,
  }));
}

export async function getNotesForTag(tagId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes_tags")
    .select("note:note_id(id, title, content, image_url, created_at)")
    .eq("tag_id", tagId);

  if (error || !data) return [];

  return data.map((entry) => entry.note);
}

export async function getAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tag_summaries")
    .select("tag_id, title, is_important, notes_count");

  if (error || !data) return [];

  return data.map((tag) => ({
    id: tag.tag_id,
    title: tag.title,
    isImportant: tag.is_important,
    notesCount: tag.notes_count,
  }));
}

export async function renderTagsForNote(
  noteId: string
): Promise<JSX.Element | null> {
  const tags = await getTagsForNote(noteId);

  if (tags.length === 0) return null;

  return (
    <p className="note--tags">
      {tags.flatMap((tag, i) => [
        <Link key={tag.id} href={`/p/${tag.id}`}>
          {tag.title || tag.id}
        </Link>,
        i < tags.length - 1 ? ", " : null,
      ])}
    </p>
  );
}
