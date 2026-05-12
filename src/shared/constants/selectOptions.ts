import type { QuestionRequestStatus, UserRequestStatus } from "@/shared/types";

export const ADMIN_GROUP_PART_DEFAULT = "정렬";

export const ADMIN_DASHBOARD_PART_DEFAULT = "또는 파트 선택";

export const QUESTION_STATUS_OPTIONS = ["전체", "완료", "대기"];

export const QUESTION_STATUS_DEFAULT_OPTION = QUESTION_STATUS_OPTIONS[0];

export const QUESTION_STATUS_OPTION_TO_REQUEST_STATUS: Record<
  string,
  QuestionRequestStatus
> = {
  [QUESTION_STATUS_OPTIONS[0]]: "ALL",
  [QUESTION_STATUS_OPTIONS[1]]: "COMPLETED",
  [QUESTION_STATUS_OPTIONS[2]]: "PENDING",
};

export const SESSION_PART_OPTIONS = [
  "전체",
  "운영진",
  "기획",
  "백엔드",
  "프론트엔드",
  "디자인",
];

export const SESSION_PARTS_DEFAULT_OPTION = SESSION_PART_OPTIONS[0];

export const SESSION_PART_OPTIONS_TO_REQUEST_STATUS: Record<
  string,
  UserRequestStatus
> = {
  [QUESTION_STATUS_OPTIONS[0]]: "ALL",
  [QUESTION_STATUS_OPTIONS[1]]: "OPERATOR",
  [QUESTION_STATUS_OPTIONS[2]]: "PLANNING",
  [QUESTION_STATUS_OPTIONS[2]]: "BACKEND",
  [QUESTION_STATUS_OPTIONS[2]]: "FRONTEND",
  [QUESTION_STATUS_OPTIONS[2]]: "DESIGN",
};
