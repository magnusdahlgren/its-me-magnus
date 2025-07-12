import { supabase } from "./supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;

export function getFullImageUrl(filename: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${filename}`;
}

export function getImageFileName(post_id: string): string {
  return post_id + "_1.jpg";
}

export async function deleteImage(
  filename: string
): Promise<{ success: boolean; error?: string }> {
  const { error: removeError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .remove([filename]);

  if (removeError) {
    console.error(
      "Error when deleting image from bucket:",
      removeError.message
    );
    return { success: false, error: removeError.message };
  }
  return { success: true };
}

export async function uploadImage(
  file: File,
  filename: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading image:", error.message);
    return { success: false, error: error.message };
  }
  console.log("Image upload done!");
  return { success: true };
}
