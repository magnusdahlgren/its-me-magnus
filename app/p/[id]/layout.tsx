import type { ReactNode } from "react";

export default function NoteLayout({
  children,
  "@modal": modal,
}: {
  children: ReactNode;
  "@modal"?: ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
