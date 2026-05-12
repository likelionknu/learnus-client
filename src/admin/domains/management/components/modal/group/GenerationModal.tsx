import { Button, SelectBox } from "@/shared/components";
import { Modal } from "@/shared/components/modal";

interface GenerationModalProps {
  currentGeneration?: number;
  options: string[];
  selectedGeneration: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSelectGeneration: (value: string) => void;
  onSubmit: () => void;
}

function GenerationModal({
  currentGeneration,
  options,
  selectedGeneration,
  isSubmitting,
  onClose,
  onSelectGeneration,
  onSubmit,
}: GenerationModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClose}>기수 변경 </Modal.Header>
      <Modal.Description>
        현재
        <span className="text-body-2 text-ec-black ml-2">
          {currentGeneration ?? "-"}기
        </span>
      </Modal.Description>
      <div className="w-153.5">
        <SelectBox
          options={options}
          defaultValue="기수를 선택하세요"
          className="w-full"
          onChange={onSelectGeneration}
        />
      </div>
      <Modal.ButtonLayout>
        <div className="flex w-full justify-end">
          <Button
            size="large"
            variant="primary"
            disabled={selectedGeneration.length === 0 || isSubmitting}
            onClick={onSubmit}
          >
            기수 변경
          </Button>
        </div>
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default GenerationModal;
