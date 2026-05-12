import { Button } from "@/shared/components";
import { Modal } from "@/shared/components/modal";

interface MemoAddModalProps {
  value: string;
  maxLength: number;
  isSubmitting: boolean;
  onClose: () => void;
  onBack: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function MemoAddModal({
  value,
  maxLength,
  isSubmitting,
  onClose,
  onBack,
  onChange,
  onSubmit,
}: MemoAddModalProps) {
  const remaining = maxLength - value.length;
  const canSubmit = value.trim().length > 0 && value.length <= maxLength;

  return (
    <Modal>
      <Modal.Header onClick={onClose}>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="text-ec-black cursor-pointer text-[18px]"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            ←
          </button>
          <span>메모 추가</span>
        </div>
      </Modal.Header>

      <div className="mt-4 w-153.5">
        <textarea
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder="해당 사용자에 대한 메모를 입력하세요"
          className="bg-ec-box rounded-ec-10 text-body-2 placeholder:text-ec-sub h-82 w-full resize-none p-6 outline-none"
        />
      </div>

      <div className="mt-4 flex w-153.5 items-center justify-end gap-4">
        <span className="text-caption text-ec-sub">{remaining}자 입력 가능</span>
        <Button
          size="large"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting || !canSubmit}
          onClick={onSubmit}
        >
          등록
        </Button>
      </div>
    </Modal>
  );
}

export default MemoAddModal;
