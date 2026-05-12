import DemeritListModal from "./DemeritListModal";
import DemeritMainModal from "./DemeritMainModal";
import type { GroupDemerit } from "../types";

type DemeritModalStep = "MAIN" | "LIST";

interface DemeritModalProps {
  step: DemeritModalStep;
  currentPoint: number;
  demerits: GroupDemerit[];
  reasonOptions: string[];
  scoreOptions: string[];
  selectedReason: string;
  selectedScore: string;
  canAssign: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onBack: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  onAssign: () => void;
  onDeleteDemerit: (did: number) => void;
  onSelectReason: (value: string) => void;
  onSelectScore: (value: string) => void;
}

function DemeritModal({
  step,
  currentPoint,
  demerits,
  reasonOptions,
  scoreOptions,
  selectedReason,
  selectedScore,
  canAssign,
  isLoading,
  isSubmitting,
  onClose,
  onBack,
  onOpenHistory,
  onReset,
  onAssign,
  onDeleteDemerit,
  onSelectReason,
  onSelectScore,
}: DemeritModalProps) {
  if (step === "LIST") {
    return (
      <DemeritListModal
        currentPoint={currentPoint}
        demerits={demerits}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onClose={onClose}
        onBack={onBack}
        onDeleteDemerit={onDeleteDemerit}
      />
    );
  }

  return (
    <DemeritMainModal
      currentPoint={currentPoint}
      reasonOptions={reasonOptions}
      scoreOptions={scoreOptions}
      selectedReason={selectedReason}
      selectedScore={selectedScore}
      canAssign={canAssign}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onOpenHistory={onOpenHistory}
      onReset={onReset}
      onAssign={onAssign}
      onSelectReason={onSelectReason}
      onSelectScore={onSelectScore}
    />
  );
}

export default DemeritModal;
