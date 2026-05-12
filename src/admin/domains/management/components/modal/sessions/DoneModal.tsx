import { Button } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import type { ModalProps } from "@/shared/types";

function DoneModal({ onClose }: ModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClose}>세션 추가</Modal.Header>
      <Modal.Description>새로운 세션을 추가했어요.</Modal.Description>
      <Modal.ButtonLayout>
        <Button size="modal" variant="primary" onClick={onClose}>
          확인
        </Button>
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default DoneModal;
