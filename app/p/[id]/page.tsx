import { supabase } from "@/lib/supabase";
import { NoteView } from "@/components/Note";
import { getNotesForTag } from "@/lib/tags";
import { Note } from "@/types/note";

export default async function NotePage({ params }: { params: { id: string } }) {
  let note: Note | null = null;
  let notesToShow: Note[] = [];

  if (params.id === "_untagged") {
    notesToShow = await getNotesForTag("_untagged");
  } else {
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
  }

  notesToShow = await getNotesForTag(params.id);

  return (
    <div>
      {note && <NoteView note={note} />}
      {notesToShow?.map((note) => (
        <NoteView key={note.id} note={note} />
      ))}
    </div>
  );
}
