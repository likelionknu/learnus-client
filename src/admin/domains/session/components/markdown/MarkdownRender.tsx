import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { markdownComponents } from "./MarkdownComponents";

interface Props {
  content: string;
}

const REMARK_PLUGINS = [remarkGfm];
const CODE_BLOCK_REGEX = /```[\s\S]*?```|`[^`\n]+`/;

function MarkdownRenderer({ content }: Props) {
  const hasCode = useMemo(() => CODE_BLOCK_REGEX.test(content), [content]);
  const rehypePlugins = useMemo(
    () => (hasCode ? [rehypeHighlight] : []),
    [hasCode],
  );

  return (
    <div className="prose max-w-none">
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

export default memo(MarkdownRenderer);
