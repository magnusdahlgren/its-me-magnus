export function getFullImageUrl(filename: string): string {
  return (
    "https://oaefxsopmhkbbxgiaecc.supabase.co/storage/v1/object/public/images-dev/" +
    filename
  );
}

export function getImageFileName(post_id: string): string {
  return post_id + "_1.jpg";
}
