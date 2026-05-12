import axios from "axios";
import type { ApiResponse, AuthErrorInfo, AuthErrorReason } from "@auth/types";

const BACKEND_ERROR_REASON_BY_CODE: Record<string, AuthErrorReason> = {
  C401: "unauthorized",
  C4012: "invalid-code",
  C403: "forbidden",
  C4032: "whitelist",
  C404: "not-found",
  C500: "server",
};

function isAuthErrorReason(value: string): value is AuthErrorReason {
  return (
    value === "whitelist" ||
    value === "invalid-code" ||
    value === "unauthorized" ||
    value === "forbidden" ||
    value === "not-found" ||
    value === "server" ||
    value === "oauth" ||
    value === "config" ||
    value === "unknown"
  );
}

export function getAuthErrorReason(
  code: string | null,
  status?: number,
): AuthErrorReason {
  if (code && BACKEND_ERROR_REASON_BY_CODE[code]) {
    return BACKEND_ERROR_REASON_BY_CODE[code];
  }

  if (status === 401) {
    return "unauthorized";
  }

  if (status === 403) {
    return "forbidden";
  }

  if (status === 404) {
    return "not-found";
  }

  if (status === 500) {
    return "server";
  }

  return "unknown";
}

export function getDefaultAuthErrorMessage(
  reason: AuthErrorReason | string | null,
) {
  switch (reason) {
    case "whitelist":
      return "화이트리스트에 등록되지 않은 사용자입니다.";
    case "invalid-code":
      return "올바르지 않은 Google 인가 코드입니다.";
    case "unauthorized":
      return "인증되지 않은 사용자입니다.";
    case "forbidden":
      return "정보 조회를 위한 권한이 부족합니다.";
    case "not-found":
      return "정보를 찾을 수 없습니다.";
    case "server":
      return "서버 내부 오류가 발생하였습니다.";
    case "oauth":
      return "Google 로그인 진행 중 오류가 발생했어요.";
    case "config":
      return "로그인 설정이 올바르지 않습니다. 관리자에게 문의해주세요.";
    default:
      return "로그인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
  }
}

export function createAuthErrorInfo({
  reason,
  code = null,
  message,
  status,
}: {
  reason?: AuthErrorReason;
  code?: string | null;
  message?: string | null;
  status?: number;
}): AuthErrorInfo {
  const resolvedReason = reason ?? getAuthErrorReason(code, status);

  return {
    reason: resolvedReason,
    code,
    message: message?.trim() || getDefaultAuthErrorMessage(resolvedReason),
    status,
  };
}

export class AuthFlowError extends Error {
  readonly info: AuthErrorInfo;

  constructor(info: AuthErrorInfo) {
    super(info.message);
    this.name = "AuthFlowError";
    this.info = info;
    Object.setPrototypeOf(this, AuthFlowError.prototype);
  }
}

export function normalizeAuthError(error: unknown): AuthErrorInfo {
  if (error instanceof AuthFlowError) {
    return error.info;
  }

  if (axios.isAxiosError<ApiResponse<never>>(error)) {
    const backendError = error.response?.data?.error;

    return createAuthErrorInfo({
      code: backendError?.code ?? null,
      message: backendError?.message ?? error.message,
      status: error.response?.status,
    });
  }

  if (error instanceof Error) {
    return createAuthErrorInfo({
      message: error.message,
    });
  }

  return createAuthErrorInfo({});
}

export function buildLoginErrorPath(error: AuthErrorInfo) {
  const searchParams = new URLSearchParams();

  searchParams.set("reason", error.reason);

  if (error.code) {
    searchParams.set("code", error.code);
  }

  if (error.message) {
    searchParams.set("message", error.message);
  }

  return `/auth/login-error?${searchParams.toString()}`;
}

export function readAuthErrorFromSearchParams(searchParams: URLSearchParams) {
  const reason = searchParams.get("reason");

  return createAuthErrorInfo({
    reason: reason && isAuthErrorReason(reason) ? reason : undefined,
    code: searchParams.get("code"),
    message: searchParams.get("message"),
  });
}

export function getGoogleOAuthErrorMessage(error: string | null) {
  if (error === "access_denied") {
    return "Google 로그인 동의가 취소되었습니다.";
  }

  return "Google 로그인 진행 중 오류가 발생했어요.";
}
