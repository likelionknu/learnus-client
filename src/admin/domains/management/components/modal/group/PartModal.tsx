import { Button, SelectBox } from "@/shared/components";
import { Modal } from "@/shared/components/modal";

interface PartModalProps {
  currentPart?: string;
  options: string[];
  selectedPartCode: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSelectPart: (value: string) => void;
  onSubmit: () => void;
}

function PartModal({
  currentPart,
  options,
  selectedPartCode,
  isSubmitting,
  onClose,
  onSelectPart,
  onSubmit,
}: PartModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClose}>파트 변경 </Modal.Header>
      <Modal.Description>
        현재
        <span className="text-body-2 text-ec-black ml-2">
          {currentPart ?? "-"}
        </span>
      </Modal.Description>
      <div className="w-153.5">
        <SelectBox
          options={options}
          defaultValue="파트를 선택하세요"
          className="w-full"
          onChange={onSelectPart}
        />
      </div>
      <Modal.ButtonLayout>
        <div className="flex w-full justify-end">
          <Button
            size="large"
            variant="primary"
            disabled={selectedPartCode.length === 0 || isSubmitting}
            onClick={onSubmit}
          >
            파트 변경
          </Button>
        </div>
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default PartModal;
