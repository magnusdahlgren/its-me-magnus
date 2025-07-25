import { getAllTags } from "@/lib/tags";
import Link from "next/link";

export const revalidate = 60;

export default async function TagsPage() {
  const importantTags = await getAllTags(true);
  const otherTags = await getAllTags(false);
  return (
    <main>
      <article>
        <h1>Browse notes by tags</h1>
        <h3>Main tags</h3>
        <ul className="important_tags">
          {importantTags.map((tag) => (
            <li key={tag.id}>
              <Link href={`/p/${tag.id}`}>{tag.title || tag.id}</Link>{" "}
              <span>({tag.notesCount + 1})</span>
            </li>
          ))}
        </ul>
        <h3>Other tags</h3>
        <ul>
          {otherTags.map((tag) => (
            <li key={tag.id}>
              <Link href={`/p/${tag.id}`}>{tag.title || tag.id}</Link>{" "}
              <span>({tag.notesCount + 1})</span>
            </li>
          ))}
        </ul>
        <h3>Notes without tags</h3>
        <ul>
          <li>
            <Link href={`/p/_untagged`}>Untagged</Link>
          </li>
        </ul>
      </article>
    </main>
  );
}
