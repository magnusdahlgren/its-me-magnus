import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

export default async function NotePage({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error)
    return (
      <div>
        <p>
          <strong>Note not found:</strong> {params.id}
        </p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  if (!data) return <div>Loading…</div>;

  return (
    <article className="note">
      {data.title && <h1>{data.title}</h1>}
      {data.image_url && (
        <figure>
          <img src={"/" + data.image_url} alt={data.image_caption || ""} />
          {data.image_caption && <figcaption>{data.image_caption}</figcaption>}
        </figure>
      )}
      <ReactMarkdown>{data.content}</ReactMarkdown>
      <footer>
        <p className="note--date">
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          }).format(new Date(data.created_at))}
        </p>
      </footer>
    </article>
  );
}
