import { useEffect, useState } from "react";
import { Button, TextBox } from "@/shared/components";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { createAdminQuestionComment, getAdminQuestionComments } from "../apis";
import AdminQuestionCommentItem from "./AdminQuestionCommentItem";
import type { AdminQuestionComment } from "../types";

interface AdminQuestionCommentsSectionProps {
  qid: number;
}

function AdminQuestionCommentsSection({
  qid,
}: AdminQuestionCommentsSectionProps) {
  const [commentList, setCommentList] = useState<
    readonly AdminQuestionComment[]
  >([]);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await getAdminQuestionComments({ qid });

        setCommentList(comments);
        setErrors(null);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      }
    };

    void fetchComments();
  }, [qid, refreshKey]);

  const handleCreateComment = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdComment = await createAdminQuestionComment({
        qid,
        content: trimmedContent,
      });

      if (!createdComment) {
        setErrors({
          status: "500",
          message: "댓글 등록에 실패했어요.",
        });
        return;
      }

      setContent("");
      setErrors(null);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrors(getCommonErrorState(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
      <span className="text-body-2 text-ec-black">
        {commentList.length}개의 댓글
      </span>
      <TextBox px={false} py={false}>
        <div>
          {commentList.length === 0 ? (
            <div className="border-ec-outline-dark flex items-center justify-center border-b py-5">
              <span className="text-ec-sub font-pretendard tracking-ec-normal text-[14px]/[23px] font-medium">
                첫 댓글을 남겨보세요!
              </span>
            </div>
          ) : (
            commentList.map((comment) => (
              <AdminQuestionCommentItem
                key={comment.id}
                comment={comment}
                onDeleted={() => setRefreshKey((prev) => prev + 1)}
              />
            ))
          )}
        </div>
        <div className="flex items-center gap-4 px-7 py-4.25">
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="댓글을 남겨보세요"
            className="bg-ec-white text-ec-black placeholder:text-ec-sub rounded-ec-10 h-11 flex-1 px-4 text-[14px]/[23px] font-medium outline-none"
          />
          <Button
            size="large"
            style={{ width: 74, minWidth: 74, height: 44 }}
            isLoading={isSubmitting}
            disabled={!content.trim() || isSubmitting}
            onClick={() => {
              void handleCreateComment();
            }}
          >
            등록
          </Button>
        </div>
      </TextBox>
    </div>
  );
}

export default AdminQuestionCommentsSection;
