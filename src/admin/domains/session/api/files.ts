import { api } from "@/shared/apis";

export const getSessionFile = (sid: number, fid: number) => {
  return api.get(`/v1/admin/sessions/${sid}/files/${fid}`);
};

export const modifySessionFile = (
  sid: number,
  fid: number,
  data: { name: string; content: string },
) => {
  return api.put(`/v1/admin/sessions/${sid}/files/${fid}`, data);
};

export const deleteSessionFile = (sid: number, fid: number) => {
  return api.delete(`/v1/admin/sessions/${sid}/files/${fid}`);
};

export const getPresignedUrl = async ({
  fileName,
  contentType,
}: {
  fileName: string;
  contentType: string;
}) => {
  const res = await api.post("/v1/admin/files", {
    fileName,
    contentType,
  });
  return res;
};

export const toggleSessionFileStatus = (
  sid: number,
  fid: number,
  isPublic: boolean,
) => {
  return api.patch(`/v1/admin/sessions/${sid}/files/${fid}/public`, {
    isPublic,
  });
};
export const createSessionFile = async (
  sid: number,
  name: string,
  content: string,
) => {
  const res = await api.post(`/v1/admin/sessions/${sid}/files`, {
    name,
    content,
  });

  return res.data;
};
