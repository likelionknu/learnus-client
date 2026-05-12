import { useState } from "react";
import { Button } from "@/shared/components";
import { ErrorModal, Modal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { deleteAdminQuestionComment } from "../apis";
import type { AdminQuestionComment } from "../types";

interface AdminQuestionCommentItemProps {
  comment: AdminQuestionComment;
  onDeleted?: () => void;
}

function AdminQuestionCommentItem({
  comment,
  onDeleted,
}: AdminQuestionCommentItemProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  const handleDeleteComment = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAdminQuestionComment({ commentId: comment.id });
      onDeleted?.();
      setIsDeleteConfirmOpen(false);
      setErrors(null);
    } catch (error) {
      setErrors(getCommonErrorState(error));
    } finally {
      setIsDeleting(false);
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
            <Button
              size="modal"
              variant="danger"
              isLoading={isDeleting}
              disabled={isDeleting}
              onClick={() => {
                void handleDeleteComment();
              }}
            >
              삭제
            </Button>
            <Modal.Cancelled onClick={() => setIsDeleteConfirmOpen(false)} />
          </Modal.ButtonLayout>
        </Modal>
      )}

      <div className="border-ec-outline border-b px-7 py-2.5">
        <div className="font-pretendard flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-ec-black text-[14px]/[23px] font-medium">
              {comment.author}
            </span>
            <span className="text-ec-disable text-[14px]/[23px] font-medium">
              {comment.createdLabel}
            </span>
            {comment.isMine && (
              <div className="bg-ec-blue text-ec-white flex h-4 min-w-10 items-center justify-center rounded-[5px] px-1.5 text-[10px] font-medium">
                내 댓글
              </div>
            )}
          </div>
          <span
            className="text-ec-red cursor-pointer pt-0.5 text-[14px]/[23px] font-medium"
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            삭제
          </span>
        </div>
        <span className="text-ec-black mt-0.5 block text-[14px]/[23px] font-medium">
          {comment.content}
        </span>
      </div>
    </>
  );
}

export default AdminQuestionCommentItem;
