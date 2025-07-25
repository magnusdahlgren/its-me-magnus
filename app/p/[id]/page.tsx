import { supabase } from "@/lib/supabase";
import { NoteView } from "@/components/Note";
import { getNotesForTag } from "@/lib/tags";
import { AddNoteLink } from "@/components/AddNoteLink";
import { Metadata } from "next";
import { getNoteById } from "@/lib/notes";

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
    title: (note?.title ?? "Note not found") + " - MXGNS",
  };
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const note = await getNoteById(id);

  if (!note)
    return (
      <div>
        <p>
          <strong>Note not found:</strong> {id}
        </p>
      </div>
    );

  const notesToShow = await getNotesForTag(note.id, note.order_tagged_by);

  return (
    <main>
      {note && <NoteView note={note} isLead={true} />}
      {notesToShow?.map((taggedNote) => (
        <NoteView
          key={taggedNote.id}
          note={taggedNote}
          tagIdToExclude={note.id}
        />
      ))}
      {note.use_as_tag && (
        <article>
          <AddNoteLink tagId={note.id} />
        </article>
      )}
    </main>
  );
}
