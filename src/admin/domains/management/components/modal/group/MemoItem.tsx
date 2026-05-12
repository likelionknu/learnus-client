import { formatKoreanDateTime12 } from "@/shared/utils";
import type { GroupMemo } from "../types";

interface MemoItemProps {
  item: GroupMemo;
  isSubmitting: boolean;
  onClick: (mid: number) => void;
}

function MemoItem({ item, isSubmitting, onClick }: MemoItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-2 mt-2 wrap-break-word">{item.content}</p>
      <div className="flex items-end justify-between">
        <span className="text-caption text-ec-sub">
          {item.createdAt ? formatKoreanDateTime12(item.createdAt) : "-"},{" "}
          {item.grantedUser} 등록
        </span>
        <button
          type="button"
          className="text-ec-red text-caption cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onClick={() => onClick(item.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default MemoItem;
