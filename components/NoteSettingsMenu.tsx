import { useRef, useEffect } from "react";
import styles from "./NoteSettingsMenu.module.css";
import type { FormType } from "@/types/note";

export function NoteSettingsMenu({
  isLoading,
  onDelete,
  form,
  setForm,
  isOpen,
  setIsOpen,
}: Readonly<{
  isLoading: boolean;
  onDelete: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className={styles.menuWrapper}>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.menuToggle} ${
          isOpen ? styles.menuToggleOpen : ""
        }`}
        aria-label="Toggle settings menu"
      />

      {isOpen && (
        <div ref={menuRef} className={styles.menu}>
          <div className={styles.menuGrid}>
            <div className={styles.menuRow}>
              <label htmlFor="is_important">Important</label>
              <input
                id="is_important"
                type="checkbox"
                checked={form.is_important}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    is_important: !prev.is_important,
                  }))
                }
                className={styles.checkbox}
              />
            </div>

            <div className={styles.menuRow}>
              <label htmlFor="use_as_tag">Use as tag</label>
              <input
                id="use_as_tag"
                type="checkbox"
                checked={form.use_as_tag}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    use_as_tag: !prev.use_as_tag,
                  }))
                }
                className={styles.checkbox}
              />
            </div>

            <div className={styles.menuRow}>
              <label htmlFor="is_private">Private note</label>
              <input
                id="is_private"
                type="checkbox"
                checked={form.is_private}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    is_private: !prev.is_private,
                  }))
                }
                className={styles.checkbox}
              />
            </div>

            <div className={styles.menuRow}>
              <label htmlFor="sort_index">Sort index</label>
              <input
                id="sort_index"
                type="number"
                value={form.sort_index ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sort_index:
                      e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                className={styles.sortInput}
              />
            </div>

            <div className={styles.menuRow}>
              <label htmlFor="order_tagged_by">Sort tagged by</label>
              <select
                id="order_tagged_by"
                className={styles.sortOption}
                value={form.order_tagged_by}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    order_tagged_by: e.target.value as
                      | "newest"
                      | "oldest"
                      | "index",
                  }))
                }
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="index">Index</option>
              </select>
            </div>

            <div className={styles.menuRow}>
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className={styles.deleteButton}
              >
                Delete note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
