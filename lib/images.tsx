import { supabase } from "./supabase";

export function getFullImageUrl(filename: string): string {
  return (
    "https://oaefxsopmhkbbxgiaecc.supabase.co/storage/v1/object/public/images-dev/" +
    filename
  );
}

export function getImageFileName(post_id: string): string {
  return post_id + "_1.jpg";
}

export async function deleteImage(filename: string) {
  console.log("Attempting to remove image:", filename);
  const { error: removeError } = await supabase.storage
    .from("images-dev")
    .remove([filename]);

  if (removeError) {
    console.log("Error when deleting image from bucket:", removeError.message);
  }
}

export async function uploadImage(
  file: File,
  filename: string,
  bucket = "images-dev"
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.storage.from(bucket).upload(filename, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
