import { useState } from "react";
import { Button } from "@/shared/components";
import { ErrorModal, Modal } from "@/shared/components/modal";
import { formatDaysAgo, getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { deleteComment } from "@/user/shared/apis";
import type { CommentState } from "@/user/shared/types";

const CommentStatus = () => {
  return (
    <div className="bg-ec-blue text-ec-white font-pretendard tracking-ec-normal min-w-10 rounded-[5px] px-1.5 text-[10px] font-medium">
      내 댓글
    </div>
  );
};

function QuestionCommentItem({
  comment,
  onDeleted,
}: {
  comment?: CommentState;
  onDeleted?: () => void;
}) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // 삭제 확인 모달
  const [errors, setErrors] = useState<CommonErrorState | null>(null); // 에러 상태

  // 댓글 삭제
  const handleDeleteComment = async () => {
    const cid = comment?.commentId;
    if (typeof cid !== "number") return;

    try {
      await deleteComment({ cid });
      onDeleted?.();
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      setErrors(getCommonErrorState(error));
    }
  };

  return (
    <>
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      {isDeleteConfirmOpen && (
        <Modal>
          <Modal.Header onClick={() => setIsDeleteConfirmOpen(false)}>
            댓글 삭제
          </Modal.Header>
          <Modal.Description>
            댓글을 삭제하시겠어요? 삭제 후에는 복구할 수 없어요.
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button size="modal" variant="danger" onClick={handleDeleteComment}>
              삭제
            </Button>
            <Modal.Cancelled onClick={() => setIsDeleteConfirmOpen(false)} />
          </Modal.ButtonLayout>
        </Modal>
      )}

      <div className="border-ec-outline border-b px-4 py-2 xl:px-0">
        <div className="font-pretendard flex justify-between">
          <div className="flex gap-2">
            <span className="text-ec-black tracking-ec-normal text-[14px]/[23px] font-medium">
              {comment?.createdBy}
            </span>
            <span className="text-ec-disable tracking-ec-normal text-[14px]/[23px] font-medium">
              {formatDaysAgo(comment?.createdAt)}
            </span>
            {comment?.author && <CommentStatus />}
          </div>
          {comment?.author && (
            <span
              className="text-ec-red tracking-ec-normal cursor-pointer text-[14px]/[23px] font-medium"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              삭제
            </span>
          )}
        </div>
        <span className="text-ec-black tracking-ec-normal text-[14px]/[23px] font-medium">
          {comment?.content}
        </span>
      </div>
    </>
  );
}

export default QuestionCommentItem;
