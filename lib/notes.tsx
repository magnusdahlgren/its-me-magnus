export function generateNoteId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
