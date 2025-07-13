import { useRef, useEffect } from "react";
import styles from "./NoteSettingsMenu.module.css";

type FormType = {
  title: string | null;
  content: string | null;
  image_url: string | null;
  is_important: boolean | null;
  is_private: boolean | null;
  use_as_tag: boolean | null;
  sort_index: number | null;
  tags?: string[];
};

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

  const checkboxOptions = [
    {
      label: "Important",
      key: "is_important" as const,
    },
    {
      label: "Use as tag",
      key: "use_as_tag" as const,
    },
    {
      label: "Private note",
      key: "is_private" as const,
    },
  ];

  return (
    <div className={styles.menuWrapper}>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.menuToggle} ${
          isOpen ? styles.menuToggleOpen : ""
        }`}
      />

      {isOpen && (
        <div ref={menuRef} className={styles.menu}>
          <div className={styles.menuGrid}>
            {checkboxOptions.map((opt, index) => (
              <label
                key={opt.key}
                className={`${styles.menuRowBox} ${
                  index === 0 ? styles.menuRowBoxFirst : ""
                }`}
              >
                <span className={styles.labelText}>{opt.label}</span>
                <input
                  type="checkbox"
                  checked={!!form[opt.key]}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      [opt.key]: !prev[opt.key],
                    }))
                  }
                  className={styles.checkbox}
                />
              </label>
            ))}

            <label className={styles.menuRow}>
              <div className={styles.menuRowBox}>
                <span className={styles.labelText}>Sort index</span>
                <input
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
            </label>

            <div className={`${styles.menuRowBox} ${styles.menuRowBoxLast}`}>
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
