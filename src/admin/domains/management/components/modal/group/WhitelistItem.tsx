import { useState } from "react";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { deleteWhitelist } from "../../../apis";
import StopIcon from "../../../assets/stop.svg?react";
import type { ListState } from "../../../pages";
import { GroupActionStepModal, type GroupActionModalState } from "..";

interface WhitelistItemProps {
  item: ListState;
  onDeleted?: () => void;
}

function WhitelistItem({ item, onDeleted }: WhitelistItemProps) {
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const [modalState, setModalState] = useState<GroupActionModalState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDeleteModal = () => {
    setModalState({ action: "WHITELIST_DELETE", phase: "CONFIRM" });
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    if (modalState?.phase === "DONE") {
      onDeleted?.();
    }

    setModalState(null);
  };

  const handleConfirmDelete = async () => {
    if (modalState?.phase !== "CONFIRM" || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await deleteWhitelist({ wid: item.id });
      setModalState((prev) => (prev ? { ...prev, phase: "DONE" } : prev));
    } catch (error) {
      setErrors(getCommonErrorState(error));
      setModalState(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {modalState && (
        <GroupActionStepModal
          modalState={modalState}
          onClose={handleCloseModal}
          onNext={handleConfirmDelete}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="border-ec-outline flex w-full items-center justify-between border-b py-2">
        {errors && (
          <ErrorModal
            status={errors.status}
            message={errors.message}
            onClick={() => setErrors(null)}
          />
        )}

        <div className="flex flex-col gap-1">
          <span className="text-caption text-ec-black">{item.email}</span>
          <span className="text-caption text-ec-sub">
            {item.registerName}님이 추가
          </span>
        </div>

        <button
          type="button"
          className="text-caption text-ec-red flex cursor-pointer items-center gap-1"
          onClick={handleOpenDeleteModal}
          disabled={isSubmitting}
        >
          <StopIcon className="fill-ec-red w-3" />
          제거
        </button>
      </div>
    </>
  );
}

export default WhitelistItem;
