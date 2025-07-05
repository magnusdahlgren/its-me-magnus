import { useEffect, useState } from "react";
import styles from "./TagSelector.module.css";
import { supabase } from "@/lib/supabase";

type Tag = {
  id: string;
  title: string;
};

export function TagSelector({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}) {
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    async function fetchTags() {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title")
        .not("title", "is", null)
        .order("title", { ascending: true });

      if (error) {
        console.error("Error fetching tags:", error);
      } else {
        setAllTags(data || []);
      }
    }

    fetchTags();
  }, []);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const tagId = e.target.value;
    if (tagId && !selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
    e.target.value = ""; // reset dropdown
  }

  function handleRemove(tagId: string) {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  }

  return (
    <div className={styles.tagSelector}>
      <ul className={styles.tagList}>
        {selectedTags.map((tagId) => {
          const tag = allTags.find((t) => t.id === tagId);
          return (
            <li key={tagId}>
              {tag?.title}
              <button
                type="button"
                onClick={() => handleRemove(tagId)}
                aria-label={`Remove ${tag?.title}`}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
      <label>
        <span>Tags:</span>
        <select onChange={handleSelect}>
          <option value="">-- Select a tag --</option>
          {allTags
            .filter((tag) => !selectedTags.includes(tag.id))
            .map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.title}
              </option>
            ))}
        </select>
      </label>
    </div>
  );
}
