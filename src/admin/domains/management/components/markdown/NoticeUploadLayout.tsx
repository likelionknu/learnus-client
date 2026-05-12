import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Button, Input } from "@/shared/components";
import { useScrollSync } from "@/admin/domains/session/hooks";
import {
  MarkdownEditor,
  MarkdownPreview,
} from "@/admin/domains/session/components/markdown";
import { Modal, ErrorModal } from "@/shared/components/modal";
import { useNavigate } from "react-router-dom";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { getPresignedUrl } from "@/admin/domains/session/api";
import { uploadNotice } from "../../apis";

interface Props {
  title: string;
  content: string;
  setTitle: (v: string) => void;
  setContent: Dispatch<SetStateAction<string>>;
}

export default function EditorLayout({
  title,
  content,
  setTitle,
  setContent,
}: Props) {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  useScrollSync(editorRef, previewRef);
  const [modalType, setModalType] = useState<
    | "noticeConfirm"
    | "noticeSuccess"
    | "inputGuide"
    | "fileGuide"
    | "uploadError"
    | null
  >(null);

  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      const res = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
      });
      const { uploadUrl, fileUrl } = res.data.data;
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error("Presigned URL upload failed");
      }
      setContent((prev) => `${prev}\n![image](${fileUrl})\n`);
    } catch (error) {
      setErrors(getCommonErrorState(error));
      setModalType("uploadError");
      throw error;
    }
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || trimmedTitle.length > 80) {
      setModalType("inputGuide");
      return;
    }

    try {
      setLoading(true);
      setErrors(null);

      await uploadNotice(trimmedTitle, content);

      setModalType("noticeSuccess");
    } catch (error) {
      setErrors(getCommonErrorState(error));
      setModalType("uploadError");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-30 px-5 pt-5 md:pt-7 xl:mt-0">
      <div className="mb-8 flex items-center justify-between">
        <div className="w-228.5">
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Button
          size="primary"
          onClick={() => setModalType("noticeConfirm")}
          disabled={loading}
        >
          {loading ? "추가 중..." : "추가"}
        </Button>
      </div>

      <div className="flex gap-1">
        <div className="w-125.25">
          <MarkdownEditor
            ref={editorRef}
            content={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
          />
        </div>
        <div className="w-125.25">
          <MarkdownPreview ref={previewRef} content={content} />
        </div>
      </div>
      {modalType === "noticeConfirm" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            새로운 공지사항 등록
          </Modal.Header>
          <Modal.Description>
            해당 내용을 공지사항으로 업로드할까요? <br />
            모든 사용자에게 알림이 발송돼요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" onClick={handleSubmit} disabled={loading}>
              확인
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "noticeSuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            새로운 공지사항 등록
          </Modal.Header>
          <Modal.Description>공지사항을 업로드했어요</Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              onClick={() => {
                setModalType(null);
                navigate("/admin/notices");
              }}
            >
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "inputGuide" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            입력 형식 안내
          </Modal.Header>
          <Modal.Description>
            공지사항의 제목은 최대 80자까지 입력할 수 있어요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" onClick={() => setModalType(null)}>
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => {
            setErrors(null);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}
