import { api } from "@/shared/apis";
import type { CreateQuestion } from "../types";

// 세션 질문 조회
export const getSessionQuestions = async ({
  sid,
  page,
  size = 8,
}: {
  sid: number;
  page: number;
  size?: number;
}) => {
  const res = await api.get(`/v1/questions/sessions/${sid}`, {
    params: {
      page,
      size,
    },
  });

  return res;
};

// 세션 질문 등록
export const postSessionQuestions = async ({
  sid,
  payload,
}: {
  sid: number;
  payload: CreateQuestion;
}) => {
  const res = await api.post(`/v1/questions/sessions/${sid}`, payload);

  return res;
};
