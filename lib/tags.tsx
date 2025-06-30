import { supabase } from "@/lib/supabase";
import { Tag } from "@/types/tag";
import { Note } from "@/types/note";
import { JSX } from "react";

export async function getTagsForNote(noteId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("notes_tags")
    .select("tag:tag_id(id, title)")
    .eq("note_id", noteId);

  if (error || !data) return [];

  return data.map((entry) => ({
    id: entry.tag.id,
    title: entry.tag.title,
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
    link: `/p/${tag.id}`,
    isImportant: tag.is_important,
    notesCount: tag.notes_count,
  }));
}

export async function getTagUrl(tagId: string): Promise<string | null> {
  return `/p/tagId`;
}

export async function renderTagsForNote(
  noteId: string
): Promise<JSX.Element | null> {
  const tags = await getTagsForNote(noteId);

  if (tags.length === 0) return null;

  return (
    <p className="note--tags">
      {tags.flatMap((tag, i) => [
        <a key={tag.id} href={`/p/${tag.id}`}>
          {tag.title || tag.id}
        </a>,
        i < tags.length - 1 ? ", " : null,
      ])}
    </p>
  );
}
