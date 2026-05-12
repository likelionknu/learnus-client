import { Modal } from "@/shared/components/modal";
import type { GroupDemerit } from "../types";
import MemoBox from "./MemoBox";
import DemeritItem from "./DemeritItem";

interface DemeritListModalProps {
  currentPoint: number;
  demerits: GroupDemerit[];
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onBack: () => void;
  onDeleteDemerit: (did: number) => void;
}

function DemeritListModal({
  currentPoint,
  demerits,
  isLoading,
  isSubmitting,
  onClose,
  onBack,
  onDeleteDemerit,
}: DemeritListModalProps) {
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
          <span>벌점 내역</span>
        </div>
      </Modal.Header>
      <Modal.Description>
        현재
        <span className="text-body-2 text-ec-black ml-2">{currentPoint}점</span>
      </Modal.Description>
      <div className="mt-4 flex w-153.5 flex-col gap-2">
        {isLoading ? (
          <MemoBox>벌점 내역을 불러오는 중...</MemoBox>
        ) : demerits.length === 0 ? (
          <MemoBox>
            <div className="text-ec-sub flex min-h-30 items-center justify-center">
              해당 사용자에게 부여된 벌점이 없어요.
            </div>
          </MemoBox>
        ) : (
          demerits.map((demerit, index) => (
            <div className="flex max-h-100 flex-col overflow-y-scroll">
              <MemoBox key={`${demerit.id ?? "missing"}-${index}`}>
                <DemeritItem
                  item={demerit}
                  isSubmitting={isSubmitting}
                  onClick={onDeleteDemerit}
                />
              </MemoBox>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}

export default DemeritListModal;
