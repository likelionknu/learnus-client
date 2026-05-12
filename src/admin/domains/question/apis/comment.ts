import { api } from "@/shared/apis";
import { formatDaysAgo } from "@/shared/utils";
import type { AdminQuestionComment, AdminQuestionCommentResponse } from "../types";

interface AdminQuestionCommentApiErrorPayload {
  code: string | null;
  message: string | null;
}

interface AdminQuestionCommentApiResponse<T> {
  data: T | null;
  error: AdminQuestionCommentApiErrorPayload;
}

function mapAdminQuestionComment(
  data: AdminQuestionCommentResponse,
): AdminQuestionComment {
  return {
    id: data.id,
    author: data.createdUserName,
    createdLabel: formatDaysAgo(data.createdAt),
    content: data.content,
    isMine: data.isMine ?? data.mine ?? false,
  };
}

export const getAdminQuestionComments = async ({ qid }: { qid: number }) => {
  const response = await api.get<
    AdminQuestionCommentApiResponse<readonly AdminQuestionCommentResponse[]>
  >(`/v1/admin/questions/${qid}/comments`);

  const responseData = response.data.data;

  return Array.isArray(responseData)
    ? responseData.map(mapAdminQuestionComment)
    : [];
};

export const createAdminQuestionComment = async ({
  qid,
  content,
}: {
  qid: number;
  content: string;
}) => {
  const response = await api.post<
    AdminQuestionCommentApiResponse<AdminQuestionCommentResponse>
  >(`/v1/admin/questions/${qid}/comments`, { content });

  return response.data.data
    ? mapAdminQuestionComment(response.data.data)
    : null;
};

export const deleteAdminQuestionComment = async ({
  commentId,
}: {
  commentId: number;
}) => {
  await api.delete(`/v1/admin/questions/${commentId}/comments`);
};
