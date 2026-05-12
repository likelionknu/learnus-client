import { api } from "@/shared/apis";

export const uploadNotice = async (title: string, content: string) => {
  const res = await api.post(`/v1/admin/notices`, {
    title,
    content,
  });
  return res.data;
};

export const getNoticeDetail = (nid: number) => {
  return api.get(`/v1/admin/notices/${nid}`);
};

export const pinNotice = (nid: number) => {
  return api.post(`/v1/admin/notices/${nid}/pin`);
};

export const unpinNotice = (nid: number) => {
  return api.post(`/v1/admin/notices/${nid}/unpin`);
};

export const modifyNotice = (
  nid: number,
  data: { title: string; content: string },
) => {
  return api.put(`/v1/admin/notices/${nid}`, data);
};

export const deleteNotice = (nid: number) => {
  return api.delete(`/v1/admin/notices/${nid}`);
};
