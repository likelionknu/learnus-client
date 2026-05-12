import MemoAddModal from "./MemoAddModal";
import MemoListModal from "./MemoListModal";
import type { GroupMemo, MemoModalTarget } from "../types";

type MemoModalStep = "LIST" | "ADD";

interface MemoModalProps {
  target: MemoModalTarget;
  step: MemoModalStep;
  memos: GroupMemo[];
  value: string;
  maxLength: number;
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onOpenAdd: () => void;
  onDeleteMemo: (mid: number) => void;
  onDeleteAllMemos: () => void;
  onBack: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function MemoModal({
  target,
  step,
  memos,
  value,
  maxLength,
  isLoading,
  isSubmitting,
  onClose,
  onOpenAdd,
  onDeleteMemo,
  onDeleteAllMemos,
  onBack,
  onChange,
  onSubmit,
}: MemoModalProps) {
  if (step === "ADD") {
    return (
      <MemoAddModal
        value={value}
        maxLength={maxLength}
        isSubmitting={isSubmitting}
        onClose={onClose}
        onBack={onBack}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <MemoListModal
      target={target}
      memos={memos}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onOpenAdd={onOpenAdd}
      onDeleteMemo={onDeleteMemo}
      onDeleteAllMemos={onDeleteAllMemos}
    />
  );
}

export default MemoModal;
