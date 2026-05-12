import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { NoticeModifyLayout } from "../components/markdown";
import { getNoticeDetail } from "../apis";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";

interface NoticeEditState {
  notice?: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    authorName: string;
    pinned: boolean;
  };
}

export default function NoticeModifyPage() {
  const location = useLocation();
  const { nid } = useParams<{ nid: string }>();
  const state = location.state as NoticeEditState | null;
  const initialNotice = state?.notice;

  const [title, setTitle] = useState(initialNotice?.title ?? "");
  const [content, setContent] = useState(initialNotice?.content ?? "");
  const [loading, setLoading] = useState(!initialNotice);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  useEffect(() => {
    if (initialNotice || !nid) {
      setLoading(false);
      return;
    }

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setErrors(null);

        const res = await getNoticeDetail(Number(nid));
        const notice = res.data.data;

        setTitle(notice.title);
        setContent(notice.content);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setLoading(false);
      }
    };

    void fetchNotice();
  }, [initialNotice, nid]);

  if (loading) return <div>로딩중...</div>;

  return (
    <>
      <NoticeModifyLayout
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
      />
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
    </>
  );
}
