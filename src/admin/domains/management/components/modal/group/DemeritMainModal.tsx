import { Button, SelectBox } from "@/shared/components";
import { Modal } from "@/shared/components/modal";

interface DemeritMainModalProps {
  currentPoint: number;
  reasonOptions: string[];
  scoreOptions: string[];
  selectedReason: string;
  selectedScore: string;
  canAssign: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  onAssign: () => void;
  onSelectReason: (value: string) => void;
  onSelectScore: (value: string) => void;
}

function DemeritMainModal({
  currentPoint,
  reasonOptions,
  scoreOptions,
  selectedReason,
  selectedScore,
  canAssign,
  isSubmitting,
  onClose,
  onOpenHistory,
  onReset,
  onAssign,
  onSelectReason,
  onSelectScore,
}: DemeritMainModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClose}>벌점</Modal.Header>
      <Modal.Description>
        현재
        <span className="text-body-2 text-ec-black ml-2">{currentPoint}점</span>
      </Modal.Description>
      <div className="grid w-131.5 grid-cols-[2.5fr_1fr] gap-2.5">
        <SelectBox
          options={reasonOptions}
          defaultValue={selectedReason}
          value={selectedReason}
          className="w-full"
          onChange={onSelectReason}
        />
        <SelectBox
          options={scoreOptions}
          defaultValue={selectedScore}
          value={selectedScore}
          className="w-full"
          onChange={onSelectScore}
        />
      </div>
      <Modal.ButtonLayout>
        <div className="mt-5 flex w-full justify-end gap-2">
          <Button size="large" variant="primary" onClick={onOpenHistory}>
            벌점 내역
          </Button>
          <Button
            size="large"
            variant="danger"
            disabled={isSubmitting}
            onClick={onReset}
          >
            벌점 초기화
          </Button>
          <Button
            size="large"
            variant="primary"
            disabled={isSubmitting || !canAssign}
            onClick={onAssign}
          >
            벌점 부여
          </Button>
        </div>
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default DemeritMainModal;

