import { api } from "@/shared/apis";
import type { ApiResponse, LoginResponseData } from "@auth/types";

// interface ReissueTokenResponseData {
//   access_token: string;
//   refresh_token: string;
// }
//
// export const refreshToken = async (refreshTokenValue: string) => {
//   const res = await api.post<ApiResponse<ReissueTokenResponseData>>(
//     "/v1/auth/reissue",
//     {
//       refresh_token: refreshTokenValue,
//     },
//   );
//
//   return res;
// };

export const lerarnusLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await api.post<ApiResponse<LoginResponseData>>("/v1/auth/login", {
    email,
    password,
  });

  return res;
};
