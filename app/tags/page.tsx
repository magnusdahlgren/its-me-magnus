import { getAllTags } from "@/lib/tags";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await getAllTags();
  return (
    <article>
      <h1>All Tags</h1>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link href={`/p/${tag.id}`}>{tag.title || tag.id}</Link>{" "}
            <span>({tag.notesCount})</span>
          </li>
        ))}
      </ul>{" "}
      <h3>Notes without tags</h3>
      <ul>
        <li>
          <Link href={`/p/_untagged`}>Untagged</Link>
        </li>
      </ul>
    </article>
  );
}
