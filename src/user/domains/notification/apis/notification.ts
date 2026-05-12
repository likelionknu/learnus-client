import { api } from "@/shared/apis";

// 알림 조회
export const getNotification = async ({
  page,
  size = 8,
}: {
  page: number;
  size?: number;
}) => {
  const res = await api.get("/v1/notifications", {
    params: {
      page,
      size,
    },
  });

  return res;
};

// 알림 개별 읽음
export const readNotification = async ({ nid }: { nid: number }) => {
  const res = await api.post(`/v1/notifications/${nid}/read`);

  return res;
};

// 알림 전체 읽음
export const readAllNotification = async () => {
  const res = await api.post("/v1/notifications/read-all");

  return res;
};

// 알림 전체 삭제
export const deleteAllNotification = async () => {
  const res = await api.delete("/v1/notifications");

  return res;
};

// 읽은 알림 삭제
export const deleteReadNotification = async () => {
  const res = await api.delete("/v1/notifications/read");

  return res;
};
