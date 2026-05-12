import { useEffect, type ReactNode } from "react";
import { Modal } from "@/shared/components/modal";
import { formatAssignmentStatus, formatEvaluateStatus } from "@/user/utils";
import type { AdminAssignmentParticipant } from "../../types";

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

function formatCompactDateTime(value: string) {
  const normalized = value.trim();
  const matched = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/,
  );

  if (matched) {
    return `${matched[1]}.${matched[2]}.${matched[3]} ${matched[4]}:${matched[5]}`;
  }

  const fallbackDate = new Date(normalized);

  if (Number.isNaN(fallbackDate.getTime())) {
    return value;
  }

  const year = fallbackDate.getFullYear();
  const month = String(fallbackDate.getMonth() + 1).padStart(2, "0");
  const day = String(fallbackDate.getDate()).padStart(2, "0");
  const hour = String(fallbackDate.getHours()).padStart(2, "0");
  const minute = String(fallbackDate.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

function DetailStatusValue({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return <span className={`font-medium ${className}`}>{children}</span>;
}

function ActionButton({
  className,
  children,
  onClick,
  disabled = false,
}: {
  className: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-ec-10 font-pretendard text-ec-gnb-white inline-flex items-center justify-center gap-2.5 overflow-hidden px-3.5 py-2 text-sm font-medium whitespace-nowrap ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className}`}
    >
      {children}
    </button>
  );
}

interface AssignmentSubmitDetailModalProps {
  participant: AdminAssignmentParticipant;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onCancelAssignment: () => void;
  isActionPending?: boolean;
  isDetailLoading?: boolean;
}

function AssignmentSubmitDetailModal({
  participant,
  onClose,
  onApprove,
  onReject,
  onCancelAssignment,
  isActionPending = false,
  isDetailLoading = false,
}: AssignmentSubmitDetailModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const rawSubmissionContent = participant.submissionContent;
  const submissionContent =
    typeof rawSubmissionContent === "string"
      ? rawSubmissionContent.trim()
      : "";
  const isSubmissionLink = /^https?:\/\//i.test(submissionContent);
  const isSubmittedParticipant = participant.assignmentStatus === "SUBMITTED";
  const detailRows = [
    {
      label: "제출 ID",
      value: participant.submitId,
      valueClassName: "text-ec-sub",
    },
    {
      label: "기수",
      value: `${participant.course}기`,
      valueClassName: "text-ec-sub",
    },
    {
      label: "파트",
      value: formatPart(participant.part),
      valueClassName: "text-ec-sub",
    },
    {
      label: "이름",
      value: participant.name,
      valueClassName: "text-ec-sub",
    },
    {
      label: "할당일",
      value: formatCompactDateTime(participant.assignedAt),
      valueClassName: "text-ec-sub",
    },
    {
      label: "제출일",
      value: participant.submittedAt
        ? formatCompactDateTime(participant.submittedAt)
        : "-",
      valueClassName: "text-ec-sub",
    },
    {
      label: "평가일",
      value: participant.evaluatedAt
        ? formatCompactDateTime(participant.evaluatedAt)
        : "-",
      valueClassName: "text-ec-sub",
    },
    {
      label: "제출 상태",
      value: formatAssignmentStatus(participant.assignmentStatus),
      valueClassName:
        participant.assignmentStatus === "SUBMITTED"
          ? "text-ec-blue"
          : "text-ec-red",
    },
    {
      label: "평가 상태",
      value: formatEvaluateStatus(participant.evaluate),
      valueClassName:
        participant.evaluate === "PASS"
          ? "text-ec-blue"
          : participant.evaluate === "FAIL"
            ? "text-ec-red"
            : "text-ec-sub",
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="모달 닫기"
        className="fixed inset-0 bg-black/20 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div className="bg-ec-white border-ec-outline rounded-ec-10 relative z-110 flex h-117.25 w-168.5 max-w-[calc(100vw-32px)] flex-col overflow-y-auto border px-7.5 py-8">
        <Modal.Header onClick={onClose}>
          <div className="text-ec-black font-pretendard w-144.5 max-w-full justify-start text-base font-semibold">
            과제 상세보기
          </div>
        </Modal.Header>

        <div className="mt-3.75 flex flex-wrap gap-2.5">
          {isSubmittedParticipant && (
            <ActionButton
              className="bg-ec-blue"
              onClick={onApprove}
              disabled={isActionPending || isDetailLoading}
            >
              성공으로 검토
            </ActionButton>
          )}
          {isSubmittedParticipant && (
            <ActionButton
              className="bg-ec-red"
              onClick={onReject}
              disabled={isActionPending || isDetailLoading}
            >
              실패로 검토
            </ActionButton>
          )}
          <ActionButton
            className="bg-ec-red"
            onClick={onCancelAssignment}
            disabled={isActionPending || isDetailLoading}
          >
            사용자 과제 부여 취소
          </ActionButton>
        </div>

        <div className="bg-ec-box rounded-ec-10 mt-7 w-full px-12 py-5">
          <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-y-3">
            {detailRows.map((row) => (
              <div key={row.label} className="contents">
                <div className="text-ec-black font-pretendard text-xs font-medium">
                  {row.label}
                </div>
                <DetailStatusValue
                  className={`font-pretendard min-w-0 text-xs ${row.valueClassName}`}
                >
                  {row.value}
                </DetailStatusValue>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2.5">
          <h2 className="text-ec-black text-[16px] font-semibold">제출 내용</h2>
          <div className="bg-ec-box rounded-ec-10 mt-2.75 flex min-h-11.5 w-full items-start px-7 py-4">
            <div className="text-ec-black font-pretendard w-138.5 max-w-full justify-start text-xs leading-5 font-medium break-all">
              {isDetailLoading ? (
                <span className="text-ec-sub">제출 내용을 불러오는 중이에요.</span>
              ) : rawSubmissionContent === undefined ? (
                <span className="text-ec-sub">제출 내용을 불러오지 못했어요.</span>
              ) : submissionContent ? (
                isSubmissionLink ? (
                  <a
                    href={submissionContent}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {submissionContent}
                  </a>
                ) : (
                  <span className="whitespace-pre-wrap">
                    {submissionContent}
                  </span>
                )
              ) : (
                <span className="text-ec-sub">
                  제출 내용 정보가 아직 없어요.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmitDetailModal;
