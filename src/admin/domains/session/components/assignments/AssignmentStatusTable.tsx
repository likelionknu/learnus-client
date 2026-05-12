import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { SkeletonCell } from "@/shared/components/skeleton";
import { TableEmptyState, TableHeaderLabel } from "@/shared/components/table";
import { formatKoreanDateTime24 } from "@/shared/utils";
import { formatAssignmentStatus, formatEvaluateStatus } from "@/user/utils";
import type { AdminAssignmentParticipant } from "../../types";

const ASSIGNMENT_STATUS_TABLE_COLUMNS =
  "0.55fr 0.8fr 0.9fr 1.55fr 1.55fr 1.55fr 0.65fr 0.65fr";

const TABLE_GRID_CLASS = "grid w-full min-w-0 items-center gap-3";
const TABLE_ROW_CLASS = "flex min-h-14 items-center px-6 py-2";
const TABLE_DATE_TEXT_CLASS =
  "text-body-2 min-w-0 truncate text-center whitespace-nowrap";

const PART_LABEL_BY_CODE: Record<string, string> = {
  OPERATOR: "운영진",
  PLANNING: "기획",
  BACKEND: "백엔드",
  FRONTEND: "프론트엔드",
  DESIGN: "디자인",
};

function formatPart(part: string) {
  return PART_LABEL_BY_CODE[part] ?? part;
}

function formatName(name: string) {
  const characters = Array.from(name);

  return characters.length > 3 ? `${characters.slice(0, 3).join("")}...` : name;
}

function AssignmentStatusTableHeader() {
  return (
    <div className="bg-ec-table-header flex min-h-10 items-center px-6 py-2">
      <div
        className={TABLE_GRID_CLASS}
        style={{ gridTemplateColumns: ASSIGNMENT_STATUS_TABLE_COLUMNS }}
      >
        <TableHeaderLabel className="text-center">기수</TableHeaderLabel>
        <TableHeaderLabel className="text-center">파트</TableHeaderLabel>
        <TableHeaderLabel className="text-center">이름</TableHeaderLabel>
        <TableHeaderLabel className="text-center">할당일</TableHeaderLabel>
        <TableHeaderLabel className="text-center">제출일</TableHeaderLabel>
        <TableHeaderLabel className="text-center">평가일</TableHeaderLabel>
        <TableHeaderLabel className="text-center">제출 상태</TableHeaderLabel>
        <TableHeaderLabel className="text-center">평가 상태</TableHeaderLabel>
      </div>
    </div>
  );
}

interface AssignmentStatusRowProps {
  participant: AdminAssignmentParticipant;
  index: number;
  onClick?: (participant: AdminAssignmentParticipant) => void;
}

function AssignmentStatusRow({
  participant,
  index,
  onClick,
}: AssignmentStatusRowProps) {
  const isClickable = !!onClick;

  const handleClick = () => {
    if (!isClickable) {
      return;
    }

    onClick(participant);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(participant);
    }
  };

  return (
    <div
      className={`${TABLE_ROW_CLASS} ${
        index % 2 === 1 ? "bg-ec-box" : "bg-ec-white"
      } ${
        isClickable ? "cursor-pointer transition-opacity hover:opacity-90" : ""
      }`}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={TABLE_GRID_CLASS}
        style={{ gridTemplateColumns: ASSIGNMENT_STATUS_TABLE_COLUMNS }}
      >
        <span className="text-body-2 text-center whitespace-nowrap">
          {participant.course}기
        </span>
        <span className="text-body-2 text-center whitespace-nowrap">
          {formatPart(participant.part)}
        </span>
        <span
          className="text-body-2 min-w-0 text-center whitespace-nowrap"
          title={participant.name}
        >
          {formatName(participant.name)}
        </span>
        <span className={TABLE_DATE_TEXT_CLASS}>
          {formatKoreanDateTime24(participant.assignedAt)}
        </span>
        <span className={TABLE_DATE_TEXT_CLASS}>
          {participant.submittedAt
            ? formatKoreanDateTime24(participant.submittedAt)
            : "-"}
        </span>
        <span className={TABLE_DATE_TEXT_CLASS}>
          {participant.evaluatedAt
            ? formatKoreanDateTime24(participant.evaluatedAt)
            : "-"}
        </span>
        <span
          className={`text-body-2 text-center whitespace-nowrap ${
            participant.assignmentStatus === "SUBMITTED"
              ? "text-ec-blue"
              : "text-ec-red"
          }`}
        >
          {formatAssignmentStatus(participant.assignmentStatus)}
        </span>
        <span
          className={`text-body-2 text-center whitespace-nowrap ${
            participant.evaluate === "PASS"
              ? "text-ec-blue"
              : participant.evaluate === "FAIL"
                ? "text-ec-red"
                : "text-ec-sub"
          }`}
        >
          {formatEvaluateStatus(participant.evaluate)}
        </span>
      </div>
    </div>
  );
}

interface AssignmentStatusLoadingRowsProps {
  rowCount: number;
}

function AssignmentStatusLoadingRows({
  rowCount,
}: AssignmentStatusLoadingRowsProps) {
  return Array.from({ length: rowCount }, (_, index) => (
    <div
      key={`assignment-status-skeleton-${index}`}
      className={`${TABLE_ROW_CLASS} animate-pulse ${
        index % 2 === 1 ? "bg-ec-box" : "bg-ec-white"
      }`}
    >
      <div
        className={TABLE_GRID_CLASS}
        style={{ gridTemplateColumns: ASSIGNMENT_STATUS_TABLE_COLUMNS }}
      >
        <div className="flex justify-center">
          <SkeletonCell className="h-4 w-7" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-4 w-12" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-4 w-12" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-4 w-12" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-8 w-24" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-8 w-24" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-8 w-24" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-4 w-10" />
        </div>
        <div className="flex justify-center">
          <SkeletonCell className="h-4 w-10" />
        </div>
      </div>
    </div>
  ));
}

interface AssignmentStatusPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function AssignmentStatusPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AssignmentStatusPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-5.5 flex items-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => {
        const isActive = index === currentPage;

        return (
          <button
            key={index}
            type="button"
            className={`hover:bg-ec-table-topic hover:text-ec-white h-6.5 w-6.5 cursor-pointer rounded-full text-sm ${
              isActive
                ? "bg-ec-table-topic text-ec-white"
                : "bg-ec-table-header text-ec-table-topic"
            }`}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

interface AssignmentStatusTableProps {
  participants: readonly AdminAssignmentParticipant[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onParticipantClick?: (participant: AdminAssignmentParticipant) => void;
}

function AssignmentStatusTable({
  participants,
  totalElements,
  totalPages,
  currentPage,
  pageSize,
  isLoading = false,
  onPageChange,
  onParticipantClick,
}: AssignmentStatusTableProps) {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-body-2 text-ec-black">현황</span>
      {participants.length === 0 && !isLoading ? (
        <TableEmptyState label="과제 제출 현황이 아직 없어요." />
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="rounded-ec-10 min-w-full overflow-hidden">
            <AssignmentStatusTableHeader />
            <div className="h-86 overflow-y-auto">
              {isLoading ? (
                <AssignmentStatusLoadingRows
                  rowCount={Math.max(participants.length, pageSize, 3)}
                />
              ) : (
                participants.map((participant, index) => (
                  <AssignmentStatusRow
                    key={participant.submitId}
                    participant={participant}
                    index={index}
                    onClick={onParticipantClick}
                  />
                ))
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <AssignmentStatusPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
          {totalElements > 0 && (
            <div className="text-ec-sub mt-2 text-center text-sm">
              총 {totalElements}건
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default AssignmentStatusTable;
