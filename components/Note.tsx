import { Note } from "@/types/note";
import ReactMarkdown from "react-markdown";
import { renderTagsForNote } from "@/lib/tags";
import { EditNoteLink } from "./EditNoteLink";
import Link from "next/link";
import { getFullImageUrl } from "@/lib/images";
import { formatUkDate } from "@/lib/notes";

interface Props {
  note: Note;
  isLead?: boolean; // If true, this note is the main one on the page
}

async function noteMetadata(note: Note) {
  return (
    <div className="note--metadata">
      <p className="note--date">
        {formatUkDate(note.created_at)}
        {note.updated_at && note.updated_at !== note.created_at && (
          <> (updated {formatUkDate(note.updated_at)})</>
        )}
      </p>
      {await renderTagsForNote(note.id)}
      <EditNoteLink noteId={note.id} />
    </div>
  );
}

export async function NoteView({ note, isLead = false }: Readonly<Props>) {
  const isShort =
    !note.title && !note.image_url && (note.content ?? "").length < 200;

  return (
    <article
      className={`note ${isShort ? "note--short" : ""} ${
        note.is_private ? "note--private" : ""
      } ${isLead ? "note--lead" : ""}`}
    >
      {note.title && (
        <h1 className="note--title">
          {isLead ? (
            note.title
          ) : (
            <Link href={`/p/${note.id}`}>{note.title}</Link>
          )}
        </h1>
      )}

      {note.image_url && <img src={getFullImageUrl(note.image_url)} alt="" />}

      {note.content && <ReactMarkdown>{note.content ?? ""}</ReactMarkdown>}

      {/* Show "Read more" if the note is a tag */}
      {note.has_children && (
        <p className="note--read-more">
          <Link href={`/p/${note.id}`}>Read more</Link>
        </p>
      )}
      {await noteMetadata(note)}
    </article>
  );
}
