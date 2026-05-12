export type AdminAssignmentStatus = "SUBMITTED" | "NOT_SUBMITTED";
export type AdminAssignmentEvaluate = "PASS" | "FAIL" | null;

export interface AdminAssignmentParticipant {
  submitId: number;
  course: number;
  part: string;
  name: string;
  assignedAt: string;
  submittedAt: string | null;
  evaluatedAt: string | null;
  assignmentStatus: AdminAssignmentStatus;
  evaluate: AdminAssignmentEvaluate;
  submissionContent?: string | null;
}

export interface AdminAssignmentSubmitResponse {
  submitId: number;
  course: number;
  part: string;
  name: string;
  startAt: string;
  submittedAt: string | null;
  evaluatedAt: string | null;
  evaluate: AdminAssignmentEvaluate;
  submitted: boolean;
  submissionContent?: string | null;
}

export interface AdminAssignmentSubmitUserDetailResponse {
  submitId: number;
  course: number;
  part: string;
  name: string;
  startAt: string;
  submittedAt: string | null;
  evaluatedAt: string | null;
  assignmentEvaluate: AdminAssignmentEvaluate;
  content: string | null;
  submitted: boolean;
}

export interface AdminAssignmentSubmitsPageResponse {
  content: AdminAssignmentSubmitResponse[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminAssignmentParticipantsPage {
  content: readonly AdminAssignmentParticipant[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminAssignmentDetailResponse {
  assignmentId: number;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdBy: string;
  targetCount: number;
  submittedCount: number;
  unsubmittedCount: number;
}

export interface AdminAssignmentDetail {
  assignmentId: number;
  title: string;
  startAt: string;
  endAt: string;
  createdBy: string;
  participantCount: number;
  submittedCount: number;
  notSubmittedCount: number;
  description: string;
  participants: readonly AdminAssignmentParticipant[];
}
