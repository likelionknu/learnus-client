import { useEffect, useState } from "react";
import { QuestionCommentItem } from "@/shared/components/comment";
import { TextBox } from "@/shared/components";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { getComments } from "../apis";
import type { CommentState } from "../types";

function MobileCommentSection({
  qid,
  refreshKey,
  onCountChange,
  setRefresh,
}: {
  qid: number;
  refreshKey: number;
  onCountChange?: (count: number) => void;
  setRefresh?: (updater: (prev: number) => number) => void;
}) {
  const [comments, setComments] = useState<CommentState[]>([]);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

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

      {comments.length === 0 ? (
        <div className="border-ec-outline-dark flex items-center justify-center border-b py-5">
          <span className="text-ec-sub font-pretendard tracking-ec-normal text-[14px]/[23px] font-medium">
            첫 댓글을 남겨보세요!
          </span>
        </div>
      ) : (
        <>
          {comments.map((comment) => (
            <TextBox key={comment.commentId} px={false} py={false}>
              <QuestionCommentItem
                comment={comment}
                onDeleted={() => setRefresh?.((prev) => prev + 1)}
              />
            </TextBox>
          ))}
        </>
      )}
    </>
  );
}

export default MobileCommentSection;
