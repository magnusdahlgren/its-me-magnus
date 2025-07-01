import { supabase } from "@/lib/supabase";
import { NoteView } from "@/components/Note";
import { getNotesForTag } from "@/lib/tags";

export default async function NotePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (noteError)
    return (
      <div>
        <p>
          <strong>Note not found:</strong> {id}
        </p>
        <pre>{JSON.stringify(noteError, null, 2)}</pre>
      </div>
    );
  if (!note) return <div>Loading…</div>;

  const notesToShow = await getNotesForTag(note.id);

  return (
    <div>
      {note && <NoteView note={note} />}
      {notesToShow?.map((note) => (
        <NoteView key={note.id} note={note} />
      ))}
    </div>
  );
}
