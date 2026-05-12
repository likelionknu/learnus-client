import { api } from "@/shared/apis";

// 모든 세션 조회
export const getSessions = async () => {
  const res = await api.get("/v1/admin/sessions");

  return res;
};

// 세션 생성
export const createSession = async ({ name }: { name: string }) => {
  const res = await api.post("/v1/admin/sessions", { name });

  return res;
};
