import { api } from "@/shared/apis";

// 세션 정보 조회
export const getSessionInfo = async ({ sid }: { sid: number }) => {
  const res = await api.get(`/v1/admin/sessions/${sid}`);

  return res;
};

// 세션 사용자 조회
export const getSessionMember = async ({
  sid,
  page = 0,
  size = 8,
}: {
  sid: number;
  page?: number;
  size?: number;
}) => {
  const res = await api.get(`/v1/admin/sessions/${sid}/users`, {
    params: { page, size },
  });

  return res;
};

// 세션 정보 수정
export const editSessionInfo = async ({
  sid,
  name,
  useable,
}: {
  sid: number;
  name: string;
  useable: boolean;
}) => {
  const res = await api.put(`/v1/admin/sessions/${sid}`, { name, useable });

  return res;
};

// 사용자 검색
export const serachUser = async ({ keyword }: { keyword: string }) => {
  const res = await api.get("/v1/admin/users/search", {
    params: {
      keyword,
    },
  });

  return res;
};

// 사용자 추가
type AddMembersPayload =
  | {
      sid: number;
      part: string;
      userIds?: never;
    }
  | {
      sid: number;
      userIds: number[];
      part?: never;
    };

const VALID_SESSION_PARTS = new Set([
  "OPERATOR",
  "PLANNING",
  "BACKEND",
  "FRONTEND",
  "DESIGN",
]);

export const addMembers = async ({
  sid,
  userIds,
  part,
}: AddMembersPayload) => {
  const normalizedPart = typeof part === "string" ? part.trim() : "";
  const requestBody = VALID_SESSION_PARTS.has(normalizedPart)
    ? { part: normalizedPart }
    : { userIds };
  const res = await api.post(`/v1/admin/sessions/${sid}/users`, requestBody);

  return res;
};

// 사용자 제거
export const deleteMember = async ({
  sid,
  userId,
}: {
  sid: number;
  userId: number;
}) => {
  const res = await api.delete(`/v1/admin/sessions/${sid}/users`, {
    data: { userId },
  });

  return res;
};
