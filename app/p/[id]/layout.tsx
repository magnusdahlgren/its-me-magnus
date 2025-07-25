export default function NoteLayout({
  children,
  ["@modal"]: modal,
}: {
  children: React.ReactNode;
  ["@modal"]: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
