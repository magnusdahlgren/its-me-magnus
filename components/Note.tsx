import { Note } from "@/types/note";
import ReactMarkdown from "react-markdown";
import { renderTagsForNote } from "@/lib/tags";
import { EditNoteLink } from "./EditNoteLink";
import Link from "next/link";

interface Props {
  note: Note;
}

export async function NoteView({ note }: Readonly<Props>) {
  const isShort = !note.title && (note.content ?? "").length < 200;

  return (
    <article className={`note ${isShort ? "note--short" : ""}`}>
      {note.title && <h1>{note.title}</h1>}

      {note.image_url && (
        <figure>
          <img src={note.image_url} alt={note.image_caption ?? ""} />
          {note.image_caption && <figcaption>{note.image_caption}</figcaption>}
        </figure>
      )}

      <ReactMarkdown>{note.content ?? ""}</ReactMarkdown>

      {/* Show "Read more" if the note is a tag */}
      {note.is_tag && (
        <p className="note--read-more">
          <Link href={`/p/${note.id}`}>Read more</Link>
        </p>
      )}

      <footer className="note--footer">
        <p className="note--date">
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          }).format(new Date(note.created_at))}
        </p>
        {await renderTagsForNote(note.id)}
        <EditNoteLink noteId={note.id} />
      </footer>
    </article>
  );
}
