import { forwardRef } from "react";
import MarkdownRenderer from "./MarkdownRender";

interface Props {
  content: string;
  onScroll?: () => void;
}

const MarkdownPreview = forwardRef<HTMLDivElement, Props>(function MarkdownPreview(
  { content, onScroll },
  ref
) {
  return (
    <div className="w-full h-216.75 bg-ec-white border border-ec-blue rounded-ec-10 flex flex-col">
      <div className="h-7 border-b border-ec-blue px-5 flex items-center text-xs text-ec-blue">
        미리보기
      </div>
      <div
        ref={ref}
        className="flex-1 p-5 overflow-auto"
        onScroll={onScroll} 
      >
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-ec-blue">
            미리볼 수 있는 내용이 입력되지 않음
          </div>
        )}
      </div>
    </div>
  );
});

export default MarkdownPreview;
