import { useEffect } from "react"

export function useScrollSync(
  editorRef: React.RefObject<HTMLTextAreaElement | null>,
  previewRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const editor = editorRef.current
    const preview = previewRef.current
    if (!editor || !preview) return
    let isSyncing = false
    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      if (isSyncing) return
      isSyncing = true
      const ratio =
        source.scrollTop /
        (source.scrollHeight - source.clientHeight)
      target.scrollTop =
        ratio * (target.scrollHeight - target.clientHeight)
      requestAnimationFrame(() => {
        isSyncing = false
      })
    }
    const handleEditorScroll = () => {
      syncScroll(editor, preview)
    }
    const handlePreviewScroll = () => {
      syncScroll(preview, editor)
    }
    editor.addEventListener("scroll", handleEditorScroll)
    preview.addEventListener("scroll", handlePreviewScroll)
    return () => {
      editor.removeEventListener("scroll", handleEditorScroll)
      preview.removeEventListener("scroll", handlePreviewScroll)
    }
  }, [editorRef, previewRef])
}