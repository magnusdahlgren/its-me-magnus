import { supabase } from "@/lib/supabase";
import { NoteView } from "@/components/Note";
import { getNotesForTag } from "@/lib/tags";
import { AddNoteLink } from "@/components/AddNoteLink";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const { data: note } = await supabase
    .from("notes")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: (note?.title ?? "Note not found") + " - It's Me Magnus",
  };
}

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
      <AddNoteLink tagId={note.id} />
    </div>
  );
}
