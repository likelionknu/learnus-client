import { api } from "@/shared/apis";
import type { AdminQuestionDetail, AdminQuestionDetailResponse } from "../types";

interface AdminQuestionApiErrorPayload {
  code: string | null;
  message: string | null;
}

interface AdminQuestionApiResponse<T> {
  data: T | null;
  error: AdminQuestionApiErrorPayload;
}

function mapAdminQuestionDetail(
  data: AdminQuestionDetailResponse,
  fallbackQuestionId?: number,
): AdminQuestionDetail {
  return {
    questionId: data.questionId ?? data.id ?? fallbackQuestionId ?? 0,
    title: data.name ?? data.title ?? "",
    createdAt: data.createdAt,
    createdBy: data.createdBy ?? data.createdUserName ?? "-",
    answeredAt: data.answeredAt,
    answeredBy: data.answeredBy ?? data.answeredUserName ?? null,
    status: data.status,
    question: data.content,
    answer: data.answer,
    comments: [],
  };
}

export const getAdminQuestionDetail = async ({ qid }: { qid: number }) => {
  const response = await api.get<
    AdminQuestionApiResponse<AdminQuestionDetailResponse>
  >(`/v1/admin/questions/${qid}`);

  return response.data.data
    ? mapAdminQuestionDetail(response.data.data, qid)
    : null;
};

export const updateAdminQuestionAnswer = async ({
  qid,
  answer,
}: {
  qid: number;
  answer: string;
}) => {
  const response = await api.put<
    AdminQuestionApiResponse<AdminQuestionDetailResponse>
  >(`/v1/admin/questions/${qid}`, { answer });

  return response.data.data
    ? mapAdminQuestionDetail(response.data.data, qid)
    : null;
};

export const deleteAdminQuestion = async ({ qid }: { qid: number }) => {
  await api.delete<AdminQuestionApiResponse<null>>(
    `/v1/admin/questions/${qid}`,
  );
};
