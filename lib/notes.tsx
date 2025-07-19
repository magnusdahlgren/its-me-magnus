import { format } from "date-fns/format";
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
  // Remove keys with null or undefined values that should use DB defaults
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => {
      if (
        key === "sort_index" ||
        key === "created_at" ||
        key === "updated_at"
      ) {
        return value !== null && value !== undefined;
      }
      return true;
    })
  );

  const { error } = await supabase
    .from("notes")
    .insert([{ id: noteId, ...cleanedData }])
    .select()
    .single();

  if (error) {
    console.error("Error inserting note:", error);
    return error;
  }

  return null;
}

export function formatUkDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "d/M/yy");
}
