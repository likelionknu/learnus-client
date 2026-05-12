import axios from "axios";
import { api } from "@/shared/apis";
import type {
  AdminAssignmentDetail,
  AdminAssignmentDetailResponse,
  AdminAssignmentEvaluate,
  AdminAssignmentParticipant,
  AdminAssignmentParticipantsPage,
  AdminAssignmentSubmitsPageResponse,
  AdminAssignmentSubmitUserDetailResponse,
} from "../types";

interface SessionApiErrorPayload {
  code: string | null;
  message: string | null;
}

export interface SessionApiResponse<T> {
  data: T | null;
  error: SessionApiErrorPayload;
}

export interface CreateSessionAssignmentRequest {
  sid: number;
  sessionId: number;
  endAt: string;
  name: string;
  content: string;
}

export interface UpdateAdminAssignmentRequest {
  aid: number;
  endAt: string;
  name: string;
  description: string;
}

export interface UpdateAdminAssignmentSubmitEvaluateRequest {
  sid: number;
  evaluate: Exclude<AdminAssignmentEvaluate, null>;
}

export interface DeleteAdminAssignmentSubmitRequest {
  sid: number;
}

function mapAdminAssignmentDetail(
  data: AdminAssignmentDetailResponse,
): AdminAssignmentDetail {
  return {
    assignmentId: data.assignmentId,
    title: data.name,
    description: data.description,
    startAt: data.startAt,
    endAt: data.endAt,
    createdBy: data.createdBy,
    participantCount: data.targetCount,
    submittedCount: data.submittedCount,
    notSubmittedCount: data.unsubmittedCount,
    participants: [],
  };
}

function mapAdminAssignmentParticipant(
  data: AdminAssignmentSubmitsPageResponse["content"][number],
): AdminAssignmentParticipant {
  return {
    submitId: data.submitId,
    course: data.course,
    part: data.part,
    name: data.name,
    assignedAt: data.startAt,
    submittedAt: data.submittedAt,
    evaluatedAt: data.evaluatedAt,
    assignmentStatus: data.submitted ? "SUBMITTED" : "NOT_SUBMITTED",
    evaluate: data.evaluate,
  };
}

function mapAdminAssignmentParticipantsPage(
  data: AdminAssignmentSubmitsPageResponse,
): AdminAssignmentParticipantsPage {
  return {
    content: data.content.map(mapAdminAssignmentParticipant),
    empty: data.empty,
    first: data.first,
    last: data.last,
    number: data.number,
    size: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
  };
}

function mapAdminAssignmentSubmitUserDetail(
  data: AdminAssignmentSubmitUserDetailResponse,
): AdminAssignmentParticipant {
  return {
    submitId: data.submitId,
    course: data.course,
    part: data.part,
    name: data.name,
    assignedAt: data.startAt,
    submittedAt: data.submittedAt,
    evaluatedAt: data.evaluatedAt,
    assignmentStatus: data.submitted ? "SUBMITTED" : "NOT_SUBMITTED",
    evaluate: data.assignmentEvaluate,
    submissionContent: data.content,
  };
}

const SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  C404: "정보를 찾을 수 없습니다.",
  C403: "정보 조회를 위한 권한이 부족합니다.",
  C401: "인증되지 않은 사용자입니다.",
  C500: "서버 내부 오류가 발생하였습니다.",
};

const SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_STATUS: Record<number, string> = {
  404: SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_CODE.C404,
  403: SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_CODE.C403,
  401: SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_CODE.C401,
  500: SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_CODE.C500,
};

const DEFAULT_CREATE_SESSION_ASSIGNMENT_ERROR_MESSAGE =
  "과제 등록 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
const DEFAULT_UPDATE_ADMIN_ASSIGNMENT_ERROR_MESSAGE =
  "과제 수정 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
const DEFAULT_UPDATE_ADMIN_ASSIGNMENT_SUBMIT_EVALUATE_ERROR_MESSAGE =
  "과제 검토 상태 변경 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
const DEFAULT_DELETE_ADMIN_ASSIGNMENT_SUBMIT_ERROR_MESSAGE =
  "과제 부여 취소 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
const DEFAULT_DELETE_ADMIN_ASSIGNMENT_ERROR_MESSAGE =
  "과제 삭제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";

export async function createSessionAssignment({
  sid,
  ...payload
}: CreateSessionAssignmentRequest) {
  const response = await api.post<SessionApiResponse<null>>(
    `/v1/admin/sessions/${sid}/assignments`,
    payload,
  );

  return response.data;
}

export async function updateAdminAssignment({
  aid,
  ...payload
}: UpdateAdminAssignmentRequest) {
  const response = await api.put<
    SessionApiResponse<AdminAssignmentDetailResponse>
  >(`/v1/admin/assignments/${aid}`, payload);

  return response.data.data
    ? mapAdminAssignmentDetail(response.data.data)
    : null;
}

export async function updateAdminAssignmentSubmitEvaluate({
  sid,
  evaluate,
}: UpdateAdminAssignmentSubmitEvaluateRequest) {
  const response = await api.patch<SessionApiResponse<null>>(
    `/v1/admin/assignments/${sid}/submits`,
    {
      evaluate,
    },
  );

  return response.data;
}

export async function deleteAdminAssignmentSubmit({
  sid,
}: DeleteAdminAssignmentSubmitRequest) {
  const response = await api.delete<SessionApiResponse<null>>(
    `/v1/admin/assignments/${sid}/submits`,
  );

  return response.data;
}

export async function deleteAdminAssignment({ aid }: { aid: number }) {
  await api.delete<SessionApiResponse<null>>(`/v1/admin/assignments/${aid}`);
}

export async function getAdminAssignmentDetail({ aid }: { aid: number }) {
  const response = await api.get<
    SessionApiResponse<AdminAssignmentDetailResponse>
  >(`/v1/admin/assignments/${aid}`);

  return response.data.data
    ? mapAdminAssignmentDetail(response.data.data)
    : null;
}

export async function getAdminAssignmentSubmits({
  aid,
  page,
}: {
  aid: number;
  page: number;
}) {
  const response = await api.get<
    SessionApiResponse<AdminAssignmentSubmitsPageResponse>
  >(`/v1/admin/assignments/${aid}/submits`, {
    params: {
      page,
    },
  });

  return response.data.data
    ? mapAdminAssignmentParticipantsPage(response.data.data)
    : null;
}

export async function getAdminAssignmentSubmitUserDetail({
  submitId,
}: {
  submitId: number;
}) {
  const response = await api.get<
    SessionApiResponse<AdminAssignmentSubmitUserDetailResponse>
  >(`/v1/admin/assignments/${submitId}/submits/users`);

  return response.data.data
    ? mapAdminAssignmentSubmitUserDetail(response.data.data)
    : null;
}

function getSessionAssignmentErrorMessage(
  error: unknown,
  defaultMessage: string,
) {
  if (axios.isAxiosError<SessionApiResponse<null>>(error)) {
    const backendError = error.response?.data?.error;

    return (
      backendError?.message?.trim() ||
      (backendError?.code
        ? SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_CODE[backendError.code]
        : undefined) ||
      (error.response?.status
        ? SESSION_ASSIGNMENT_ERROR_MESSAGE_BY_STATUS[error.response.status]
        : undefined) ||
      error.message ||
      defaultMessage
    );
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return defaultMessage;
}

export function getCreateSessionAssignmentErrorMessage(error: unknown) {
  return getSessionAssignmentErrorMessage(
    error,
    DEFAULT_CREATE_SESSION_ASSIGNMENT_ERROR_MESSAGE,
  );
}

export function getUpdateAdminAssignmentErrorMessage(error: unknown) {
  return getSessionAssignmentErrorMessage(
    error,
    DEFAULT_UPDATE_ADMIN_ASSIGNMENT_ERROR_MESSAGE,
  );
}

export function getUpdateAdminAssignmentSubmitEvaluateErrorMessage(
  error: unknown,
) {
  return getSessionAssignmentErrorMessage(
    error,
    DEFAULT_UPDATE_ADMIN_ASSIGNMENT_SUBMIT_EVALUATE_ERROR_MESSAGE,
  );
}

export function getDeleteAdminAssignmentSubmitErrorMessage(error: unknown) {
  return getSessionAssignmentErrorMessage(
    error,
    DEFAULT_DELETE_ADMIN_ASSIGNMENT_SUBMIT_ERROR_MESSAGE,
  );
}

export function getDeleteAdminAssignmentErrorMessage(error: unknown) {
  return getSessionAssignmentErrorMessage(
    error,
    DEFAULT_DELETE_ADMIN_ASSIGNMENT_ERROR_MESSAGE,
  );
}
