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
