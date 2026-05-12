import { api } from "@/shared/apis";
import type { whitelistState } from "../types/whitelist";

interface GetUsersParams {
  name: string;
  part: string;
  page: number;
  size?: number;
}

// 사용자 조회
export const getUsers = async ({
  name,
  part,
  page,
  size = 8,
}: GetUsersParams) => {
  const res = await api.get("/v1/admin/users", {
    params: {
      name,
      part,
      page,
      size,
    },
  });

  return res;
};

// 사용자 이용 정지
export const suspendUser = async ({ uid }: { uid: number | string }) => {
  const res = await api.patch(`/v1/admin/users/${uid}/terminates`);

  return res;
};

// 사용자 이용 재개
export const reactiveUser = async ({ uid }: { uid: number | string }) => {
  const res = await api.patch(`/v1/admin/users/${uid}/terminates`);

  return res;
};

// 레거시 호환용 alias
export const terminateUser = suspendUser;

// 화이트리스트 조회
export const getWHiteList = async () => {
  const res = await api.get("/v1/admin/whitelist");

  return res;
};

// 화이트리스트 유저 추가
export const addWhiteList = async ({ email, part, course }: whitelistState) => {
  const res = await api.post("/v1/admin/whitelist", {
    email,
    part,
    course,
  });

  return res;
};

// 화이트리스트 유저 삭제
export const deleteWhitelist = async ({ wid }: { wid: number }) => {
  const res = await api.delete(`/v1/admin/whitelist/${wid}`);

  return res;
};

// 메모 조회
export const getMemos = async ({ uid }: { uid: number }) => {
  const res = await api.get(`/v1/admin/users/${uid}/memos`);

  return res;
};

// 메모 추가
export const addMemo = async ({
  uid,
  content,
}: {
  uid: number;
  content: string;
}) => {
  const res = await api.post(`/v1/admin/users/${uid}/memos`, { content });

  return res;
};

// 메모 삭제
export const deleteMemo = async ({
  uid,
  mid,
}: {
  uid: number;
  mid: number;
}) => {
  const res = await api.delete(`/v1/admin/users/${uid}/memos/${mid}`);

  return res;
};

// 메모 전체 삭제
export const deleteAllMemos = async ({ uid }: { uid: number }) => {
  const res = await api.delete(`/v1/admin/users/${uid}/allMemos`);

  return res;
};

// 파트 변경
export const changePart = async ({
  uid,
  part,
}: {
  uid: number;
  part: string;
}) => {
  const res = await api.patch(`/v1/admin/users/${uid}/profile/part`, { part });

  return res;
};

// 기수 변경
export const changeGeneration = async ({
  uid,
  course,
}: {
  uid: number;
  course: number;
}) => {
  const res = await api.patch(`/v1/admin/users/${uid}/profile/generation`, {
    course,
  });

  return res;
};

// 벌점 조회
export const getDemerits = async ({ uid }: { uid: number }) => {
  const res = await api.get(`/v1/admin/users/${uid}/demerits`);

  return res;
};

// 벌점 추가
export const addDemerit = async ({
  uid,
  demerit,
  reason,
}: {
  uid: number;
  demerit: number;
  reason: string;
}) => {
  const res = await api.post(`/v1/admin/users/${uid}/demerits`, {
    demerit,
    reason,
  });

  return res;
};

// 벌점 삭제
export const deleteDemerit = async ({
  uid,
  did,
}: {
  uid: number;
  did: number;
}) => {
  const res = await api.delete(`/v1/admin/users/${uid}/demerits/${did}`);

  return res;
};

// 모든 벌점 삭제
export const deleteAllDemerits = async ({ uid }: { uid: number }) => {
  const res = await api.delete(`/v1/admin/users/${uid}/demerits`);

  return res;
};
