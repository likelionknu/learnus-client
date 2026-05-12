import { Button } from "@/shared/components";
import { formatKoreanDateTime12 } from "@/shared/utils";
import type { GroupDemerit } from "../types";

interface DemeritItemProps {
  item: GroupDemerit;
  isSubmitting: boolean;
  onClick: (did: number) => void;
}

function DemeritItem({ item, isSubmitting, onClick }: DemeritItemProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-body-2 mt-1 font-medium break-words">{item.reason}</p>
        <span className="text-caption text-ec-sub mt-2 block">
          {item.createdAt ? formatKoreanDateTime12(item.createdAt) : "-"},{" "}
          {`벌점 ${item.demerit}점`}
          {item.name ? `, ${item.name}` : ""}
        </span>
      </div>
      <Button
        size="modal"
        variant="danger"
        disabled={isSubmitting}
        onClick={() => onClick(item.id ?? -1)}
      >
        취소
      </Button>
    </div>
  );
}

export default DemeritItem;
