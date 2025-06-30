import { Note } from "@/types/note";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

interface Props {
  note: Note;
}

export async function NoteView({ note }: Readonly<Props>) {
  const { data: tagEntries } = await supabase
    .from("notes_tags")
    .select("tag:tag_id(id, title)")
    .eq("note_id", note.id);

  const tags = (tagEntries ?? []).map((entry) => entry.tag);

  return (
    <article className="note">
      {note.title && <h1>{note.title}</h1>}

      {note.image_url && (
        <figure>
          <img src={"/" + note.image_url} alt={note.image_caption || ""} />
          {note.image_caption && <figcaption>{note.image_caption}</figcaption>}
        </figure>
      )}

      <ReactMarkdown>{note.content}</ReactMarkdown>

      <footer>
        <p className="note--date">
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          }).format(new Date(note.created_at))}
        </p>
        {tags.length > 0 && (
          <p className="note--tags">
            {tags.map((tag, i) => (
              <span key={tag.id}>
                <a href={`/p/${tag.id}`}>{tag.title || tag.id}</a>
                {i < tags.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}
      </footer>
    </article>
  );
}
