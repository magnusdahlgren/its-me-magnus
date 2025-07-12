import { useRef, useState } from "react";
import styles from "./ImageSelector.module.css";
import Image from "next/image";
import { getFullImageUrl } from "@/lib/images";

export function ImageSelector({
  initialImageUrl,
  onChange,
}: Readonly<{
  initialImageUrl: string;
  onChange: (file: File | null) => void;
}>) {
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const computedSrc = previewUrl.startsWith("blob:")
    ? previewUrl
    : getFullImageUrl(previewUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.imageSelector}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {!previewUrl ? (
        <button
          type="button"
          className={styles.addImageButton}
          onClick={triggerFileSelect}
        >
          Add image
        </button>
      ) : (
        <button
          type="button"
          className={styles.removeImageButton}
          onClick={handleRemoveImage}
        >
          <Image
            src={computedSrc}
            alt="Image preview"
            width={120}
            height={120}
            className={styles.imagePreview}
          />
          <div className={styles.trashOverlay} />
        </button>
      )}
    </div>
  );
}
