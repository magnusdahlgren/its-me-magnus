import { supabase } from "@/lib/supabase";
import { NoteView } from "@/components/Note";
import { Note } from "@/types/note";

export default async function NotePage({ params }: { params: { id: string } }) {
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (noteError)
    return (
      <div>
        <p>
          <strong>Note not found:</strong> {params.id}
        </p>
        <pre>{JSON.stringify(noteError, null, 2)}</pre>
      </div>
    );
  if (!note) return <div>Loading…</div>;

  interface TaggedNote {
    note: Note;
  }

  const { data: taggedNotes, error: taggedNotesError } = await supabase
    .from("notes_tags")
    .select("note:note_id!inner(id, title, content, image_url, created_at)")
    .eq("tag_id", note.id);

  const notesToShow = (taggedNotes ?? []) as unknown as TaggedNote[];

  return (
    <div>
      <NoteView note={note} />
      {notesToShow?.map((entry: { note: Note }) => (
        <NoteView key={entry.note.id} note={entry.note} />
      ))}
    </div>
  );
}
