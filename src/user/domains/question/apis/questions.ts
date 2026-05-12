import { api } from "@/shared/apis";
import type { QuestionRequestStatus } from "@/shared/types";

interface GetQuestionsParams {
  title: string;
  status: QuestionRequestStatus;
  page: number;
  size?: number;
}

export const getQuestions = async ({
  title,
  status,
  page,
  size = 8,
}: GetQuestionsParams) => {
  const res = await api.get("/v1/questions", {
    params: { title, status, page, size },
  });

  return res;
};
