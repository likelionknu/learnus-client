import { useState } from "react"
import { NoticeUploadLayout } from "../components/markdown";

export default function NoticeUploadPage() {

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  return (
    <NoticeUploadLayout
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
    />
  )
}