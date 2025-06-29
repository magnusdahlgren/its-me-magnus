import { supabase } from "@/lib/supabase";

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
    <article>
      {data.title && <h1>{data.title}</h1>}
      {data.image_url && (
        <img src={data[0].image_url} alt={data.image_caption || ""} />
      )}
      {data.content}
    </article>
  );
}
