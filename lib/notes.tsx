import { supabase } from "./supabase";

export function generateNoteId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export async function updateNote(noteId: string, data: Record<string, any>) {
  const { error } = await supabase.from("notes").update(data).eq("id", noteId);
  if (error) {
    console.error("Error updating note:", error);
    return error;
  }
  return null;
}

export async function insertNote(noteId: string, data: Record<string, any>) {
  const { error } = await supabase
    .from("notes")
    .insert([{ id: noteId, ...data }])
    .select()
    .single();

  if (error) {
    console.error("Error inserting note:", error);
    return error;
  }
  return null;
}
