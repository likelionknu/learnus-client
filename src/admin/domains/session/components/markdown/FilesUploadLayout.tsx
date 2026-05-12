import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useScrollSync } from "../../hooks";
import { Button, Input } from "@/shared/components";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import { Modal, ErrorModal } from "@/shared/components/modal";
import { createSessionFile, getPresignedUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";

interface Props {
  title: string;
  content: string;
  setTitle: (v: string) => void;
  setContent: Dispatch<SetStateAction<string>>;
}

export default function FilesUploadLayout({
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
    "confirm" | "success" | "guide" | null
  >(null);

  const { sid } = useParams();
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
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setModalType("guide");
      return;
    }

    if (title.length > 80) {
      setModalType("guide");
      return;
    }

    try {
      setLoading(true);

      await createSessionFile(Number(sid), title, content);

      setModalType("success");
    } catch (error) {
      setErrors(getCommonErrorState(error));
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
          variant="primary"
          onClick={() => setModalType("confirm")}
          disabled={loading}
        >
          {loading ? "등록 중..." : "등록"}
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

      {modalType === "confirm" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            세션 자료 등록
          </Modal.Header>
          <Modal.Description>
            세션 자료를 등록할까요? 세션 자료가 등록되었다는 알림이 <br />
            세션에 등록된 참여자들에게 발송돼요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              onClick={async () => {
                await handleSubmit();
              }}
            >
              확인
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "success" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            세션 자료 등록
          </Modal.Header>
          <Modal.Description>세션 자료를 등록했어요</Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              onClick={() => {
                setModalType(null);
                navigate(-1);
              }}
            >
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "guide" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            입력 형식 안내
          </Modal.Header>
          <Modal.Description>
            세션 자료의 제목은 최대 80자까지 입력할 수 있어요
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
          onClick={() => setErrors(null)}
        />
      )}
    </div>
  );
}
