import { useState } from "react";
import { Button } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import { deleteAdminAssignment, getDeleteAdminAssignmentErrorMessage } from "../../api";
import type { AdminAssignmentDetail } from "../../types";

interface AssignmentDeleteModalProps {
  assignment: Pick<AdminAssignmentDetail, "assignmentId" | "title">;
  onClose: () => void;
  onSuccess: () => void;
}

function AssignmentDeleteModal({
  assignment,
  onClose,
  onSuccess,
}: AssignmentDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteAdminAssignment({ aid: assignment.assignmentId });
      onSuccess();
    } catch (error) {
      setErrorMessage(getDeleteAdminAssignmentErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal>
      <div className="flex min-w-95 flex-col">
        <Modal.Header onClick={isDeleting ? undefined : onClose}>
          과제 삭제
        </Modal.Header>
        <Modal.Description>
          이 과제를 삭제할까요? <br />이 작업은 되돌릴 수 없어요
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

export default AssignmentDeleteModal;
