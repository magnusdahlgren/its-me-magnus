import { useState, useRef, useEffect } from "react";
import styles from "./NoteSettingsMenu.module.css";

export function NoteSettingsMenu({
  isLoading,
  onDelete,
}: {
  isLoading: boolean;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [useAsTag, setUseAsTag] = useState(false);
  const [sortIndex, setSortIndex] = useState("");

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
  }, []);

  const checkboxOptions = [
    {
      label: "Important",
      value: isImportant,
      setter: setIsImportant,
    },
    {
      label: "Use as tag",
      value: useAsTag,
      setter: setUseAsTag,
    },
    {
      label: "Private note",
      value: isPrivate,
      setter: setIsPrivate,
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
                key={opt.label}
                className={`${styles.menuRowBox} ${
                  index === 0 ? styles.menuRowBoxFirst : ""
                }`}
              >
                <span className={styles.labelText}>{opt.label}</span>
                <input
                  type="checkbox"
                  checked={opt.value}
                  onChange={() => opt.setter((v) => !v)}
                  className={styles.checkbox}
                />
              </label>
            ))}

            <label className={styles.menuRow}>
              <div className={styles.menuRowBox}>
                <span className={styles.labelText}>Sort index</span>
                <input
                  type="number"
                  value={sortIndex}
                  onChange={(e) => setSortIndex(e.target.value)}
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
