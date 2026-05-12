import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginLoadingPage } from "@auth/pages";
import { AuthFlowError, buildLoginErrorPath, createAuthErrorInfo, getGoogleOAuthErrorMessage, normalizeAuthError } from "@auth/utils";
import type { ApiResponse, LoginResponseData } from "@auth/types";
import { getDefaultRouteByRole, useAuthSessionStore } from "@/auth/stores";
import { validateGoogleOAuthState } from "@auth/api/googleOAuth";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clearSession = useAuthSessionStore((state) => state.clearSession);
  const setSessionFromLoginResponse = useAuthSessionStore(
    (state) => state.setSessionFromLoginResponse,
  );
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  useEffect(() => {
    let isActive = true;

    const processGoogleLogin = async () => {
      try {
        if (error) {
          throw new AuthFlowError(
            createAuthErrorInfo({
              reason: "oauth",
              message: getGoogleOAuthErrorMessage(error),
            }),
          );
        }

        if (!code) {
          navigate("/auth/login", { replace: true });
          return;
        }

        validateGoogleOAuthState(state);
        const encodedCode = encodeURIComponent(code);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/v1/auth/login?code=${encodedCode}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        );

        let payload: ApiResponse<LoginResponseData> | null = null;

        try {
          payload = (await response.json()) as ApiResponse<LoginResponseData>;
        } catch {
          payload = null;
        }

        if (!response.ok || !payload?.data) {
          throw new AuthFlowError(
            createAuthErrorInfo({
              code: payload?.error?.code ?? null,
              message:
                payload?.error?.message ??
                (response.ok
                  ? null
                  : response.statusText || "Google login failed"),
              status: response.status,
            }),
          );
        }

        const loginResponse = payload.data;

        setSessionFromLoginResponse(loginResponse);

        if (!isActive) {
          return;
        }

        navigate(getDefaultRouteByRole(loginResponse.role), {
          replace: true,
        });
      } catch (caughtError) {
        clearSession();

        if (!isActive) {
          return;
        }

        navigate(buildLoginErrorPath(normalizeAuthError(caughtError)), {
          replace: true,
        });
      }
    };

    void processGoogleLogin();

    return () => {
      isActive = false;
    };
  }, [
    clearSession,
    code,
    error,
    navigate,
    setSessionFromLoginResponse,
    state,
  ]);

  return <LoginLoadingPage />;
};

export default GoogleCallback;
