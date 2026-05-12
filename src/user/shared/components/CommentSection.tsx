import { ErrorModal } from "@/shared/components/modal";
import { QuestionCommentItem } from "@/shared/components/comment";
import { QuestionCommentSkeleton } from "@/user/domains/session/components/skeleton";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { useEffect, useState } from "react";
import { getComments } from "../apis";
import type { CommentState } from "../types";

function CommentSection({
  qid,
  isLoading,
  refreshKey,
  onCountChange,
  setRefresh,
}: {
  qid: number;
  isLoading: boolean;
  refreshKey: number;
  onCountChange?: (count: number) => void;
  setRefresh?: (updater: (prev: number) => number) => void;
}) {
  const [comments, setComments] = useState<CommentState[]>([]); // 등록 댓글 상태
  const [errors, setErrors] = useState<CommonErrorState | null>(null); // 에러 상태

  // 댓글 조회
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments({ qid });
        const responseData = res.data?.data ?? res.data;
        const nextComments = Array.isArray(responseData) ? responseData : [];

        setErrors(null);
        setComments(nextComments);
        onCountChange?.(nextComments.length);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      }
    };

    fetchComments();
  }, [qid, refreshKey, onCountChange]);

  return (
    <>
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      {isLoading ? (
        <>
          <QuestionCommentSkeleton />
          <QuestionCommentSkeleton />
          <QuestionCommentSkeleton />
        </>
      ) : comments.length === 0 ? (
        <div className="border-ec-outline-dark flex items-center justify-center border-b py-5">
          <span className="text-ec-sub font-pretendard tracking-ec-normal bg-ec-box text-[14px]/[23px] font-medium">
            첫 댓글을 남겨보세요!
          </span>
        </div>
      ) : (
        <>
          {comments.map((comment) => (
            <QuestionCommentItem
              key={comment.commentId}
              comment={comment}
              onDeleted={() => setRefresh?.((prev) => prev + 1)}
            />
          ))}
        </>
      )}
    </>
  );
}

export default CommentSection;
