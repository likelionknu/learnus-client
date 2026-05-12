import { Button } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import { MODAL_CONFIG } from "./constants";
import type { GroupActionModalState, GroupActionType } from "./types";
export type { GroupActionModalState, GroupActionType };

interface GroupActionStepModalProps {
  modalState: GroupActionModalState;
  onClose: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
}

function GroupActionStepModal({
  modalState,
  onClose,
  onNext,
  isSubmitting = false,
}: GroupActionStepModalProps) {
  if (!modalState) return null;

  const config = MODAL_CONFIG[modalState.action];
  const isConfirm = modalState.phase === "CONFIRM";
  const isPending = isConfirm && isSubmitting;

  return (
    <Modal>
      <Modal.Header onClick={onClose}>{config.title}</Modal.Header>
      <Modal.Description>
        {isConfirm ? config.confirmMessage : config.doneMessage}
      </Modal.Description>
      <Modal.ButtonLayout>
        <Button
          size="modal"
          variant={isConfirm ? config.confirmVariant : "primary"}
          onClick={isConfirm ? onNext : onClose}
          disabled={isPending}
          isLoading={isPending}
        >
          {isConfirm ? config.confirmLabel : "확인"}
        </Button>
        {isConfirm && !isPending && <Modal.Cancelled onClick={onClose} />}
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default GroupActionStepModal;
