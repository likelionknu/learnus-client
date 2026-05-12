import { formatDateTime } from "@/shared/utils";
import type React from "react";

export interface AssignmentDetail {
  startAt: string;
  endAt: string;
  submittedAt: string | null;
  evaluatedAt: string | null;
  assignmentStatus: "SUBMITTED" | "NOT_SUBMITTED";
  evaluate: "PASS" | "FAIL" | null;
  description: string;
  submissionContent: string;
}

interface AssignmentMetaRow {
  label: string;
  value: React.ReactNode;
}

const AssignmentStatus = {
  NOT_SUBMITTED: "미제출",
  SUBMITTED: "제출",
} as const;

const AssignmentEvaluate = {
  PASS: "합격",
  FAIL: "실패",
} as const;

export function createAssignmentMetaRows(
  assignment: AssignmentDetail,
): AssignmentMetaRow[] {
  return [
    { label: "시작일", value: formatDateTime(assignment.startAt) },
    { label: "마감일", value: formatDateTime(assignment.endAt) },
    {
      label: "제출일",
      value: assignment.submittedAt
        ? formatDateTime(assignment.submittedAt)
        : "-",
    },
    {
      label: "평가일",
      value: assignment.evaluatedAt
        ? formatDateTime(assignment.evaluatedAt)
        : "-",
    },
    {
      label: "제출 상태",
      value: (
        <span
          className={
            assignment.assignmentStatus === "SUBMITTED"
              ? "text-ec-blue"
              : "text-ec-red"
          }
        >
          {AssignmentStatus[assignment.assignmentStatus]}
        </span>
      ),
    },
    {
      label: "평가 상태",
      value: assignment.evaluate ? (
        <span
          className={
            assignment.evaluate === "PASS" ? "text-ec-blue" : "text-ec-red"
          }
        >
          {AssignmentEvaluate[assignment.evaluate]}
        </span>
      ) : (
        "-"
      ),
    },
  ];
}
