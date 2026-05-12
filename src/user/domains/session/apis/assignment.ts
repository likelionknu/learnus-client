import { api } from "@/shared/apis";

// 과제 조회
export const getAssignments = async ({
  sid,
  page,
  size = 8,
}: {
  sid: number;
  page: number;
  size?: number;
}) => {
  const res = await api.get(`/v1/sessions/${sid}/assignments`, {
    params: {
      page,
      size,
    },
  });

  return res;
};

export const getAssignmentsDetail = async ({
  sid,
  assignmentId,
}: {
  sid: number;
  assignmentId: number;
}) => {
  const res = await api.get(`/v1/sessions/${sid}/assignments/${assignmentId}`);
  return res;
};

export const postAssignmentSubmission = async ({
  sid,
  assignmentId,
  payload,
}: {
  sid: number;
  assignmentId: number;
  payload: {
    content: string;
  };
}) => {
  const res = await api.post(
    `/v1/sessions/${sid}/assignments/${assignmentId}/submissions`,
    payload,
  );

  return res;
};
