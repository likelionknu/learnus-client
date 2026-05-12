import { useState } from "react";
import { FilesUploadLayout as EditorLayout } from "../components/markdown";

export default function FilesUploadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <EditorLayout
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
    />
  );
}
