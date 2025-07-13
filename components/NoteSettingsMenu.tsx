import { useState } from "react";
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

  const checkboxOptions = [
    {
      label: "Is important",
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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.menuToggle} ${
          isOpen ? styles.menuToggleOpen : ""
        }`}
      />

      {isOpen && (
        <div className={styles.menu}>
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
