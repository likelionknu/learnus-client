import { Button } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import MemoBox from "./MemoBox";
import type { GroupMemo, MemoModalTarget } from "../types";
import MemoItem from "./MemoItem";

interface MemoListModalProps {
  target: MemoModalTarget;
  memos: GroupMemo[];
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onOpenAdd: () => void;
  onDeleteMemo: (mid: number) => void;
  onDeleteAllMemos: () => void;
}

function MemoListModal({
  target,
  memos,
  isLoading,
  isSubmitting,
  onClose,
  onOpenAdd,
  onDeleteMemo,
  onDeleteAllMemos,
}: MemoListModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClose}>{target.name} 메모</Modal.Header>
      <div className="mt-5 flex w-153.5 flex-col gap-2">
        {isLoading ? (
          <MemoBox>메모를 불러오는 중...</MemoBox>
        ) : memos.length === 0 ? (
          <MemoBox>등록된 메모가 없어요.</MemoBox>
        ) : (
          memos.map((memo) => (
            <MemoBox key={memo.id}>
              <MemoItem
                item={memo}
                isSubmitting={isSubmitting}
                onClick={onDeleteMemo}
              />
            </MemoBox>
          ))
        )}
      </div>
      <Modal.ButtonLayout>
        <div className="flex w-full justify-end gap-2">
          <Button
            size="large"
            variant="danger"
            isLoading={isSubmitting}
            disabled={isSubmitting || memos.length === 0}
            onClick={onDeleteAllMemos}
          >
            초기화
          </Button>
          <Button
            size="large"
            variant="primary"
            disabled={isSubmitting}
            onClick={onOpenAdd}
          >
            추가
          </Button>
        </div>
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default MemoListModal;
