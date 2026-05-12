import { forwardRef, useState } from "react";
import uploadIcon from "@admin/domains/session/assets/upload.png";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/components";

interface Props {
  content: string;
  onChange: (v: string) => void;
  onScroll?: () => void;
  onImageUpload?: (file: File) => Promise<void> | void;
}

const MarkdownEditor = forwardRef<HTMLTextAreaElement, Props>(
  function MarkdownEditor({ content, onChange, onScroll, onImageUpload }, ref) {
    const [isDragging, setIsDragging] = useState(false);
    const [modalType, setModalType] = useState<
      "ImageFile" | "ImageError" | null
    >(null);

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setModalType("ImageFile");
        return;
      }
      try {
        await onImageUpload?.(file);
      } catch (error) {
        console.error(error);
        setModalType("ImageError");
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    };

    return (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative flex h-216.75 w-full flex-col ${
          isDragging
            ? "border-ec-blue bg-ec-black/20 rounded-[60px] border-14 border-dashed"
            : "rounded-ec-10 border-ec-outline bg-ec-white border"
        }`}
      >
        {!isDragging && (
          <div className="border-ec-outline text-ec-sub flex h-7 items-center border-b px-5 text-xs">
            작성
          </div>
        )}

        <div className="relative flex flex-1 flex-col">
          <textarea
            ref={ref}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onScroll={onScroll}
            placeholder="내용을 마크다운 형식으로 입력하세요"
            className="h-full w-full resize-none overflow-auto bg-transparent p-5 text-[14px] leading-6 outline-none"
          />
          {isDragging && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <img
                    src={uploadIcon}
                    alt="Upload Icon"
                    className="h-20 w-16 object-contain"
                  />
                  <div className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-black/10 blur-sm" />
                </div>
                <div className="text-ec-blue text-center text-xl font-bold">
                  사진을 끌어넣어 업로드
                </div>
              </div>
            </div>
          )}
        </div>
        {modalType === "ImageFile" && (
          <Modal>
            <Modal.Header onClick={() => setModalType(null)}>
              파일 형식 안내
            </Modal.Header>
            <Modal.Description>
              사진 파일만 업로드할 수 있어요
            </Modal.Description>
            <Modal.ButtonLayout>
              <Button
                size="primary"
                variant="primary"
                onClick={() => setModalType(null)}
              >
                확인
              </Button>
            </Modal.ButtonLayout>
          </Modal>
        )}
        {modalType === "ImageError" && (
          <Modal>
            <Modal.Header onClick={() => setModalType(null)}>
              파일 업로드 실패
            </Modal.Header>
            <Modal.Description>
              일시적으로 파일을 업로드할 수 없어요
            </Modal.Description>
            <Modal.ButtonLayout>
              <Button
                size="primary"
                variant="primary"
                onClick={() => setModalType(null)}
              >
                확인
              </Button>
            </Modal.ButtonLayout>
          </Modal>
        )}
      </div>
    );
  },
);

export default MarkdownEditor;
