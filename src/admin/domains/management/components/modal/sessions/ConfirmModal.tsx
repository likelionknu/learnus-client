import { Button } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import type { ModalProps } from "@/shared/types";

function ConfirmModal({ onClick, onClose }: ModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClose}>세션 추가</Modal.Header>
      <Modal.Description>해당 세션을 추가할까요?</Modal.Description>
      <Modal.ButtonLayout>
        <Button size="modal" variant="primary" onClick={onClick}>
          확인
        </Button>
        <Modal.Cancelled onClick={onClose} />
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default ConfirmModal;
