import { api } from "@/shared/apis";

interface sessionsQuestionProps {
  qid: number | undefined;
  sid: number | undefined;
}

// 세션 질문 상세 조회
export const getSessionQuestion = async ({
  qid,
  sid,
}: sessionsQuestionProps) => {
  const res = await api.get(`/v1/questions/${qid}/sessions/${sid}`);

  return res;
};

// 세션 질문 삭제
export const deleteSessionQuestions = async ({ qid }: { qid: number }) => {
  const res = await api.delete(`/v1/questions/${qid}`);

  return res;
};
