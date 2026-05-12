import { Button } from "@/shared/components";
import {
  formatKoreanDateTime12,
  getCommonErrorState,
  type CommonErrorState,
} from "@/shared/utils";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "../../session/components/markdown";
import { Modal, ErrorModal } from "@/shared/components/modal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteNotice, getNoticeDetail, pinNotice, unpinNotice } from "../apis";

interface NoticeData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  createdUserName: string;
  pinned: boolean;
}

function NoticeViewPage() {
  const navigate = useNavigate();
  const { nid } = useParams();
  const [modalType, setModalType] = useState<
    | "noticeDelete"
    | "noticeDeleteSuccess"
    | "noticeLock"
    | "noticeLockSuccess"
    | "noticeUnlock"
    | "noticeUnlockSuccess"
    | null
  >(null);
  const [notice, setNotice] = useState<NoticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinning, setPinning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        setErrors(null);
        const res = await getNoticeDetail(Number(nid));
        setNotice(res.data.data);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setLoading(false);
      }
    };

    if (nid) {
      void fetchNotice();
    }
  }, [nid]);

  const handleTogglePinNotice = async () => {
    if (!notice || pinning) return;

    try {
      setPinning(true);
      setErrors(null);

      if (notice.pinned) {
        await unpinNotice(notice.id);
        setNotice((prev) => (prev ? { ...prev, pinned: false } : prev));
        setModalType("noticeUnlockSuccess");
        return;
      }

      await pinNotice(notice.id);
      setNotice((prev) => (prev ? { ...prev, pinned: true } : prev));
      setModalType("noticeLockSuccess");
    } catch (error) {
      setErrors(getCommonErrorState(error));
      setModalType(null);
    } finally {
      setPinning(false);
    }
  };

  const handleDeleteNotice = async () => {
    if (!notice || deleting) return;

    try {
      setDeleting(true);
      setErrors(null);

      await deleteNotice(notice.id);
      setModalType("noticeDeleteSuccess");
    } catch (error) {
      setErrors(getCommonErrorState(error));
      setModalType(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>불러오는 중...</div>;
  if (!notice) return <div>데이터가 없어요</div>;

  return (
    <div className="prose bg-ec-white w-full max-w-251.5 px-12 py-12">
      <h1 className="text-ec-black mb-2 text-3xl font-semibold">
        {notice.title}
      </h1>
      <div className="mb-6 flex gap-8 text-xs">
        <div className="flex gap-2">
          <span className="text-ec-sub">작성</span>
          <span className="text-ec-black">
            {formatKoreanDateTime12(notice.createdAt)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-ec-sub">등록자</span>
          <span className="text-ec-black">{notice.createdUserName}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-ec-sub">고정 상태</span>
          <span className={notice.pinned ? "text-ec-red" : "text-ec-blue"}>
            {notice.pinned ? "고정" : "미고정"}
          </span>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          size="primary"
          variant="primary"
          onClick={() =>
            setModalType(notice.pinned ? "noticeUnlock" : "noticeLock")
          }
        >
          {notice.pinned ? "고정 해제" : "고정"}
        </Button>
        <Button
          size="primary"
          variant="primary"
          onClick={() =>
            navigate(`/admin/notices/${notice.id}/modify`, {
              state: {
                notice: {
                  id: notice.id,
                  title: notice.title,
                  content: notice.content,
                  createdAt: notice.createdAt,
                  authorName: notice.createdUserName,
                  pinned: notice.pinned,
                },
              },
            })
          }
        >
          수정
        </Button>
        <Button
          size="primary"
          variant="danger"
          onClick={() => setModalType("noticeDelete")}
        >
          삭제
        </Button>
      </div>
      <ReactMarkdown components={markdownComponents}>
        {notice.content}
      </ReactMarkdown>
      {modalType === "noticeDelete" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지 사항 삭제
          </Modal.Header>
          <Modal.Description>
            이 공지사항을 삭제할까요? <br />이 작업은 되돌릴 수 없어요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              variant="danger"
              onClick={handleDeleteNotice}
              disabled={deleting}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "noticeDeleteSuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지 사항 삭제
          </Modal.Header>
          <Modal.Description>공지 사항을 삭제했어요</Modal.Description>
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
      {modalType === "noticeLock" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지사항 고정
          </Modal.Header>
          <Modal.Description>
            이 공지사항을 고정할까요? <br />
            고정된 공지사항은 최상단에 위치해요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              onClick={handleTogglePinNotice}
              disabled={pinning}
            >
              {pinning ? "고정 중..." : "확인"}
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "noticeLockSuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지사항 고정
          </Modal.Header>
          <Modal.Description>이 공지사항을 고정했어요</Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" onClick={() => setModalType(null)}>
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "noticeUnlock" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지사항 고정 해제
          </Modal.Header>
          <Modal.Description>
            이 공지사항의 고정을 해제할까요? <br />
            해제하면 최상단 고정 상태가 사라져요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              onClick={handleTogglePinNotice}
              disabled={pinning}
            >
              {pinning ? "해제 중..." : "확인"}
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "noticeUnlockSuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            공지사항 고정 해제
          </Modal.Header>
          <Modal.Description>이 공지사항의 고정을 해제했어요</Modal.Description>
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

export default NoticeViewPage;
