import axios from "axios";

interface QuestionApiErrorPayload {
  code: string | null;
  message: string | null;
}

interface QuestionApiResponse<T> {
  data: T | null;
  error: QuestionApiErrorPayload;
}

export interface CommonErrorState {
  status: string;
  message: string;
}

const QUESTION_ERROR_MESSAGE_BY_STATUS: Record<number, string> = {
  400: "잘못된 요청입니다.",
  401: "인증되지 않은 사용자입니다.",
  403: "정보 조회를 위한 권한이 부족합니다.",
  404: "정보를 찾을 수 없습니다.",
  500: "서버 내부 오류가 발생하였습니다.",
};

const QUESTION_STATUS_BY_CODE: Record<string, number> = {
  C400: 400,
  C404: 404,
  C403: 403,
  C401: 401,
  C500: 500,
};

function resolveCommonErrorByStatus(status: number): CommonErrorState {
  const resolvedStatus = QUESTION_ERROR_MESSAGE_BY_STATUS[status]
    ? status
    : 500;

  return {
    status: String(resolvedStatus),
    message: QUESTION_ERROR_MESSAGE_BY_STATUS[resolvedStatus],
  };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getCommonErrorState(error: unknown): CommonErrorState {
  if (axios.isAxiosError<QuestionApiResponse<null>>(error)) {
    const status = error.response?.status;

    if (typeof status === "number") {
      return resolveCommonErrorByStatus(status);
    }

    const code = error.response?.data?.error?.code;
    const statusByCode =
      code && QUESTION_STATUS_BY_CODE[code]
        ? QUESTION_STATUS_BY_CODE[code]
        : undefined;

    if (typeof statusByCode === "number") {
      return resolveCommonErrorByStatus(statusByCode);
    }

    return resolveCommonErrorByStatus(500);
  }

  if (isObjectRecord(error)) {
    const status = error.status;

    if (typeof status === "number") {
      return resolveCommonErrorByStatus(status);
    }

    const maybeError = error.error;

    if (isObjectRecord(maybeError)) {
      const code = maybeError.code;
      const statusByCode =
        typeof code === "string" && QUESTION_STATUS_BY_CODE[code]
          ? QUESTION_STATUS_BY_CODE[code]
          : undefined;

      if (typeof statusByCode === "number") {
        return resolveCommonErrorByStatus(statusByCode);
      }
    }
  }

  return resolveCommonErrorByStatus(500);
}

export type QuestionErrorState = CommonErrorState;
export const getQuestionsErrorState = getCommonErrorState;
