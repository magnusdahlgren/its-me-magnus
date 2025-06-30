import { getAllTags } from "@/lib/tags";
import Link from "next/link";

const tags = await getAllTags();

export default function TagsPage() {
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
    </article>
  );
}
