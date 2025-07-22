import { format } from "date-fns/format";
import { supabase } from "./supabase";
import { Note } from "@/types/note";

export function generateNoteId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export async function getNoteById(noteId: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("Error fetching note:", error);
    return null;
  }

  return data as Note;
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

  const payload = { id: noteId, ...cleanedData };

  try {
    const { error, status, statusText } = await supabase
      .from("notes")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("🛑 Error inserting note:");
      console.error("Status:", status, statusText);
      console.error("Error details:", error);
      console.error("Payload:", JSON.stringify(payload, null, 2));
      return error;
    }

    return null;
  } catch (err) {
    console.error("Unexpected exception during insert:", err);
    console.error("Payload:", JSON.stringify(payload, null, 2));
    return err;
  }
}

export function formatUkDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "d/M/yy");
}
