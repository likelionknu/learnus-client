import { SkeletonCell } from "@/shared/components/skeleton";
import { formatKoreanDateTime12, getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import EraseIcon from "../../assets/erase.svg?react";
import type { AdminDashboardMemberRow } from "../../types";
import { deleteMember } from "../../api";
import { useState } from "react";
import { ErrorModal } from "@/shared/components/modal";

interface DashboardTableRowsProps {
  sessionId: number;
  isLoading: boolean;
  members: AdminDashboardMemberRow[];
  onDeleteSuccess?: () => void;
}

const PART_OPTIONS: Record<string, string> = {
  BACKEND: "백엔드",
  PLANNING: "기획",
  DESIGN: "디자인",
  FRONTEND: "프론트엔드",
  OPERATOR: "운영진",
};

function DashboardTableRows({
  sessionId,
  isLoading,
  members,
  onDeleteSuccess,
}: DashboardTableRowsProps) {
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  // 사용자 삭제
  const handleDelete = async ({ userId }: { userId: number }) => {
    try {
      await deleteMember({ sid: sessionId, userId: userId });
      onDeleteSuccess?.();
    } catch (error) {
      setErrors(getCommonErrorState(error));
    }
  };

  return (
    <div className="rounded-ec-10 flex w-full flex-col overflow-hidden">
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => {
            setErrors(null);
          }}
        />
      )}

      {isLoading && (
        <div className="flex animate-pulse items-center px-8 py-5">
          <SkeletonCell className="h-4 w-20 shrink-0" />
          <SkeletonCell className="h-4 w-24 shrink-0" />
          <SkeletonCell className="h-4 w-24 shrink-0" />
          <SkeletonCell className="h-4 w-54 shrink-0" />
          <SkeletonCell className="h-4 w-73 shrink-0" />
          <SkeletonCell className="h-4 w-26 shrink-0" />
          <SkeletonCell className="h-4 w-24 shrink-0" />
        </div>
      )}

      {members.map((member, index) => (
        <div
          key={`${member.userId}-${member.email}`}
          className={`text-body-2 flex items-center px-8 py-5 ${
            index % 2 === 1 ? "bg-ec-box" : "bg-ec-white"
          }`}
        >
          <span className="w-20 shrink-0">{member.course}기</span>
          <span className="w-24 shrink-0">
            <span
              className="inline-block max-w-[3.2em] overflow-hidden align-bottom text-ellipsis whitespace-nowrap"
              title={member.name}
            >
              {member.name}
            </span>
          </span>
          <span className="w-24 shrink-0">
            {PART_OPTIONS[member.part] ?? member.part}
          </span>
          <span className="w-54 shrink-0 truncate">{member.email}</span>
          <span className="w-73 shrink-0 pl-8">
            {member.registeredAt
              ? formatKoreanDateTime12(member.registeredAt)
              : "-"}
          </span>
          <span className="w-26 shrink-0 text-center">{member.invitedBy}</span>
          <div className="w-24 shrink-0 text-center">
            <button
              className="text-ec-red inline-flex cursor-pointer items-center gap-1.5"
              type="button"
              onClick={() => handleDelete({ userId: member.userId })}
            >
              <EraseIcon
                className="h-3.5 w-3.5 fill-current"
                aria-hidden="true"
              />
              <span>제거하기</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardTableRows;
