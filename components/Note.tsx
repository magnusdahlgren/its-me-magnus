import { Note } from "@/types/note";
import ReactMarkdown from "react-markdown";
import { renderTagsForNote } from "@/lib/tags";

interface Props {
  note: Note;
}

export async function NoteView({ note }: Readonly<Props>) {
  return (
    <article className="note">
      {note.title && <h1>{note.title}</h1>}

      {note.image_url && (
        <figure>
          <img src={note.image_url} alt={note.image_caption ?? ""} />
          {note.image_caption && <figcaption>{note.image_caption}</figcaption>}
        </figure>
      )}

      <ReactMarkdown>{note.content ?? ""}</ReactMarkdown>

      <footer>
        <p className="note--date">
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          }).format(new Date(note.created_at))}
        </p>
        {renderTagsForNote(note.id)}
      </footer>
    </article>
  );
}
