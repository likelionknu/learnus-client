import { Button } from "@/shared/components";
import {
  formatKoreanDateTime12,
  getCommonErrorState,
  type CommonErrorState,
} from "@/shared/utils";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "../components/markdown";
import { useEffect, useState } from "react";
import { Modal, ErrorModal } from "@/shared/components/modal";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteSessionFile,
  getSessionFile,
  toggleSessionFileStatus,
} from "../api";

interface FileData {
  fileId: number;
  name: string;
  content: string;
  createdAt: string;
  writer: string;
  isPublic: boolean;
}

type ModalType =
  | "toggleConfirm"
  | "toggleSuccess"
  | "deleteConfirm"
  | "deleteSuccess"
  | null;
function FilesViewPage() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [file, setFile] = useState<FileData | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const { sid, fid } = useParams();
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        const res = await getSessionFile(Number(sid), Number(fid));
        const data = res.data.data;
        setFile(data);
        setIsPublic(data.isPublic);
      } catch (error) {
        setErrors(getCommonErrorState(error));
        throw error;
      } finally {
        setLoading(false);
      }
    };
    if (sid && fid) fetchFile();
  }, [sid, fid]);

  const handleToggleStatus = async () => {
    if (!file) return;
    try {
      const nextState = !isPublic;
      await toggleSessionFileStatus(Number(sid), file.fileId, nextState);
      setIsPublic(nextState);
      setModalType("toggleSuccess");
    } catch (error) {
      setErrors(getCommonErrorState(error));
      throw error;
    }
  };
  const handleDeleteFile = async () => {
    if (!sid || !fid) return;

    try {
      await deleteSessionFile(Number(sid), Number(fid));

      setModalType("deleteSuccess");
    } catch (error) {
      setErrors(getCommonErrorState(error));
      throw error;
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (!file) return <div>데이터 없음</div>;
  return (
    <div className="prose bg-ec-white w-full max-w-251.5 px-12 py-12">
      <h1 className="text-ec-black mb-2 text-3xl font-semibold">{file.name}</h1>
      <div className="mb-6 flex gap-8 text-xs">
        <div className="flex gap-2">
          <span className="text-ec-sub">작성</span>
          <span className="text-ec-black">
            {formatKoreanDateTime12(file.createdAt)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-ec-sub">등록자</span>
          <span className="text-ec-black">{file.writer}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-ec-sub">공개 상태</span>
          <span className={isPublic ? "text-ec-blue" : "text-ec-red"}>
            {isPublic ? "공개" : "비공개"}
          </span>
        </div>
      </div>
      <div className="mb-6 flex gap-2">
        <Button
          size="primary"
          variant="primary"
          onClick={() =>
            navigate(`/admin/sessions/${sid}/files/${fid}/modify`, {
              state: {
                file: {
                  fileId: file.fileId,
                  name: file.name,
                  content: file.content,
                },
              },
            })
          }
        >
          수정
        </Button>
        <Button
          size="primary"
          variant="primary"
          onClick={() => setModalType("toggleConfirm")}
        >
          {isPublic ? "비공개로 설정" : "공개로 설정"}
        </Button>
        <Button
          size="primary"
          variant="danger"
          onClick={() => setModalType("deleteConfirm")}
        >
          삭제
        </Button>
      </div>
      <ReactMarkdown components={markdownComponents}>
        {file.content}
      </ReactMarkdown>

      {modalType === "toggleConfirm" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            세션 자료 공개 상태 변경
          </Modal.Header>
          <Modal.Description>
            {isPublic
              ? "이 세션 자료의 공개 상태를 공개로 변경할까요? \n공개로 변경하면, 세션 참여자들이 즉시 이 자료를 확인할 수 있어요"
              : "이 세션 자료의 공개 상태를 비공개로 변경할까요? \n비공개로 변경하면, 세션 참여자들은 더 이상 이 자료를 열람할 수 없어요"}
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" onClick={handleToggleStatus}>
              확인
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "toggleSuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            세션 자료 공개 상태 변경
          </Modal.Header>
          <Modal.Description>
            {isPublic
              ? "세션 자료를 공개 상태로 변경했어요"
              : "세션 자료를 비공개 상태로 변경했어요"}
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" onClick={() => setModalType(null)}>
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "deleteConfirm" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            세션 자료 삭제
          </Modal.Header>
          <Modal.Description>
            이 세션 자료를 삭제할까요? <br />이 작업은 되돌릴 수 없어요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" variant="danger" onClick={handleDeleteFile}>
              삭제
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "deleteSuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            세션 자료 삭제
          </Modal.Header>
          <Modal.Description>세션 자료를 삭제했어요</Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              onClick={() => {
                setModalType(null);
                navigate("/admin/sessions/data/management");
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

export default FilesViewPage;
