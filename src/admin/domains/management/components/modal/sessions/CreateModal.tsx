import { Button, Input } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import type { ModalProps } from "@/shared/types";

function CreateModal({ name, onChange, onClick, onClose }: ModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClose}>새 세션 추가</Modal.Header>
      <Modal.Description>세션 명</Modal.Description>
      <div className="mt-2 w-153">
        <Input
          placeholder="세션 명을 입력하세요"
          value={name}
          onChange={onChange}
        />
      </div>
      <div className="mt-8 flex justify-end">
        <Button size="large" variant="primary" onClick={onClick}>
          추가
        </Button>
      </div>
    </Modal>
  );
}

export default CreateModal;
