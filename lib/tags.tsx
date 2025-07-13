import { supabase } from "@/lib/supabase";
import { Tag } from "@/types/tag";
import { Note } from "@/types/note";
import { JSX } from "react";
import Link from "next/link";

export async function getTagsForNote(noteId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("notes_tags")
    .select("tag:tag_id(id, title, is_important)")
    .eq("note_id", noteId);

  if (error || !data) return [];

  return (data as any[]).map((entry) => ({
    ...(entry.tag as Omit<Tag, "notesCount">),
    notesCount: 0,
  }));
}

export async function getNotesForTag(tagId: string): Promise<Note[]> {
  if (tagId === "_untagged") {
    const { data, error } = await supabase.from("untagged_notes").select("*");

    if (error || !data) return [];
    return data as Note[];
  }

  // Fetch notes with their tags where tag_id matches
  const { data, error } = await supabase
    .from("notes_with_tags")
    .select("*")
    .eq("tag_id", tagId);

  if (error || !data) return [];

  // Group rows by note_id
  const notesById = new Map<string, Note>();

  for (const row of data) {
    if (!notesById.has(row.note_id)) {
      notesById.set(row.note_id, {
        id: row.note_id,
        title: row.note_title,
        content: row.note_content,
        image_url: row.image_url,
        has_children: row.has_children,
        is_important: row.is_important,
        is_private: row.is_private,
        use_as_tag: row.use_as_tag,
        sort_index: row.sort_index,
        created_at: row.created_at,
        updated_at: row.updated_at,
        tags: [],
      });
    }

    if (row.tag_id) {
      const tag: Tag = {
        id: row.tag_id,
        title: row.tag_title,
        isImportant: row.tag_is_important,
        notesCount: -1, // not needed here
      };
      notesById.get(row.note_id)?.tags.push(tag);
    }
  }

  return Array.from(notesById.values());
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

export async function deleteTagsForNote(noteId: string) {
  // Remove tags associated with this note
  await supabase.from("notes_tags").delete().eq("note_id", noteId);

  // Remove this tag from other notes
  await supabase.from("notes_tags").delete().eq("tag_id", noteId);
}

export async function updateTagsForNote(noteId: string, tags: string[]) {
  // 1. Remove existing tags
  const { error: deleteError } = await supabase
    .from("notes_tags")
    .delete()
    .eq("note_id", noteId);

  if (deleteError) {
    console.error("Error clearing existing tags:", deleteError);
    return;
  }

  // 2. Add new tags
  if (tags.length > 0) {
    const tagsToAdd = tags.map((tagId) => ({
      note_id: noteId,
      tag_id: tagId,
    }));

    const { error: insertError } = await supabase
      .from("notes_tags")
      .insert(tagsToAdd);

    if (insertError) {
      console.error("Error inserting tags:", insertError);
      return;
    }
  }
}
