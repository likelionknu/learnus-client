import { useState } from "react";
import { Button } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import { getCommonErrorState } from "@/shared/utils";
import { deleteAdminQuestion } from "../apis";

interface AdminQuestionDeleteModalProps {
  qid: number;
  title: string;
  onClose: () => void;
  onSuccess: () => void;
}

function AdminQuestionDeleteModal({
  qid,
  title,
  onClose,
  onSuccess,
}: AdminQuestionDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteAdminQuestion({ qid });
      onSuccess();
    } catch (error) {
      setErrorMessage(getCommonErrorState(error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal>
      <div className="flex min-w-95 flex-col">
        <Modal.Header onClick={isDeleting ? undefined : onClose}>
          질문 삭제
        </Modal.Header>
        <Modal.Description>
          `{title}` 질문을 삭제할까요? <br />
          삭제 후에는 목록에서 보이지 않아요.
        </Modal.Description>
        {errorMessage && (
          <div className="text-ec-red mt-3 text-sm">{errorMessage}</div>
        )}
        <Modal.ButtonLayout>
          <Button
            size="primary"
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={() => {
              void handleDelete();
            }}
          >
            삭제
          </Button>
          <Modal.Cancelled onClick={isDeleting ? undefined : onClose} />
        </Modal.ButtonLayout>
      </div>
    </Modal>
  );
}

export default AdminQuestionDeleteModal;
