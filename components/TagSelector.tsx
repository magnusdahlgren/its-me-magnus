import { useEffect, useRef, useState } from "react";
import styles from "./TagSelector.module.css";
import { supabase } from "@/lib/supabase";
import { Tag } from "@/types/tag";

export function TagSelector({
  selectedTags,
  setSelectedTags,
}: Readonly<{
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}>) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    async function fetchTags() {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, is_important")
        .not("title", "is", null)
        .eq("use_as_tag", true)
        .order("title", { ascending: true });

      if (error) {
        console.error("Error fetching tags:", error);
        setError("Failed to load tags");
      } else {
        const tags = (data ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          isImportant: row.is_important ?? false,
          notesCount: 0, // not available here, so we set a fallback
        }));

        setAllTags(tags);
      }
      setIsLoading(false);
    }

    fetchTags();
  }, []);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const tagId = e.target.value;
    if (tagId && !selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
    setShowDropdown(false); // Hide dropdown after selection
    e.target.value = ""; // Reset the select value
  }

  function handleRemove(tagId: string) {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading tags...</div>;
  }

  return (
    <div className={styles.tagSelector}>
      <ul className={styles.tagList}>
        {selectedTags.map((tagId) => {
          const tag = allTags.find((t) => t.id === tagId);
          return (
            <li key={tagId} className={styles.tagPill}>
              {tag?.title}
              <button
                type="button"
                onClick={() => handleRemove(tagId)}
                aria-label={`Remove ${tag?.title}`}
                className={styles.removeTagButton}
              >
                ×
              </button>
            </li>
          );
        })}
        <li>
          {!showDropdown && (
            <button
              type="button"
              onClick={() => setShowDropdown(true)}
              className={styles.addTagButton}
            >
              + Add tag
            </button>
          )}

          {showDropdown && (
            <select
              ref={selectRef}
              onChange={handleSelect}
              onBlur={() => setShowDropdown(false)}
              autoFocus
            >
              <option value="">-- Select a tag --</option>
              {allTags
                .filter((tag) => !selectedTags.includes(tag.id))
                .map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.title}
                  </option>
                ))}
            </select>
          )}
        </li>
      </ul>
    </div>
  );
}
