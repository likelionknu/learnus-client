import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Button, Input } from "@/shared/components";
import { useScrollSync } from "@/admin/domains/session/hooks";
import {
  MarkdownEditor,
  MarkdownPreview,
} from "@/admin/domains/session/components/markdown";
import { Modal, ErrorModal } from "@/shared/components/modal";
import { useNavigate, useParams } from "react-router-dom";
import { getPresignedUrl } from "@/admin/domains/session/api";
import { modifyNotice } from "../../apis";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";

interface Props {
  title: string;
  content: string;
  setTitle: (v: string) => void;
  setContent: Dispatch<SetStateAction<string>>;
}

export default function ModifyLayout({
  title,
  content,
  setTitle,
  setContent,
}: Props) {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { nid } = useParams<{ nid: string }>();
  const [modalType, setModalType] = useState<
    "noticeModify" | "noticeModifySuccess" | null
  >(null);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const [loading, setLoading] = useState(false);

  useScrollSync(editorRef, previewRef);

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
      throw error;
    }
  };

  const handleModify = async () => {
    if (!nid) return;

    const trimmedTitle = title.trim();

    if (!trimmedTitle || trimmedTitle.length > 80) {
      return;
    }

    try {
      setLoading(true);
      setErrors(null);

      await modifyNotice(Number(nid), {
        title: trimmedTitle,
        content,
      });

      setModalType("noticeModifySuccess");
    } catch (error) {
      setErrors(getCommonErrorState(error));
      setModalType(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pt-5">
      <div className="mb-8 flex items-center justify-between">
        <div className="w-228.5">
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Button
          size="large"
          onClick={() => setModalType("noticeModify")}
          disabled={loading}
        >
          수정
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
      {modalType === "noticeModify" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지사항 수정
          </Modal.Header>
          <Modal.Description>
            이 공지사항을 수정할까요? <br />
            작성일이 수정일 기준으로 변경됩니다
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              variant="primary"
              onClick={handleModify}
              disabled={loading}
            >
              {loading ? "수정 중..." : "확인"}
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "noticeModifySuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지사항 수정
          </Modal.Header>
          <Modal.Description>공지 사항을 수정했어요</Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              onClick={() => {
                setModalType(null);
                navigate(`/admin/notices/${nid}`);
              }}
            >
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
    </div>
  );
}
