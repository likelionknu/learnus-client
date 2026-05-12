import { markdownComponents } from "@/admin/domains/session/components/markdown";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecificFile } from "../apis";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const REMARK_PLUGINS = [remarkGfm];
const CODE_BLOCK_REGEX = /```[\s\S]*?```|`[^`\n]+`/;

function UserSessionFilesViewPage() {
  const { fileId: fileIdParam } = useParams();
  const fileId = fileIdParam ? Number(fileIdParam) : null;
  const isValidFileId = fileId !== null && !Number.isNaN(fileId) && fileId > 0;

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasCode = useMemo(() => CODE_BLOCK_REGEX.test(content), [content]);
  const rehypePlugins = useMemo(
    () => (hasCode ? [rehypeHighlight] : []),
    [hasCode],
  );

  useEffect(() => {
    if (!isValidFileId || fileId === null) {
      setError("유효하지 않은 세션 자료입니다.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSpecificFile({ fileId });
        setName(data.name);
        setContent(data.content);
      } catch (e) {
        console.error("API 호출 에러:", e);
        setError("세션 자료를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fileId, isValidFileId]);

  if (isLoading) {
    return <div className="px-4 py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="px-4 py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="prose bg-ec-white mt-30 w-full max-w-251.5 px-12 py-12 md:pt-7 xl:mt-0">
      <div className="text-ec-black text-title font-semibold md:text-3xl">
        {name}
      </div>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={rehypePlugins}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default UserSessionFilesViewPage;
