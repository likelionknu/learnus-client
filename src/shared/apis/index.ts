import axios, { AxiosHeaders } from "axios";

type PersistedAuthState = {
  state?: {
    session?: {
      accessToken?: string;
      // refreshToken?: string;
    } | null;
  } | null;
};

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const AUTH_STORAGE_KEY = "ecampus.auth.session";

function getStoredAuthState() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedAuthState;
  } catch {
    return null;
  }
}

function getStoredAccessToken() {
  const parsed = getStoredAuthState();

  return parsed?.state?.session?.accessToken ?? null;
}

// type ApiErrorResponse = {
//   error?: {
//     code?: string | null;
//   } | null;
// };
//
// type ReissueApiResponse = {
//   data?: {
//     access_token?: string | null;
//     refresh_token?: string | null;
//   } | null;
//   error?: {
//     message?: string | null;
//   } | null;
// };
//
// type SessionTokens = {
//   accessToken: string;
//   refreshToken: string;
// };
//
// type RetryableRequestConfig = InternalAxiosRequestConfig & {
//   _retry?: boolean;
// };
//
// function getStoredSessionTokens() {
//   const parsed = getStoredAuthState();
//
//   return {
//     accessToken: parsed?.state?.session?.accessToken ?? null,
//     refreshToken: parsed?.state?.session?.refreshToken ?? null,
//   };
// }
//
// function setStoredSessionTokens(tokens: SessionTokens) {
//   if (typeof window === "undefined") {
//     return;
//   }
//
//   const parsed = getStoredAuthState();
//   const nextState: PersistedAuthState = {
//     ...(parsed ?? {}),
//     state: {
//       ...(parsed?.state ?? {}),
//       session: {
//         ...(parsed?.state?.session ?? {}),
//         accessToken: tokens.accessToken,
//         refreshToken: tokens.refreshToken,
//       },
//     },
//   };
//
//   window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
// }
//
// function clearStoredSession() {
//   if (typeof window === "undefined") {
//     return;
//   }
//
//   window.localStorage.removeItem(AUTH_STORAGE_KEY);
// }
//
// let refreshPromise: Promise<SessionTokens> | null = null;
//
// const reissueAccessToken = async (): Promise<SessionTokens> => {
//   if (refreshPromise) {
//     return refreshPromise;
//   }
//
//   refreshPromise = (async () => {
//     const { refreshToken } = getStoredSessionTokens();
//     if (!refreshToken) throw new Error("No refresh token");
//
//     const response = await axios.post<ReissueApiResponse>(
//       "/v1/auth/reissue",
//       { refresh_token: refreshToken },
//       {
//         baseURL: BASE_API_URL,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//
//     const nextAccessToken = response.data?.data?.access_token;
//     const nextRefreshToken = response.data?.data?.refresh_token;
//
//     if (!nextAccessToken || !nextRefreshToken) {
//       throw new Error(
//         response.data?.error?.message ??
//           "토큰 재발급 응답에 access_token/refresh_token이 없습니다.",
//       );
//     }
//
//     const tokens = {
//       accessToken: nextAccessToken,
//       refreshToken: nextRefreshToken,
//     };
//
//     setStoredSessionTokens(tokens);
//
//     return tokens;
//   })()
//     .catch((refreshError) => {
//       console.error("Session expired:", refreshError);
//       clearStoredSession();
//
//       if (typeof window !== "undefined") {
//         window.alert("세션이 만료되었습니다. 다시 로그인해주세요.");
//         if (window.location.pathname !== "/auth/login") {
//           window.location.assign("/auth/login");
//         }
//       }
//
//       throw refreshError;
//     })
//     .finally(() => {
//       refreshPromise = null;
//     });
//
//   return refreshPromise;
// };

export const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();
  const headers = AxiosHeaders.from(config.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else {
    headers.delete("Authorization");
  }

  config.headers = headers;

  return config;
});

// api.interceptors.response.use(
//   (response) => {
//     if (response.data?.error?.code === "C401") {
//       return Promise.reject({
//         config: response.config,
//         response: { ...response, status: 401, config: response.config },
//       });
//     }
//
//     return response;
//   },
//   async (error: AxiosError<ApiErrorResponse>) => {
//     const originalRequest = error?.config as RetryableRequestConfig | undefined;
//
//     const isReissueRequest =
//       typeof originalRequest?.url === "string" &&
//       originalRequest.url.includes("/v1/auth/reissue");
//
//     if (!originalRequest) {
//       return Promise.reject(error);
//     }
//
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry &&
//       !isReissueRequest
//     ) {
//       originalRequest._retry = true;
//
//       try {
//         const tokens = await reissueAccessToken();
//         const headers = AxiosHeaders.from(originalRequest.headers);
//
//         headers.set("Authorization", `Bearer ${tokens.accessToken}`);
//         originalRequest.headers = headers;
//
//         return api(originalRequest);
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//
//     return Promise.reject(error);
//   },
// );
