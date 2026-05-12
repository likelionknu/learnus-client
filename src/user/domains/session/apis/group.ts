import { api } from "@/shared/apis";

export const getSessionUsers = async ({
  sid,
  page = 0,
  size = 8,
}: {
  sid: number;
  page?: number;
  size?: number;
}) => {
  return await api.get(`/v1/sessions/${sid}/users`, {
    params: { page, size },
  });
};
