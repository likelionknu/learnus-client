import { api } from "@/shared/apis";
import type { SessionFileDetail, SessionFilesResponse } from "../types";

export const getSessionFiles = async ({
  sid,
  page = 0,
  size = 8,
}: {
  sid: number;
  page?: number;
  size?: number;
}) => {
  const res = await api.get<SessionFilesResponse>(`/v1/sessions/${sid}/files`, {
    params: { page, size },
  });
  return res.data;
};

export const getSpecificFile = async ({ fileId }: { fileId: number }) => {
  const res = await api.get<SessionFileDetail>(`/v1/files/${fileId}`);

  return res.data.data;
};
