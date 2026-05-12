import { api } from "@/shared/apis";

export const getComments = async ({ qid }: { qid: number }) => {
  const res = await api.get(`/v1/questions/${qid}/comments`);

  return res;
};

export const createComment = async ({
  qid,
  content,
}: {
  qid: number;
  content: string;
}) => {
  const res = await api.post(`/v1/questions/${qid}/comments`, { content });

  return res;
};

export const deleteComment = async ({ cid }: { cid: number }) => {
  const res = await api.delete(`/v1/questions/${cid}/comments`);

  return res;
};
